import { hashGlsl } from "../../helpers/shader/glsl/noise";
import { streetSceneGlsl } from "../../helpers/shader/glsl/street-scene";

/**
 * Dense optical flow of the street, computed exactly instead of estimated:
 * every surface point is moved by its own velocity minus the camera's over
 * one frame and re-projected, giving its screen motion in pixels per frame.
 * Shown with the standard flow color wheel (hue = direction, saturation =
 * speed) and optionally a grid of arrows sampled at the cell centers.
 */
export const opticalFlowGlsl = /* glsl */ `
${hashGlsl}
${streetSceneGlsl}

uniform float uTravelRate;
uniform float uWalkRate;
uniform float uFps;
uniform float uBackgroundMode;
uniform float uShowArrows;
uniform float uArrowSpacing;
uniform float uArrowScale;
uniform float uArrowFixed;
uniform vec3 uArrowColor;
uniform float uMaxFlow;

const float TAU = 6.28318530718;

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

// World velocity (units per second) of the surface at p.
vec3 surfaceVelocity(vec3 p, float id) {
  if (id == ID_EGO) return vec3(0.0, 0.0, uTravelRate);
  if (id == ID_CAR || id == ID_BOX) {
    if (p.x < -3.0) return vec3(0.0, 0.0, -2.0 * uTravelRate);
    if (p.x < 0.0) return vec3(0.0, 0.0, -uTravelRate);
    return vec3(0.0);
  }
  if (id == ID_PERSON) {
    float side = p.x < 0.0 ? -1.0 : 1.0;
    float dir = abs(p.x) < 8.05 ? side : -side;
    return vec3(0.0, 0.0, dir * uWalkRate);
  }
  return vec3(0.0);
}

// Screen motion in pixels per frame through a 0-1 screen position.
vec2 flowAt(Camera cam, vec2 uv01, out vec3 p, out float id, out float t, out vec3 rd) {
  rd = cameraRay(cam, uv01);
  vec2 hit = sceneRaycast(cam.ro, rd, 160.0, 0.0);
  t = hit.x;
  id = hit.y;
  p = cam.ro + rd * t;
  if (id == ID_SKY) return vec2(0.0);
  vec3 relative = (surfaceVelocity(p, id) - vec3(0.0, 0.0, uTravelRate)) / uFps;
  vec3 a = cameraProject(cam, p);
  vec3 b = cameraProject(cam, p + relative);
  return (b.xy - a.xy) * uResolution;
}

vec3 flowColor(vec2 flow, float zeroWhite) {
  float mag = clamp(length(flow) / uMaxFlow, 0.0, 1.0);
  float hue = atan(flow.y, flow.x) / TAU + 0.5;
  return zeroWhite > 0.5 ? hsv2rgb(vec3(hue, mag, 1.0)) : hsv2rgb(vec3(hue, 1.0, mag));
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  Camera cam = chaseCamera();
  vec3 p, rd;
  float id, t;
  vec2 flow = flowAt(cam, vUv, p, id, t, rd);

  vec3 col;
  if (uBackgroundMode < 0.5) {
    col = flowColor(flow, 1.0);
  } else if (uBackgroundMode < 1.5) {
    col = flowColor(flow, 0.0) * 0.55;
  } else {
    vec3 n = id == ID_SKY ? -rd : sceneNormal(p, 0.0);
    col = shadeCamera(rd, p, n, t, id) * 0.5;
  }

  if (uShowArrows > 0.5) {
    vec2 px = vUv * uResolution;
    vec2 center = (floor(px / uArrowSpacing) + 0.5) * uArrowSpacing;
    vec3 cp, crd;
    float cid, ct;
    vec2 cf = flowAt(cam, center / uResolution, cp, cid, ct, crd);
    vec2 v = cf * uArrowScale;
    float len = length(v);
    float maxLen = uArrowSpacing * 0.9;
    if (len > maxLen) v *= maxLen / len;
    len = min(len, maxLen);
    vec2 a = center - v * 0.5;
    vec2 b = center + v * 0.5;
    float d = segmentDistance(px, a, b);
    if (len > 3.0) {
      vec2 dir = v / len;
      vec2 side = vec2(-dir.y, dir.x);
      float head = min(len * 0.35, 9.0);
      d = min(d, segmentDistance(px, b, b - dir * head + side * head * 0.6));
      d = min(d, segmentDistance(px, b, b - dir * head - side * head * 0.6));
    }
    float stroke = 1.0 - smoothstep(0.6, 1.6, d);
    // Still points get a small dot.
    stroke = max(stroke, (1.0 - smoothstep(1.0, 2.0, length(px - center))) * step(len, 3.0) * 0.5);
    vec3 arrowCol = uArrowFixed > 0.5 ? uArrowColor : hsv2rgb(vec3(atan(cf.y, cf.x) / TAU + 0.5, 0.7, 1.0));
    if (uBackgroundMode < 0.5) arrowCol = vec3(0.08);
    col = mix(col, arrowCol, stroke);
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
