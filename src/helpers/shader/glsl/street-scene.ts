/**
 * A procedural city street for the computer-vision compositions: road with
 * lanes, sidewalks, buildings, poles, trees and cars, seen from a chase
 * camera behind an ego car. Requires `hashGlsl`.
 *
 * The scene repeats every STREET_LOOP units along z (every repeating element
 * picks its variation from `mod(cell, count)`), so a camera that travels a
 * whole number of STREET_LOOP lengths per composition loops seamlessly.
 *
 * Pedestrians walk on the sidewalks; their pattern repeats every
 * PERSON_LOOP units, so uWalk must change by a whole multiple of PERSON_LOOP
 * over the composition loop (and uTravel by a whole multiple of STREET_LOOP).
 *
 * Uniforms: uTravel (camera z), uWalk (pedestrian travel). The `boxes`
 * argument (1 = draw 3D detection boxes on cars) is passed per call.
 */
/** Street length after which the scene repeats; must match the GLSL. */
export const STREET_LOOP = 72;
/** Pedestrian pattern length; must match the GLSL. */
export const PERSON_LOOP = 18;

export const streetSceneGlsl = /* glsl */ `
uniform float uTravel;
uniform float uWalk;

const float STREET_LOOP = 72.0;
const float PERSON_LOOP = 18.0;

const float ID_SKY = 0.0;
const float ID_ROAD = 1.0;
const float ID_SIDEWALK = 2.0;
const float ID_BUILDING = 3.0;
const float ID_POLE = 4.0;
const float ID_VEGETATION = 5.0;
const float ID_CAR = 6.0;
const float ID_EGO = 7.0;
const float ID_BOX = 8.0;
const float ID_PERSON = 9.0;

// Ego car lane.
const float EGO_X = 1.5;

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  return sdBox(p, b - r) - r;
}

float sdBoxFrame(vec3 p, vec3 b, float e) {
  p = abs(p) - b;
  vec3 q = abs(p + e) - e;
  return min(min(
    length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
    length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
    length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
}

float sdCylinderY(vec3 p, float r, float halfHeight) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, halfHeight);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float cellHash(float cell, float count, float salt) {
  return hash12(vec2(mod(cell, count), salt));
}

vec2 opU(vec2 a, vec2 b) {
  return a.x < b.x ? a : b;
}

float sdCar(vec3 local) {
  float body = sdRoundBox(local - vec3(0.0, 0.6, 0.0), vec3(0.95, 0.42, 2.15), 0.18);
  float cabin = sdRoundBox(local - vec3(0.0, 1.22, -0.25), vec3(0.82, 0.32, 1.15), 0.2);
  return min(body, cabin);
}

// Repeated elements are evaluated in their own cell and both neighbours, and
// the distance is capped by how far the ray can travel before a cell beyond
// those could matter. Without this, empty cells (or a near neighbour) let the
// march overshoot into the next object and leave sawtooth artifacts.

// One lane of cars. shift moves the lane along z; it must change by a whole
// multiple of STREET_LOOP over the composition loop.
vec2 carLane(vec3 p, float laneX, float shift, float salt, float boxes) {
  float period = 18.0;
  float z = p.z - shift;
  float base = floor(z / period);
  vec2 res = vec2(1.5 * period - abs(z - (base + 0.5) * period), ID_CAR);
  for (int k = -1; k <= 1; k++) {
    float cell = base + float(k);
    if (cellHash(cell, STREET_LOOP / period, salt) < 0.35) continue;
    vec3 local = vec3(p.x - laneX, p.y, z - (cell + 0.5) * period);
    res = opU(res, vec2(sdCar(local), ID_CAR));
    if (boxes > 0.5) {
      res = opU(res, vec2(sdBoxFrame(local - vec3(0.0, 0.8, 0.0), vec3(1.05, 0.8, 2.3), 0.03), ID_BOX));
    }
  }
  return res;
}

// A walking figure; swing in [-1, 1] drives the legs and arms.
float sdPerson(vec3 local, float swing) {
  float d = sdCapsule(local, vec3(0.0, 0.98, 0.0), vec3(0.0, 1.42, 0.0), 0.19);
  d = min(d, length(local - vec3(0.0, 1.7, 0.0)) - 0.12);
  for (int k = 0; k < 2; k++) {
    float s = k == 0 ? 1.0 : -1.0;
    d = min(d, sdCapsule(local, vec3(0.1 * s, 0.92, 0.0), vec3(0.1 * s, 0.07, 0.3 * swing * s), 0.075));
    d = min(d, sdCapsule(local, vec3(0.25 * s, 1.4, 0.0), vec3(0.27 * s, 0.95, -0.22 * swing * s), 0.055));
  }
  return d;
}

// One sidewalk lane of pedestrians walking in direction dir (+1 / -1).
vec2 personLane(vec3 p, float laneOffset, float dir, float salt) {
  float period = 6.0;
  float z = p.z - dir * uWalk;
  float base = floor(z / period);
  float d = 1.5 * period - abs(z - (base + 0.5) * period);
  for (int k = -1; k <= 1; k++) {
    float cell = base + float(k);
    float h = cellHash(cell, PERSON_LOOP / period, salt);
    if (h < 0.35) continue;
    vec3 local = vec3(abs(p.x) - laneOffset - (h - 0.6) * 0.6, p.y, z - (cell + 0.5) * period);
    local.z *= dir;
    // 13 strides per PERSON_LOOP keeps the gait on the loop.
    float swing = sin(uWalk * 6.28318530718 * 13.0 / PERSON_LOOP + h * 40.0);
    d = min(d, sdPerson(local, swing));
  }
  return vec2(d, ID_PERSON);
}

vec2 sceneMap(vec3 p, float boxes) {
  // Road surface and raised sidewalks.
  vec2 res = vec2(p.y, ID_ROAD);
  float sidewalk = max(abs(p.x) - 9.0, 6.0 - abs(p.x));
  res = opU(res, vec2(max(sidewalk, p.y - 0.16), ID_SIDEWALK));

  float side = p.x < 0.0 ? -1.0 : 1.0;
  float ax = abs(p.x);
  const float period = 12.0;
  const float count = STREET_LOOP / 12.0;

  // Buildings.
  {
    float base = floor(p.z / period);
    float salt = side * 3.1;
    float d = 1.5 * period - abs(p.z - (base + 0.5) * period);
    for (int k = -1; k <= 1; k++) {
      float cell = base + float(k);
      if (cellHash(cell, count, salt + 4.2) < 0.12) continue;
      float h = cellHash(cell, count, salt);
      float height = 5.0 + h * h * 22.0;
      float depthJitter = cellHash(cell, count, salt + 1.7);
      vec3 local = vec3(ax - (13.5 + depthJitter * 1.2), p.y - height * 0.5, p.z - (cell + 0.5) * period);
      d = min(d, sdBox(local, vec3(4.0, height * 0.5, 5.6)));
    }
    res = opU(res, vec2(d, ID_BUILDING));
  }

  // Street-light poles.
  {
    float base = floor((p.z + 3.0) / period);
    float d = 1e3;
    for (int k = -1; k <= 1; k++) {
      float cell = base + float(k);
      vec3 local = vec3(ax - 6.7, p.y - 2.8, p.z + 3.0 - (cell + 0.5) * period);
      d = min(d, sdCylinderY(local, 0.09, 2.8));
      d = min(d, sdBox(local - vec3(-0.6, 2.75, 0.0), vec3(0.65, 0.06, 0.1)));
    }
    res = opU(res, vec2(d, ID_POLE));
  }

  // Trees.
  {
    float base = floor((p.z - 3.0) / period);
    float d = 1.5 * period - abs(p.z - 3.0 - (base + 0.5) * period);
    for (int k = -1; k <= 1; k++) {
      float cell = base + float(k);
      if (cellHash(cell, count, side * 7.7) < 0.3) continue;
      vec3 local = vec3(ax - 8.0, p.y, p.z - 3.0 - (cell + 0.5) * period);
      float trunk = sdCylinderY(local - vec3(0.0, 1.2, 0.0), 0.16, 1.2);
      float crown = length(local - vec3(0.0, 3.4, 0.0)) - 1.5;
      d = min(d, min(trunk, crown));
    }
    res = opU(res, vec2(d, ID_VEGETATION));
  }

  // Pedestrians: two sidewalk lanes per side, walking opposite ways.
  res = opU(res, personLane(p, 7.35, side, side * 2.3 + 5.0));
  res = opU(res, personLane(p, 8.75, -side, side * 2.3 + 9.0));

  // Traffic: parked cars on the right, oncoming traffic on the left.
  res = opU(res, carLane(p, 4.5, 0.0, 11.0, boxes));
  res = opU(res, carLane(p, -1.5, -uTravel, 23.0, boxes));
  res = opU(res, carLane(p, -4.5, -uTravel * 2.0, 37.0, boxes));

  // Ego car, which carries the camera and the sensor.
  vec3 ego = vec3(p.x - EGO_X, p.y, p.z - uTravel);
  res = opU(res, vec2(sdCar(ego), ID_EGO));

  return res;
}

vec3 sceneNormal(vec3 p, float boxes) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.002;
  return normalize(
    k.xyy * sceneMap(p + k.xyy * h, boxes).x +
    k.yyx * sceneMap(p + k.yyx * h, boxes).x +
    k.yxy * sceneMap(p + k.yxy * h, boxes).x +
    k.xxx * sceneMap(p + k.xxx * h, boxes).x);
}

// Returns (distance along the ray, id); id is ID_SKY on a miss.
vec2 sceneRaycast(vec3 ro, vec3 rd, float maxDist, float boxes) {
  float t = 0.05;
  for (int i = 0; i < 140; i++) {
    vec2 h = sceneMap(ro + rd * t, boxes);
    if (h.x < 0.0015 * t) return vec2(t, h.y);
    // Domain repetition makes the field inexact; under-step a little.
    t += h.x * 0.8;
    if (t > maxDist) break;
  }
  return vec2(maxDist, ID_SKY);
}

// Pinhole camera. zoom is the focal length in screen heights.
struct Camera {
  vec3 ro;
  vec3 forward;
  vec3 right;
  vec3 up;
  float zoom;
};

Camera lookAtCamera(vec3 ro, vec3 target, vec3 worldUp, float zoom) {
  Camera cam;
  cam.ro = ro;
  cam.forward = normalize(target - ro);
  cam.right = normalize(cross(worldUp, cam.forward));
  cam.up = cross(cam.forward, cam.right);
  cam.zoom = zoom;
  return cam;
}

// Chase camera behind and above the ego car.
Camera chaseCamera() {
  return lookAtCamera(vec3(EGO_X - 0.4, 8.5, uTravel - 13.0), vec3(EGO_X - 0.6, 0.8, uTravel + 16.0), vec3(0.0, 1.0, 0.0), 1.25);
}

// Ray through a 0-1 screen position.
vec3 cameraRay(Camera cam, vec2 uv01) {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = (uv01 - 0.5) * vec2(aspect, 1.0);
  return normalize(cam.forward * cam.zoom + uv.x * cam.right + uv.y * cam.up);
}

// World point to 0-1 screen position (z = depth along the view axis).
vec3 cameraProject(Camera cam, vec3 q) {
  float aspect = uResolution.x / uResolution.y;
  vec3 v = q - cam.ro;
  float z = dot(v, cam.forward);
  vec2 uv = vec2(dot(v, cam.right), dot(v, cam.up)) * cam.zoom / max(z, 1e-3);
  return vec3(uv / vec2(aspect, 1.0) + 0.5, z);
}

void sceneCamera(out vec3 ro, out vec3 rd) {
  Camera cam = chaseCamera();
  ro = cam.ro;
  rd = cameraRay(cam, vUv);
}

// Painted lane markings (1 on paint), for road hits.
float laneMarkings(vec3 p) {
  float dash = step(0.5, fract(p.z / 6.0));
  float center = max(step(abs(abs(p.x) - 0.12), 0.06), 0.0);
  float lanes = step(abs(abs(p.x) - 3.0), 0.08) * dash;
  float edge = step(abs(abs(p.x) - 5.8), 0.08);
  return max(max(center, lanes), edge);
}

// Turbo colormap (polynomial approximation), x in [0, 1].
vec3 turbo(float x) {
  x = clamp(x, 0.0, 1.0);
  const vec4 kR = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kG = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kB = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kR2 = vec2(-152.94239396, 59.28637943);
  const vec2 kG2 = vec2(4.27729857, 2.82956604);
  const vec2 kB2 = vec2(-89.90310912, 27.34824973);
  vec4 v4 = vec4(1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(dot(v4, kR) + dot(v2, kR2), dot(v4, kG) + dot(v2, kG2), dot(v4, kB) + dot(v2, kB2));
}

// ---- Shading shared by the camera-like views ----

const vec3 SUN = vec3(-0.45, 0.72, 0.53);

vec3 skyColor(vec3 rd) {
  return mix(vec3(0.93, 0.86, 0.78), vec3(0.45, 0.63, 0.86), clamp(rd.y * 2.2 + 0.15, 0.0, 1.0));
}

float laneShift(float x) {
  if (x < -3.0) return -uTravel * 2.0;
  if (x < 0.0) return -uTravel;
  return 0.0;
}

// Street-scene segmentation palette.
vec3 segmentColor(float id) {
  if (id == ID_ROAD) return vec3(128.0, 64.0, 128.0) / 255.0;
  if (id == ID_SIDEWALK) return vec3(244.0, 35.0, 232.0) / 255.0;
  if (id == ID_BUILDING) return vec3(70.0) / 255.0;
  if (id == ID_POLE) return vec3(153.0) / 255.0;
  if (id == ID_VEGETATION) return vec3(107.0, 142.0, 35.0) / 255.0;
  if (id == ID_CAR) return vec3(0.0, 0.0, 142.0) / 255.0;
  if (id == ID_EGO) return vec3(20.0, 20.0, 40.0) / 255.0;
  if (id == ID_PERSON) return vec3(220.0, 20.0, 60.0) / 255.0;
  return vec3(70.0, 130.0, 180.0) / 255.0;
}

vec3 sceneAlbedo(vec3 p, vec3 n, float id) {
  if (id == ID_ROAD) return mix(vec3(0.16, 0.16, 0.17), vec3(0.9), laneMarkings(p));
  if (id == ID_SIDEWALK) return vec3(0.52, 0.5, 0.47);
  if (id == ID_POLE) return vec3(0.3, 0.31, 0.33);
  if (id == ID_VEGETATION) return vec3(0.17, 0.32, 0.12) * (0.75 + 0.5 * hash12(floor(p.xy * 6.0) + floor(p.z * 6.0)));
  if (id == ID_EGO) return vec3(0.08, 0.09, 0.1);
  if (id == ID_PERSON) {
    if (p.y > 1.56) return vec3(0.55, 0.4, 0.32);
    float h = hash12(floor(vec2(p.x * 0.5, p.z / 6.0)) + 3.0);
    vec3 top = h < 0.33 ? vec3(0.7, 0.2, 0.15) : h < 0.66 ? vec3(0.2, 0.35, 0.6) : vec3(0.85, 0.8, 0.7);
    return p.y > 0.95 ? top : vec3(0.12, 0.13, 0.18);
  }
  if (id == ID_CAR) {
    float cell = floor((p.z - laneShift(p.x)) / 18.0);
    float h = hash12(vec2(mod(cell, 4.0), floor(p.x)));
    vec3 c = h < 0.25 ? vec3(0.75, 0.1, 0.08) : h < 0.5 ? vec3(0.85) : h < 0.75 ? vec3(0.12, 0.25, 0.55) : vec3(0.06);
    return p.y > 1.0 ? vec3(0.05, 0.07, 0.1) : c;
  }
  // Buildings: tinted facade with a window grid.
  float side = p.x < 0.0 ? -1.0 : 1.0;
  float cell = floor(p.z / 12.0);
  float h = hash12(vec2(mod(cell, 6.0), side * 5.3));
  vec3 facade = h < 0.33 ? vec3(0.62, 0.55, 0.47) : h < 0.66 ? vec3(0.5, 0.32, 0.26) : vec3(0.55, 0.57, 0.6);
  float u = abs(n.x) > 0.5 ? p.z : p.x;
  float windows = step(0.35, fract(p.y / 3.0)) * step(0.3, fract(u / 2.2)) * step(1.5, p.y) * (1.0 - step(0.5, n.y));
  return mix(facade, vec3(0.12, 0.17, 0.24), windows * 0.85);
}

// Sunlit, shadowed, fogged color as a camera would record it.
vec3 shadeCamera(vec3 rd, vec3 p, vec3 n, float t, float id) {
  if (id == ID_SKY) return skyColor(rd);
  vec3 sun = normalize(SUN);
  float diff = max(dot(n, sun), 0.0);
  float shadow = diff > 0.0 ? step(30.0, sceneRaycast(p + n * 0.02, sun, 30.0, 0.0).x) : 0.0;
  vec3 a = sceneAlbedo(p, n, id);
  vec3 c = a * (vec3(1.0, 0.95, 0.85) * diff * shadow * 1.15 + skyColor(n) * 0.42);
  float spec = id == ID_CAR || id == ID_EGO ? pow(max(dot(reflect(rd, n), sun), 0.0), 40.0) * shadow : 0.0;
  c += spec * 0.6;
  return mix(c, skyColor(rd), 1.0 - exp(-t * 0.011));
}
`;
