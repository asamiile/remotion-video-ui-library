import { hashGlsl } from "../../helpers/shader/glsl/noise";
import { streetSceneGlsl } from "../../helpers/shader/glsl/street-scene";

/**
 * The street as a spinning LiDAR sees it.
 *
 * Each pixel raymarches the scene from the chase camera, then asks whether
 * that surface point lies on one of the sensor's laser rings (quantized
 * elevation) at one of its samples (quantized azimuth), and whether the
 * sensor can actually see it (a second ray from the sensor). Points behind
 * cars and poles therefore leave real LiDAR shadows. Line widths come from
 * screen-space derivatives so rings stay about one pixel wide at any range.
 */
export const lidarPointCloudGlsl = /* glsl */ `
${hashGlsl}
${streetSceneGlsl}

uniform vec4 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uBoxColor;
uniform float uColorMode;
uniform float uBeams;
uniform float uPointsPerTurn;
uniform float uMaxRange;
uniform float uShowBoxes;
uniform float uGrid;
uniform float uPhase;
uniform float uSweepTurns;

const float PI = 3.14159265359;
const float TAU = 6.28318530718;
const float ELEV_MIN = -0.42;
const float ELEV_MAX = 0.17;

void main() {
  vec3 ro, rd;
  sceneCamera(ro, rd);
  vec2 hit = sceneRaycast(ro, rd, 160.0, uShowBoxes);
  float t = hit.x;
  float id = hit.y;
  vec3 p = ro + rd * t;

  vec3 sensor = vec3(EGO_X, 2.05, uTravel);
  vec3 v = p - sensor;
  float dist = length(v);
  float elev = asin(clamp(v.y / max(dist, 1e-3), -1.0, 1.0));
  float az = atan(v.x, v.z);

  // Ring and sample coordinates; derivatives taken in uniform control flow.
  float e = (elev - ELEV_MIN) / (ELEV_MAX - ELEV_MIN) * uBeams;
  float a = (az / TAU + 0.5) * uPointsPerTurn;
  float we = clamp(fwidth(e), 1e-4, 0.5);
  float wa = clamp(fwidth(a), 1e-4, 1.0);
  float de = abs(e - floor(e + 0.5));
  float da = abs(a - floor(a + 0.5));
  float ring = 1.0 - smoothstep(we * 0.6, we * 1.6, de);
  float onSample = 1.0 - smoothstep(max(0.1, wa * 0.6), max(0.1, wa * 0.6) + wa + 0.05, da);
  float inBeams = step(0.0, e) * step(e, uBeams);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  bool isSurface = id != ID_SKY && id != ID_EGO && id != ID_BOX;
  if (isSurface && dist < uMaxRange) {
    // Can the sensor see this point?
    vec3 toPoint = v / dist;
    vec2 seen = sceneRaycast(sensor + toPoint * 0.4, toPoint, dist, 0.0);
    float visible = step(dist - 0.4 - (0.05 + 0.004 * dist), seen.x);

    float range = dist / uMaxRange;
    vec3 pointColor = uColorA;
    if (uColorMode < 0.5) pointColor = turbo(0.08 + range * 0.9);
    else if (uColorMode < 1.5) pointColor = mix(uColorA, uColorB, clamp(p.y / 9.0, 0.0, 1.0));

    // Painted markings return more light.
    float reflectivity = id == ID_ROAD ? 0.75 + 0.6 * laneMarkings(p) : 1.0;

    // The spinning sweep refreshes points; older returns dim a little.
    float head = TAU * fract(uPhase * uSweepTurns);
    float behind = mod(head - (az + PI), TAU);
    float sweep = uSweepTurns > 0.5 ? 0.45 + 0.55 * exp(-behind * 0.9) : 1.0;

    float fade = 1.0 - smoothstep(0.75, 1.0, range);
    float pts = ring * onSample * inBeams * visible * fade;
    float g = pts * reflectivity * sweep;
    col += pointColor * g * 1.3;
    alpha = max(alpha, clamp(g * 1.3, 0.0, 1.0));
  }

  // Range rings on the ground around the sensor, every 10 units.
  if (uGrid > 0.5 && (id == ID_ROAD || id == ID_SIDEWALK)) {
    float rr = length(p.xz - sensor.xz);
    float rw = clamp(fwidth(rr), 1e-4, 1.0);
    float rings = 1.0 - smoothstep(rw * 0.5, rw * 1.5, abs(mod(rr + 5.0, 10.0) - 5.0));
    float spokes = 1.0 - smoothstep(0.0, clamp(fwidth(az) * 1.5, 1e-4, 0.2), abs(mod(az + PI / 8.0, PI / 4.0) - PI / 8.0));
    float grid = (rings + spokes * 0.5) * (1.0 - smoothstep(30.0, 60.0, rr)) * 0.16;
    col += uBoxColor * grid;
    alpha = max(alpha, grid);
  }

  // Ego car: dark body with a lit rim.
  if (id == ID_EGO) {
    vec3 n = sceneNormal(p, 0.0);
    float rim = pow(1.0 - abs(dot(n, -rd)), 3.0);
    col = vec3(0.05, 0.06, 0.08) + uBoxColor * rim * 0.7;
    alpha = 1.0;
  }

  // 3D detection boxes.
  if (id == ID_BOX) {
    float boxFade = 1.0 - smoothstep(0.7, 1.0, t / uMaxRange);
    col = uBoxColor * boxFade;
    alpha = boxFade;
  }

  alpha = clamp(alpha, 0.0, 1.0);
  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(min(col, vec3(alpha)), alpha) + bg * (1.0 - alpha);
}
`;
