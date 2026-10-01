import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Grunge surfaces in 1080p pixel space (q). Every motion uses whole turns of
 * uPhase (roaming light, rust breathing, collage scraps sliding out and back)
 * so the loop is seamless. Note: avoid GLSL reserved words such as `patch`,
 * `sample`, `filter`; ANGLE fails silently on them.
 */
export const grungeSurfaceGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}

uniform float uStyle;

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec2 rot2(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
}

float roamLight(vec2 q, float t, float W) {
  vec2 lc = vec2(W * (0.5 + 0.32 * sin(t)), 540.0 + 220.0 * cos(t));
  vec2 d = q - lc;
  return 0.78 + 0.4 * exp(-dot(d, d) / (760.0 * 760.0));
}

// Masking tape strip: returns coverage, writes nothing else.
float tapeMask(vec2 q, vec2 c, vec2 halfSize, float angle, float salt) {
  vec2 lp = rot2(q - c, angle);
  float torn = (valueNoise3(vec3(lp.y / 6.0, salt, uSeed)) - 0.5) * 14.0;
  float d = max(abs(lp.x) - halfSize.x + torn, abs(lp.y) - halfSize.y);
  return 1.0 - smoothstep(-0.8, 0.8, d);
}

vec3 wall(vec2 q, float t, float W) {
  vec3 col = uColorA * (0.82 + 0.3 * fbm3(vec3(q / 180.0, uSeed), 5));
  // Pores and pits.
  float pore = step(hash13(vec3(floor(q / 5.0), uSeed)), 0.06);
  col *= 1.0 - 0.28 * pore;
  // Hairline cracks from ridged noise.
  float ridge = 1.0 - abs(2.0 * fbm3(vec3(q / 260.0, uSeed + 4.0), 4) - 1.0);
  col *= 1.0 - 0.3 * smoothstep(0.988, 0.997, ridge);
  // Spray patch with overspray speckle and drips.
  vec2 sc = vec2(W * (0.62 + 0.18 * hash13(vec3(1.0, uSeed, 2.0))), 430.0);
  vec2 sd = q - sc;
  float wob = 0.8 + 0.4 * valueNoise3(vec3(sd / 140.0, uSeed + 1.0));
  float mist = 1.0 - smoothstep(170.0, 360.0, length(sd) * wob);
  float speck = step(hash13(vec3(floor(q / 3.0), uSeed + 6.0)), mist * mist * 0.9);
  float core = 1.0 - smoothstep(120.0, 230.0, length(sd) * wob);
  float paint = max(core, speck * 0.85);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float dx = sc.x + (hash13(vec3(fi, uSeed, 7.0)) - 0.5) * 300.0;
    float len = 120.0 + 240.0 * hash13(vec3(fi, uSeed, 8.0));
    float w = 3.0 + 4.0 * hash13(vec3(fi, uSeed, 9.0)) * (1.0 - (q.y - sc.y) / (len + 200.0));
    float drip = (1.0 - smoothstep(w - 0.8, w + 0.8, abs(q.x - dx))) * step(sc.y + 100.0, q.y) * step(q.y, sc.y + 100.0 + len);
    paint = max(paint, drip);
  }
  col = mix(col, uColorB * (0.85 + 0.2 * fbm3(vec3(q / 60.0, uSeed + 3.0), 3)), clamp(paint, 0.0, 1.0));
  // Masking tape with a soft shadow.
  vec2 tc = vec2(W * 0.2, 250.0);
  float sh = tapeMask(q - vec2(4.0, 7.0), tc, vec2(240.0, 36.0), 0.16, 1.0);
  col *= 1.0 - 0.25 * sh;
  float tp = tapeMask(q, tc, vec2(240.0, 36.0), 0.16, 1.0);
  vec3 tapeCol = uColorC * (0.9 + 0.12 * valueNoise3(vec3(q.x / 3.0, q.y / 40.0, uSeed)));
  col = mix(col, tapeCol, tp * 0.9);
  return col * roamLight(q, t, W);
}

vec3 collage(vec2 q, float t, float W) {
  vec3 col = uColorA * (0.85 + 0.25 * fbm3(vec3(q / 120.0, uSeed), 4));
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    vec3 k = vec3(fi * 2.3, uSeed, 0.7);
    vec2 home = vec2((0.08 + 0.84 * hash13(k)) * W, (0.1 + 0.8 * hash13(k + 1.0)) * 1080.0);
    float off = hash13(k + 2.0);
    float u = fract(uPhase * 2.0 + off);
    // Scraps sit still most of the time, slide off and back with new content.
    float away = 1.0 - smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.88, 1.0, u));
    float side = hash13(k + 3.0) < 0.5 ? -1.0 : 1.0;
    vec2 c = home + vec2(side * away * 1500.0, 0.0);
    float idx = mod(floor(uPhase * 2.0 + off), 2.0);
    float ang = (hash13(k + 4.0 + idx) - 0.5) * 0.7;
    vec2 scrapHalf = vec2(140.0 + 160.0 * hash13(k + 5.0 + idx), 90.0 + 120.0 * hash13(k + 6.0 + idx));
    vec2 lp = rot2(q - c, ang);
    float torn = (valueNoise3(vec3(lp / 9.0, fi + uSeed)) - 0.5) * 18.0;
    float d = sdBox(lp, scrapHalf) + torn;
    // Drop shadow, paper, torn rim.
    float shadow = 1.0 - smoothstep(0.0, 22.0, sdBox(rot2(q - c - vec2(8.0, 12.0), ang), scrapHalf) + torn);
    col *= 1.0 - 0.35 * shadow;
    float kind = floor(hash13(k + 7.0 + idx) * 4.0);
    vec3 paper = kind < 0.5 ? uColorB : kind < 1.5 ? uColorC : kind < 2.5 ? vec3(0.94, 0.91, 0.85) : vec3(0.85, 0.83, 0.78);
    paper *= 0.9 + 0.12 * fbm3(vec3(lp / 40.0, fi), 3);
    // Halftone print on newsprint-like scraps.
    vec2 g = fract(rot2(lp, 0.785) / 8.0) - 0.5;
    float tone = 0.15 + 0.6 * smoothstep(-scrapHalf.y, scrapHalf.y, lp.y + lp.x * 0.3);
    float dotMask = 1.0 - smoothstep(sqrt(tone / 3.14159) - 0.06, sqrt(tone / 3.14159) + 0.06, length(g));
    paper = mix(paper, vec3(0.12), dotMask * step(1.5, kind) * 0.8);
    float inside = 1.0 - smoothstep(-0.8, 0.8, d);
    float rim = (1.0 - smoothstep(0.0, 5.0, -d)) * inside;
    col = mix(col, mix(paper, vec3(0.97, 0.95, 0.9), rim * 0.8), inside);
    // A strip of tape on one corner.
    float tp = tapeMask(lp, vec2(scrapHalf.x * 0.8, -scrapHalf.y), vec2(60.0, 18.0), 0.6, fi + 3.0);
    col = mix(col, uColorC * 0.95, tp * 0.75);
  }
  return col * roamLight(q, t, W);
}

vec3 rust(vec2 q, float t, float W) {
  vec3 paint = uColorA * (0.9 + 0.12 * fbm3(vec3(q / 200.0, uSeed), 3));
  float field = fbm3(vec3(q / 240.0, uSeed + 2.0), 5) + 0.35 * fbm3(vec3(q / 40.0, uSeed + 5.0), 3);
  float th = 0.86 - 0.05 * (0.5 + 0.5 * sin(t));
  float rustAmt = smoothstep(th - 0.02, th + 0.02, field);
  vec3 rustCol = mix(uColorB, uColorC, fbm3(vec3(q / 26.0, uSeed + 7.0), 4));
  rustCol *= 1.0 - 0.35 * step(hash13(vec3(floor(q / 4.0), uSeed)), 0.12);
  // Flaking paint rim around the rust.
  float rim = smoothstep(th - 0.06, th - 0.02, field) * (1.0 - rustAmt);
  vec3 col = mix(paint, paint * 1.3 + 0.05, rim * 0.6);
  col = mix(col, rustCol, rustAmt);
  // Long scratches.
  float scratch = 1.0 - smoothstep(0.0, 1.2, abs(fract((q.x * 0.94 + q.y * 0.34) / 170.0 + hash13(vec3(floor((q.x * 0.34 - q.y * 0.94) / 300.0), 1.0, uSeed))) - 0.5) * 170.0);
  col = mix(col, col * 1.35 + 0.04, scratch * 0.35 * (1.0 - rustAmt));
  return col * roamLight(q, t, W);
}

vec3 cardboard(vec2 q, float t, float W) {
  vec3 col = uColorA * (0.9 + 0.1 * fbm3(vec3(q / 150.0, uSeed), 4));
  col *= 0.97 + 0.03 * sin(q.x / 7.0);
  col *= 0.94 + 0.08 * valueNoise3(vec3(q.x / 2.0, q.y / 30.0, uSeed));
  // Torn-off top layer revealing the corrugation.
  vec2 tcen = vec2(W * 0.68, 620.0);
  vec2 td = (q - tcen) / vec2(330.0, 180.0);
  float edge = length(td) + (fbm3(vec3(q / 60.0, uSeed + 3.0), 4) - 0.5) * 0.6;
  float torn = 1.0 - smoothstep(0.98, 1.0, edge);
  vec3 flutes = mix(uColorB, uColorA, 0.5 + 0.5 * sin(q.x / 9.0));
  col = mix(col, flutes, torn);
  float rim = (1.0 - smoothstep(1.0, 1.06, edge)) * (1.0 - torn);
  col = mix(col, vec3(0.93, 0.88, 0.78), rim * 0.85);
  // Packing tape across the box.
  float band = 1.0 - smoothstep(-0.8, 0.8, abs(q.y - 300.0) - 70.0);
  vec3 tapeCol = uColorC * (0.95 + 0.25 * smoothstep(0.6, 1.0, valueNoise3(vec3(q / 90.0, uSeed + 8.0))));
  col = mix(col, tapeCol, band * 0.8);
  // Water stains.
  float stain = smoothstep(0.7, 0.76, fbm3(vec3(q / 220.0, uSeed + 9.0), 4));
  col *= 1.0 - 0.1 * stain;
  return col * roamLight(q, t, W);
}

void main() {
  float W = uResolution.x / uResolution.y * 1080.0;
  vec2 q = vUv * vec2(W, 1080.0);
  q.y = 1080.0 - q.y;
  float t = TAU * uPhase;
  vec3 col = uStyle < 0.5 ? wall(q, t, W)
    : uStyle < 1.5 ? collage(q, t, W)
    : uStyle < 2.5 ? rust(q, t, W)
    : cardboard(q, t, W);
  emit(clamp(col, 0.0, 1.0), 1.0);
}
`;
