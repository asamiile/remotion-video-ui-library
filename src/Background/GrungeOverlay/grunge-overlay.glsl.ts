import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Transparent grunge marks, measured in 1080p pixels so the texture keeps
 * its size at any render scale. Random marks re-roll on uJitter (a step
 * counter that wraps with the composition), which gives a film-like jitter
 * and keeps the loop seamless.
 */
export const grungeOverlayGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}

uniform float uStyle;
uniform float uDensity;
uniform float uSize;
uniform float uJitter;

// Soft disc / line coverage with ~1px antialiasing.
float cover(float d, float r) {
  return 1.0 - smoothstep(r - 0.75, r + 0.75, d);
}

float dust(vec2 q, float j) {
  float m = 0.0;
  // Specks: at most one irregular speck per 70px cell.
  float cellSize = 70.0 * uSize;
  vec2 cell = floor(q / cellSize);
  float h = hash13(vec3(cell, j + uSeed * 7.0));
  if (h < uDensity * 0.35) {
    vec2 c = (cell + 0.15 + 0.7 * vec2(hash13(vec3(cell, j + 1.3)), hash13(vec3(cell, j + 2.7)))) * cellSize;
    vec2 d = q - c;
    float big = step(0.9, hash13(vec3(cell, j + 4.1)));
    float r = (1.2 + 3.0 * hash13(vec3(cell, j + 3.9)) + big * 7.0) * uSize;
    float rough = 0.7 + 0.6 * valueNoise3(vec3(normalize(d + 1e-4) * 2.0, h * 40.0));
    m = max(m, cover(length(d) / rough, r));
  }
  // Hairs: a few thin wavy curves per step.
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    if (fi >= floor(uDensity * 4.0 + 0.5)) break;
    vec3 k = vec3(fi * 3.1, j, uSeed);
    vec2 c = vec2(hash13(k + 0.1) * uResolution.x / uResolution.y * 1080.0, hash13(k + 0.2) * 1080.0);
    float a = hash13(k + 0.3) * 6.2832;
    vec2 d = q - c;
    vec2 l = vec2(cos(a) * d.x + sin(a) * d.y, -sin(a) * d.x + cos(a) * d.y);
    float len = (60.0 + 120.0 * hash13(k + 0.4)) * uSize;
    float bend = (6.0 + 14.0 * hash13(k + 0.5)) * uSize * sin(l.x / len * 3.1 + hash13(k + 0.6) * 6.0);
    float along = step(abs(l.x), len * 0.5);
    m = max(m, cover(abs(l.y - bend), 0.9) * along);
  }
  // Scratches: vertical lines that persist over a few steps and wobble.
  float sj = floor(j / 3.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    if (hash13(vec3(fi, sj, uSeed + 9.0)) > uDensity * 0.9) continue;
    float x = hash13(vec3(fi, sj, uSeed + 5.0)) * uResolution.x / uResolution.y * 1080.0;
    x += sin(q.y * 0.013 + fi) * 3.0 + (hash13(vec3(fi, j, 1.0)) - 0.5) * 6.0;
    float y0 = hash13(vec3(fi, sj, 2.0)) * 700.0 - 200.0;
    float y1 = y0 + 300.0 + hash13(vec3(fi, sj, 3.0)) * 900.0;
    float inY = step(y0, q.y) * step(q.y, y1);
    float w = 0.6 + hash13(vec3(fi, sj, 4.0)) * 1.2;
    m = max(m, cover(abs(q.x - x), w) * inY * (0.55 + 0.45 * hash13(vec3(fi, j, 6.0))));
  }
  return m;
}

float frameGrime(vec2 q, float j) {
  float frameW = uResolution.x / uResolution.y * 1080.0;
  float edgeDist = min(min(q.x, frameW - q.x), min(q.y, 1080.0 - q.y));
  float grimeDepth = (30.0 + 170.0 * uDensity) * uSize;
  // Slight boil: the noise shifts a few pixels per step.
  vec2 boilShift = vec2(hash13(vec3(j, 1.0, uSeed)), hash13(vec3(j, 2.0, uSeed))) * 4.0;
  float n = fbm3(vec3((q + boilShift) / (110.0 * uSize), uSeed), 5);
  float fineNoise = valueNoise3(vec3((q + boilShift) / (9.0 * uSize), uSeed + 3.0));
  float grimeValue = (1.0 - edgeDist / grimeDepth) + (n - 0.5) * 1.1 + (fineNoise - 0.5) * 0.5;
  float m = smoothstep(0.42, 0.5, grimeValue);
  // Spatter: dots that thin out toward the center.
  vec2 spatCell = floor(q / (14.0 * uSize));
  vec2 spatCenter = (spatCell + 0.5) * 14.0 * uSize;
  float spatNear = clamp(1.0 - edgeDist / (grimeDepth * 2.4), 0.0, 1.0);
  float spatOn = step(hash13(vec3(spatCell, uSeed + 0.5)), spatNear * spatNear * 0.35 * uDensity);
  float spatR = (1.0 + 3.0 * hash13(vec3(spatCell, uSeed + 5.0))) * uSize;
  m = max(m, spatOn * cover(length(q - spatCenter), spatR));
  return m;
}

float toner(vec2 q, float j) {
  // Clusters of 2-3px toner grains, denser where low-frequency noise is high.
  float cluster = smoothstep(0.35, 0.75, fbm3(vec3(q / (160.0 * uSize), uSeed + j * 0.05), 3));
  vec2 g = floor(q / (2.5 * uSize));
  float grain = step(hash13(vec3(g, j + uSeed)), uDensity * 0.14 * cluster);
  // Horizontal roller streaks.
  float streak = fbm3(vec3(q.x / (420.0 * uSize), q.y / (5.0 * uSize), uSeed + 11.0 + floor(j / 4.0) * 0.37), 3);
  float streaks = smoothstep(0.76 - uDensity * 0.06, 0.8 - uDensity * 0.06, streak)
    * step(hash13(vec3(g, j + 3.0)), 0.35);
  // Occasional blots.
  vec2 cell = floor(q / (120.0 * uSize));
  float blot = 0.0;
  if (hash13(vec3(cell, j + 7.0)) < uDensity * 0.08) {
    vec2 c = (cell + 0.5) * 120.0 * uSize;
    vec2 d = q - c;
    float rough = 0.6 + 0.8 * valueNoise3(vec3(d / (6.0 * uSize), j));
    blot = cover(length(d) / rough, 6.0 * uSize);
  }
  return max(max(grain, streaks), blot);
}

// Ink / coffee stains that spread, darken at the rim, then fade out.
vec4 stains(vec2 q) {
  vec4 acc = vec4(0.0);
  float W = uResolution.x / uResolution.y * 1080.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    if (fi >= 3.0 + uDensity * 5.0) break;
    vec3 k = vec3(fi * 1.7, uSeed, 3.3);
    vec2 sc = vec2(hash13(k) * W, hash13(k + 1.1) * 1080.0);
    float rMax = (70.0 + 170.0 * hash13(k + 2.2)) * uSize;
    float age = fract(uPhase + hash13(k + 3.3));
    float grow = 1.0 - pow(1.0 - age, 3.0);
    float life = smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.82, 1.0, age));
    float r = rMax * (0.35 + 0.65 * grow);
    vec2 d = q - sc;
    float dn = length(d) * (0.82 + 0.36 * valueNoise3(vec3(d / (rMax * 0.45), fi + uSeed)));
    float inner = (1.0 - smoothstep(r * 0.92, r, dn)) * (0.08 + 0.16 * smoothstep(0.3, 1.0, dn / r));
    float rw = 3.0 * uSize + r * 0.025;
    float ring = exp(-pow((dn - r * 0.96) / rw, 2.0)) * 0.65;
    float a = max(inner, ring) * life;
    vec3 col = mix(uColorA, uColorB, ring / (inner + ring + 1e-4));
    acc += vec4(col * a, a) * (1.0 - acc.a);
  }
  return acc;
}

// Warm light leaks breathing in from the edges, flickering per step.
vec4 lightLeak(vec2 q, float j) {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = q / 1080.0;
  float t = TAU * uPhase;
  vec2 c1 = vec2(-0.08, 0.5 + 0.3 * sin(t));
  vec2 c2 = vec2(aspect + 0.08, 0.5 + 0.35 * cos(t + 1.3));
  float r1 = (0.42 + 0.1 * sin(2.0 * t)) * uSize;
  float r2 = (0.36 + 0.08 * cos(2.0 * t + 0.7)) * uSize;
  float g1 = exp(-dot(p - c1, p - c1) / (r1 * r1));
  float g2 = exp(-dot(p - c2, p - c2) / (r2 * r2)) * 0.8;
  float flicker = 0.78 + 0.22 * valueNoise3(vec3(j * 0.35, 1.0, uSeed));
  float g = clamp(g1 + g2, 0.0, 1.0);
  float a = clamp(g * flicker * (0.4 + uDensity), 0.0, 1.0);
  vec3 col = mix(uColorB, uColorA, smoothstep(0.2, 0.9, g));
  return vec4(col * a, a);
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

// Film strip edges: sprocket holes scrolling past, edge codes, rounded gate corners.
vec4 filmEdge(vec2 q, float j) {
  float W = uResolution.x / uResolution.y * 1080.0;
  float sw = 95.0 * uSize;
  float pitch = 72.0 * uSize;
  float weave = (hash13(vec3(j, 4.0, uSeed)) - 0.5) * 2.0;
  float y = q.y + uPhase * pitch * 8.0 + weave;
  float row = floor(y / pitch);
  vec2 hp = vec2(0.0, mod(y, pitch) - pitch * 0.5);
  float xl = q.x - sw * 0.45 - weave;
  float xr = q.x - (W - sw * 0.45) - weave;
  float holeL = step(sdRoundBox(vec2(xl, hp.y), vec2(14.0, 20.0) * uSize, 5.0 * uSize), 0.0);
  float holeR = step(sdRoundBox(vec2(xr, hp.y), vec2(14.0, 20.0) * uSize, 5.0 * uSize), 0.0);
  float strip = step(q.x, sw + weave) + step(W - sw + weave, q.x);
  float base = clamp(strip, 0.0, 1.0) * (1.0 - holeL) * (1.0 - holeR);
  // Gate: rounded corners of the picture area.
  vec2 gc = vec2(W * 0.5, 540.0);
  float gate = step(0.0, sdRoundBox(q - gc, vec2(W * 0.5 - sw, 540.0), 48.0 * uSize));
  float inStrip = clamp(strip, 0.0, 1.0);
  float black = clamp(base + gate * (1.0 - inStrip), 0.0, 1.0);
  // Edge code dashes in the right strip.
  float codeX = step(abs(q.x - (W - sw * 0.85) - weave), 4.0 * uSize);
  float code = codeX * step(0.55, hash13(vec3(floor(y / (pitch * 0.25)), 9.0, uSeed))) * strip;
  vec3 col = mix(uColorA, uColorB, code);
  return vec4(col * black, black);
}

// VHS: scanlines, bottom tracking noise, dropouts, chroma streaks, rolling band.
vec4 vhs(vec2 q, float j) {
  vec4 acc = vec4(0.0);
  float W = uResolution.x / uResolution.y * 1080.0;
  // Tracking noise along the bottom edge.
  float bandTop = 1080.0 - (40.0 + 40.0 * uDensity) * uSize;
  float inBand = step(bandTop + (hash13(vec3(floor(q.x / 40.0), j, 2.0)) - 0.5) * 16.0, q.y);
  float bandNoise = step(0.45, hash13(vec3(floor(q.x / 3.0), floor(q.y / 2.0), j)));
  float tr = inBand * bandNoise * 0.8;
  acc += vec4(vec3(1.0) * tr, tr) * (1.0 - acc.a);
  // White dropouts.
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec3 k = vec3(fi, j, uSeed);
    float on = step(hash13(k + 0.7), uDensity * 0.6);
    float dy = abs(q.y - hash13(k) * 1080.0);
    float x0 = hash13(k + 1.0) * W;
    float seg = step(x0, q.x) * step(q.x, x0 + (80.0 + 400.0 * hash13(k + 2.0)) * uSize);
    float dl = on * seg * (1.0 - smoothstep(0.5, 1.5, dy)) * 0.85;
    acc += vec4(vec3(1.0) * dl, dl) * (1.0 - acc.a);
  }
  // Chroma streak rows (cyan / magenta).
  float rowId = floor(q.y / 2.0);
  float hasStreak = step(hash13(vec3(rowId, j, 5.0)), uDensity * 0.025);
  vec3 chroma = mix(vec3(0.0, 0.85, 0.95), vec3(0.95, 0.1, 0.75), step(0.5, hash13(vec3(rowId, j, 6.0))));
  float cs = hasStreak * 0.35 * valueNoise3(vec3(q.x / 60.0, rowId, j));
  acc += vec4(chroma * cs, cs) * (1.0 - acc.a);
  // Rolling soft band.
  float by = fract(uPhase * 2.0) * 1400.0 - 160.0;
  float roll = exp(-pow((q.y - by) / 70.0, 2.0)) * 0.08;
  acc += vec4(vec3(1.0) * roll, roll) * (1.0 - acc.a);
  // Scanlines.
  float scan = step(2.0, mod(q.y, 3.0)) * 0.12 * (0.5 + uDensity);
  acc += vec4(vec3(0.0), scan) * (1.0 - acc.a);
  return acc;
}

// One rotated dot screen: coverage (0-1) of the cell.
float screenDots(vec2 q, float pitch, float angle, float coverage) {
  float a = radians(angle);
  vec2 r = vec2(cos(a) * q.x - sin(a) * q.y, sin(a) * q.x + cos(a) * q.y);
  vec2 local = fract(r / pitch) - 0.5;
  float rad = sqrt(coverage / 3.14159265);
  float d = length(local);
  return 1.0 - smoothstep(rad - 0.06, rad + 0.06, d);
}

// Misregistered CMY halftone: three screens at print angles, slightly off.
vec4 misregister(vec2 q, float j) {
  float pitch = 9.0 * uSize;
  float patchiness = smoothstep(0.38, 0.72, fbm3(vec3(q / (320.0 * uSize), uSeed), 4));
  float cov = clamp(0.6 * uDensity * patchiness, 0.0, 0.9);
  vec2 jit = (vec2(hash13(vec3(j, 1.0, uSeed)), hash13(vec3(j, 2.0, uSeed))) - 0.5) * 2.0;
  float c = screenDots(q + vec2(4.0, 1.0) * uSize + jit, pitch, 15.0, cov);
  float m = screenDots(q + vec2(-3.0, 3.0) * uSize - jit, pitch, 75.0, cov);
  float y = screenDots(q + vec2(1.0, -4.0) * uSize, pitch, 0.0, cov * 0.9);
  vec3 col = (1.0 - c * vec3(1.0, 0.32, 0.06)) * (1.0 - m * vec3(0.07, 1.0, 0.45)) * (1.0 - y * vec3(0.0, 0.05, 1.0));
  float a = max(max(c, m), y);
  return vec4(col * a, a);
}

void main() {
  vec2 q = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 1080.0;
  q.y = 1080.0 - q.y;
  float j = uJitter;
  float m = uStyle < 0.5 ? dust(q, j)
    : uStyle < 1.5 ? frameGrime(q, j)
    : uStyle < 2.5 ? toner(q, j)
    : 0.0;
  vec4 res = vec4(uColorA * m, m);
  res = uStyle > 2.5 && uStyle < 3.5 ? stains(q) : res;
  res = uStyle > 3.5 && uStyle < 4.5 ? lightLeak(q, j) : res;
  res = uStyle > 4.5 && uStyle < 5.5 ? filmEdge(q, j) : res;
  res = uStyle > 5.5 && uStyle < 6.5 ? vhs(q, j) : res;
  res = uStyle > 6.5 ? misregister(q, j) : res;
  res = clamp(res, 0.0, 1.0);
  emit(res.rgb, res.a);
}
`;
