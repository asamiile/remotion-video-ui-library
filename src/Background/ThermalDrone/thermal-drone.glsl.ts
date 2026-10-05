import { hashGlsl, valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";
import { streetSceneGlsl } from "../../helpers/shader/glsl/street-scene";

/**
 * The street from a drone's thermal camera.
 *
 * Each surface gets a temperature (people and running engines hot, trees and
 * paint cool, sunlit asphalt warmer than shade), mapped through a thermal
 * palette with sensor noise. Tracking brackets are drawn in screen space by
 * projecting the known centers of nearby pedestrians and cars.
 */
export const thermalDroneGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}
${streetSceneGlsl}

uniform float uPhase;
uniform float uAltitude;
uniform float uPalette;
uniform float uNoise;
uniform float uTrackPeople;
uniform float uTrackVehicles;
uniform vec3 uHud;
uniform vec3 uVehicle;

const float TAU = 6.28318530718;

Camera droneCamera() {
  float sway = sin(TAU * uPhase);
  vec3 ro = vec3(1.2 * sway, uAltitude, uTravel - uAltitude * 0.2);
  vec3 target = vec3(0.6 * sway, 0.0, uTravel + uAltitude * 0.22);
  return lookAtCamera(ro, target, vec3(0.0, 0.0, 1.0), 1.35);
}

// Heading of traffic in each lane: +1 drives toward +z.
float laneHeading(float x) {
  return x < 0.0 ? -1.0 : 1.0;
}

float temperature(vec3 p, vec3 n, float id) {
  float grain = valueNoise3(p * 1.7) * 0.06;
  if (id == ID_SKY) return 0.0;
  if (id == ID_PERSON) return p.y > 1.0 ? 0.95 : 0.78;
  if (id == ID_VEGETATION) return 0.16 + grain * 1.5;
  if (id == ID_POLE) return 0.3;
  if (id == ID_CAR || id == ID_EGO) {
    bool parked = id == ID_CAR && p.x > 3.0;
    float shift = id == ID_EGO ? uTravel : laneShift(p.x);
    float local = id == ID_EGO ? p.z - uTravel : mod(p.z - shift, 18.0) - 9.0;
    float front = local * laneHeading(id == ID_EGO ? 1.0 : p.x);
    float body = parked ? 0.42 : 0.5;
    float hood = parked ? 0.0 : smoothstep(0.9, 1.9, front) * 0.38;
    float exhaust = parked ? 0.0 : (1.0 - smoothstep(-2.1, -1.6, front)) * step(p.y, 0.6) * 0.4;
    float glass = step(1.02, p.y) * -0.16;
    return body + hood + exhaust + glass + grain;
  }

  // Ground and buildings warm up in the sun.
  vec3 sun = normalize(SUN);
  float lit = max(dot(n, sun), 0.0);
  float shadow = lit > 0.0 ? step(30.0, sceneRaycast(p + n * 0.02, sun, 30.0, 0.0).x) : 0.0;
  float solar = lit * shadow * 0.14;
  if (id == ID_ROAD) return 0.38 + solar - laneMarkings(p) * 0.1 + grain;
  if (id == ID_SIDEWALK) return 0.34 + solar + grain;
  // Buildings: roofs with hot rooftop units.
  float roof = step(0.5, n.y);
  vec2 unit = floor(p.xz / 2.5);
  float hot = roof * step(0.86, hash12(unit + 17.0)) * 0.4;
  return 0.3 + solar * 0.8 + hot + grain;
}

vec3 thermalPalette(float x) {
  x = clamp(x, 0.0, 1.0);
  if (uPalette < 0.5) return vec3(x);
  if (uPalette < 1.5) return vec3(1.0 - x);
  vec3 c0 = vec3(0.0, 0.0, 0.05);
  vec3 c1 = vec3(0.35, 0.0, 0.55);
  vec3 c2 = vec3(0.85, 0.15, 0.25);
  vec3 c3 = vec3(1.0, 0.6, 0.0);
  vec3 c4 = vec3(1.0, 1.0, 0.85);
  if (x < 0.25) return mix(c0, c1, x / 0.25);
  if (x < 0.5) return mix(c1, c2, (x - 0.25) / 0.25);
  if (x < 0.75) return mix(c2, c3, (x - 0.5) / 0.25);
  return mix(c3, c4, (x - 0.75) / 0.25);
}

// Corner brackets around a screen-space box (pixels).
float brackets(vec2 px, vec2 center, vec2 halfSize) {
  vec2 d = abs(px - center);
  vec2 q = d - halfSize;
  float outline = abs(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0));
  float corner = step(0.6, min(d.x / halfSize.x, d.y / halfSize.y));
  return (1.0 - smoothstep(1.0, 2.2, outline)) * corner;
}

float trackPeople(Camera cam, vec2 px) {
  float mark = 0.0;
  for (int lane = 0; lane < 4; lane++) {
    float side = lane < 2 ? 1.0 : -1.0;
    bool inner = lane == 0 || lane == 2;
    float offset = inner ? 7.35 : 8.75;
    float dir = inner ? side : -side;
    float salt = side * 2.3 + (inner ? 5.0 : 9.0);
    float base = floor((uTravel - dir * uWalk) / 6.0);
    for (int k = -4; k <= 9; k++) {
      float cell = base + float(k);
      float h = cellHash(cell, PERSON_LOOP / 6.0, salt);
      if (h < 0.35) continue;
      vec3 center = vec3(side * (offset + (h - 0.6) * 0.6), 1.0, (cell + 0.5) * 6.0 + dir * uWalk);
      vec3 s = cameraProject(cam, center);
      vec2 c = s.xy * uResolution;
      float size = 0.9 * cam.zoom / s.z * uResolution.y;
      mark = max(mark, brackets(px, c, vec2(size)));
    }
  }
  return mark;
}

float trackVehicles(Camera cam, vec2 px) {
  float mark = 0.0;
  for (int lane = 0; lane < 3; lane++) {
    float laneX = lane == 0 ? 4.5 : lane == 1 ? -1.5 : -4.5;
    float shift = lane == 0 ? 0.0 : lane == 1 ? -uTravel : -uTravel * 2.0;
    float salt = lane == 0 ? 11.0 : lane == 1 ? 23.0 : 37.0;
    float base = floor((uTravel - shift) / 18.0);
    for (int k = -2; k <= 4; k++) {
      float cell = base + float(k);
      if (cellHash(cell, STREET_LOOP / 18.0, salt) < 0.35) continue;
      vec3 center = vec3(laneX, 0.8, (cell + 0.5) * 18.0 + shift);
      vec3 s = cameraProject(cam, center);
      vec2 c = s.xy * uResolution;
      float unit = cam.zoom / s.z * uResolution.y;
      mark = max(mark, brackets(px, c, vec2(1.35, 2.6) * unit));
    }
  }
  return mark;
}

void main() {
  Camera cam = droneCamera();
  vec3 rd = cameraRay(cam, vUv);
  vec2 hit = sceneRaycast(cam.ro, rd, 200.0, 0.0);
  vec3 p = cam.ro + rd * hit.x;
  vec3 n = hit.y == ID_SKY ? -rd : sceneNormal(p, 0.0);

  float temp = temperature(p, n, hit.y);
  // Sensor noise re-rolls every frame (loops with the frame count).
  temp += (hash12(floor(vUv * uResolution / 2.0) + uFrame * 7.31) - 0.5) * 0.08 * uNoise;
  vec3 col = thermalPalette(temp);

  // Lens vignette.
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.9;

  vec2 px = vUv * uResolution;
  if (uTrackPeople > 0.5) col = mix(col, uHud, trackPeople(cam, px));
  if (uTrackVehicles > 0.5) col = mix(col, uVehicle, trackVehicles(cam, px));

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
