import { hashGlsl } from "../../../helpers/shader/glsl/noise";
import { streetSceneGlsl } from "../../../helpers/shader/glsl/street-scene";

/**
 * Computer-vision passes over a source image or video (or the procedural
 * street when no source is set).
 *
 * Every pass needs only one source sample per pixel: gradients come from
 * screen-space derivatives (dFdx / dFdy) of the sampled luminance, so the
 * same code works on footage and on the raymarched demo scene.
 *
 * Modes: 0 edges, 1 thermal, 2 segment, 3 attention, 4 mosaic.
 */
export const footagePassGlsl = /* glsl */ `
${hashGlsl}
${streetSceneGlsl}

uniform sampler2D uSource;
uniform vec2 uSourceSize;
uniform float uSourceReady;
uniform float uMode;
uniform float uPhase;
uniform float uReveal;
uniform vec3 uLine;
uniform float uGain;

const float TAU = 6.28318530718;

vec2 coverUv(vec2 uv, vec2 size) {
  float screenAspect = uResolution.x / uResolution.y;
  float textureAspect = size.x / max(size.y, 1.0);
  vec2 scale = screenAspect > textureAspect
    ? vec2(1.0, textureAspect / screenAspect)
    : vec2(screenAspect / textureAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

vec3 source(vec2 uv) {
  uv = clamp(uv, 0.0, 1.0);
  if (uSourceReady > 0.5) return texture2D(uSource, coverUv(uv, uSourceSize)).rgb;
  Camera cam = chaseCamera();
  vec3 rd = cameraRay(cam, uv);
  vec2 hit = sceneRaycast(cam.ro, rd, 160.0, 0.0);
  vec3 p = cam.ro + rd * hit.x;
  vec3 n = hit.y == ID_SKY ? -rd : sceneNormal(p, 0.0);
  return shadeCamera(rd, p, n, hit.x, hit.y);
}

float luma(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

vec3 ironbow(float x) {
  x = clamp(x, 0.0, 1.0);
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

vec3 jet(float x) {
  x = clamp(x, 0.0, 1.0);
  return clamp(vec3(1.5 - abs(4.0 * x - 3.0), 1.5 - abs(4.0 * x - 2.0), 1.5 - abs(4.0 * x - 1.0)), 0.0, 1.0);
}

// Flat class index from hue and lightness (a stand-in for a learned segmenter).
float classIndex(vec3 c) {
  float l = luma(c);
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float sat = mx - mn;
  if (sat < 0.12) return l < 0.25 ? 0.0 : l < 0.6 ? 1.0 : 2.0;
  float hue;
  if (mx == c.r) hue = mod((c.g - c.b) / sat, 6.0);
  else if (mx == c.g) hue = (c.b - c.r) / sat + 2.0;
  else hue = (c.r - c.g) / sat + 4.0;
  return 3.0 + floor(hue);
}

vec3 classColor(float k) {
  if (k < 0.5) return vec3(70.0, 70.0, 70.0) / 255.0;
  if (k < 1.5) return vec3(128.0, 64.0, 128.0) / 255.0;
  if (k < 2.5) return vec3(70.0, 130.0, 180.0) / 255.0;
  if (k < 3.5) return vec3(220.0, 20.0, 60.0) / 255.0;
  if (k < 4.5) return vec3(250.0, 170.0, 30.0) / 255.0;
  if (k < 5.5) return vec3(107.0, 142.0, 35.0) / 255.0;
  if (k < 6.5) return vec3(0.0, 160.0, 140.0) / 255.0;
  if (k < 7.5) return vec3(0.0, 0.0, 142.0) / 255.0;
  return vec3(244.0, 35.0, 232.0) / 255.0;
}

// Soft blobs that drift on closed paths, standing in for attention peaks.
float attentionField(vec2 uv) {
  float aspect = uResolution.x / uResolution.y;
  float s = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 center = vec2(0.2 + 0.15 * fi + 0.06 * sin(TAU * (uPhase + fi * 0.23)), 0.45 + 0.18 * sin(TAU * (uPhase * (fi < 2.0 ? 1.0 : 2.0) + fi * 0.37)));
    vec2 d = (uv - center) * vec2(aspect, 1.0);
    s += exp(-dot(d, d) / (0.012 + 0.01 * hash12(vec2(fi, 3.0))));
  }
  return s;
}

// One pass; edge terms come from derivatives taken by the caller.
vec3 applyPass(float mode, vec3 c, float edge, float gx, float gy, float k, float kEdge, vec2 uv) {
  float l = luma(c);
  if (mode < 0.5) return uLine * edge + c * 0.06;
  if (mode < 1.5) return ironbow(pow(l, 0.85) * 1.05);
  if (mode < 2.5) return mix(classColor(k), vec3(1.0), kEdge * 0.7);
  float heat = clamp(attentionField(uv) * 0.8 + edge * 0.25, 0.0, 1.0);
  return mix(vec3(l) * 0.7, jet(heat), 0.15 + 0.6 * smoothstep(0.05, 0.6, heat));
}

void main() {
  vec2 uv = vUv;
  float mode = uMode;
  float tileId = -1.0;
  vec2 tileUv = uv;

  if (mode > 3.5) {
    // 3x3 feature-map grid with thin gaps.
    vec2 g = uv * 3.0;
    vec2 cell = floor(g);
    tileUv = fract(g);
    tileId = cell.x + (2.0 - cell.y) * 3.0;
    uv = tileUv;
  }

  vec3 c = source(uv);
  float l = luma(c);
  float gx = dFdx(l) * uGain * 6.0;
  float gy = dFdy(l) * uGain * 6.0;
  float edge = clamp(length(vec2(gx, gy)) * 1.5, 0.0, 1.0);
  float k = classIndex(c);
  float kEdge = step(0.01, fwidth(k));

  vec3 col;
  if (tileId >= 0.0) {
    if (tileId < 0.5) col = c;
    else if (tileId < 1.5) col = vec3(l);
    else if (tileId < 2.5) col = uLine * edge;
    else if (tileId < 3.5) col = vec3(0.5 + gx * 0.8);
    else if (tileId < 4.5) col = vec3(0.5 + gy * 0.8);
    else if (tileId < 5.5) col = vec3(step(0.45, l));
    else if (tileId < 6.5) col = floor(c * 4.0) / 3.0;
    else if (tileId < 7.5) col = ironbow(l);
    else col = classColor(k);
    float gap = step(0.006, min(min(tileUv.x, 1.0 - tileUv.x), min(tileUv.y, 1.0 - tileUv.y)) * 0.333);
    col *= gap;
  } else {
    vec3 pass = applyPass(mode, c, edge, gx, gy, k, kEdge, uv);
    float split = 1.0;
    float hideSplit = 0.0;
    if (uReveal > 0.5) {
      split = smoothstep(0.0, 0.3, uPhase);
      hideSplit = smoothstep(0.7, 1.0, uPhase);
    }
    bool showPass = vUv.x < split && vUv.x >= hideSplit;
    col = showPass ? pass : c;
    if (uReveal > 0.5) {
      for (int i = 0; i < 2; i++) {
        float lineX = i == 0 ? split : hideSplit;
        float onScreen = step(0.001, lineX) * step(lineX, 0.999);
        float px = abs(vUv.x - lineX) * uResolution.x;
        col = mix(col, uLine, (1.0 - smoothstep(1.0, 2.5, px)) * onScreen);
        col += uLine * exp(-px * 0.06) * 0.3 * onScreen;
      }
    }
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;
