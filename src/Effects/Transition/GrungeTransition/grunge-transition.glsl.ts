import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Grunge overlay transitions driven by uProgress (0 → 1, cut at 0.5).
 * Every mode fully covers the frame between 0.45 and 0.55 and is fully
 * transparent at 0 and 1. Avoid GLSL reserved words (`patch`, `sample`...);
 * ANGLE fails silently on them.
 */
export const grungeTransitionGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec4 uBackground;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uMode;
uniform float uProgress;
uniform float uSeed;

vec2 rot2(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
}

float ease(float x) {
  float t = clamp(x, 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

// Strips of tape laid left → right, then peeled away in reverse order.
vec4 tapeStrips(vec2 p, float aspect) {
  vec4 acc = vec4(0.0);
  float reach = aspect + 0.5;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float yc = -1.0 + (fi + 0.5) * 0.25;
    float ang = (hash12(vec2(fi, uSeed)) - 0.5) * 0.1;
    float hh = 0.24;
    vec2 lp = rot2(p - vec2(0.0, yc), ang);
    float lay = ease((uProgress - fi * 0.04) / 0.13);
    float peel = ease((uProgress - 0.55 - (7.0 - fi) * 0.04) / 0.13);
    float jag = (valueNoise3(vec3(lp.y * 40.0, fi, uSeed)) - 0.5) * 0.05;
    float front = mix(-reach, reach, lay) + jag;
    float back = mix(-reach, reach, peel) + jag;
    float body = step(abs(lp.y), hh) * step(lp.x, front) * step(back, lp.x);
    float fiber = valueNoise3(vec3(lp.x * 3.0, lp.y * 70.0, fi + uSeed));
    float sheen = smoothstep(0.55, 0.9, valueNoise3(vec3(lp.x * 1.4, lp.y * 3.0, fi + 9.0)));
    float edge = smoothstep(hh - 0.02, hh, abs(lp.y));
    vec3 col = uColorA * (0.88 + 0.12 * fiber);
    col = mix(col, uColorB, sheen * 0.35);
    col = mix(col, uColorC, edge * 0.6);
    acc = vec4(col * body, body) + acc * (1.0 - body);
  }
  return acc;
}

// Burn field: noise plus distance from a seeded ignition point.
float burnField(vec2 p, float salt) {
  vec2 c = vec2(hash12(vec2(salt, uSeed)) - 0.5, hash12(vec2(uSeed, salt)) - 0.5) * 1.2;
  return fbm3(vec3(p * 1.6, salt + uSeed), 5) * 0.6 + length(p - c) * 0.32;
}

vec4 filmBurn(vec2 p) {
  float flicker = 0.9 + 0.1 * hash12(vec2(floor(uProgress * 60.0), uSeed));
  vec3 hot = uColorB * flicker;
  // Phase 1: holes burn open to white-hot light until the whole frame glows.
  float lv = mix(-0.05, 1.25, ease(uProgress / 0.45));
  float e = lv - burnField(p, 1.0);
  float inside = step(0.0, e);
  float glow = exp(-e * e / 0.0012);
  float charRing = smoothstep(-0.07, -0.01, e) * (1.0 - inside);
  vec3 col1 = mix(mix(uColorC, uColorA, glow), hot, inside);
  float a1 = max(inside, max(charRing * 0.9, glow));
  // Phase 2: the white frame burns away to reveal the next shot.
  float lv2 = mix(-0.05, 1.25, ease((uProgress - 0.55) / 0.45));
  float e2 = lv2 - burnField(p, 5.0);
  float hole = step(0.0, e2);
  float glow2 = exp(-e2 * e2 / 0.0012);
  float charRing2 = smoothstep(-0.06, -0.005, e2) * (1.0 - hole);
  vec3 col2 = mix(mix(hot, uColorC, charRing2), uColorA, glow2);
  float a2 = clamp((1.0 - hole) + glow2 * hole, 0.0, 1.0);
  float second = step(0.5, uProgress);
  vec3 col = mix(col1, col2, second);
  float a = mix(a1, a2, second);
  return vec4(col * a, a);
}

vec4 photocopy(vec2 p) {
  // Two scan passes: the first leaves a toner copy, the second lifts it.
  float pass1 = ease(uProgress / 0.45);
  float pass2 = ease((uProgress - 0.55) / 0.45);
  float y1 = mix(-1.25, 1.25, pass1);
  float y2 = mix(-1.25, 1.25, pass2);
  float py = -p.y;
  float copied = step(py, y1) * (1.0 - step(py, y2));
  vec2 g = floor(p * 420.0);
  float toner = step(hash12(g + uSeed), 0.07);
  float streak = smoothstep(0.72, 0.8, valueNoise3(vec3(p.x * 1.5, p.y * 90.0, uSeed)));
  float grey = fbm3(vec3(p * 2.0, uSeed + 3.0), 4);
  vec3 paper = uColorA * (0.86 + 0.14 * grey);
  paper = mix(paper, uColorC, max(toner, streak * 0.5));
  // Bright scan bars ride ahead of each pass.
  float bar = exp(-pow((py - y1) / 0.05, 2.0)) * step(uProgress, 0.5)
    + exp(-pow((py - y2) / 0.05, 2.0)) * step(0.5, uProgress);
  bar = clamp(bar, 0.0, 1.0);
  vec3 col = mix(paper, uColorB, bar);
  float a = max(copied, bar);
  return vec4(col * a, a);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  vec4 fx = uMode < 0.5 ? tapeStrips(p, aspect)
    : uMode < 1.5 ? filmBurn(p)
    : photocopy(p);
  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = fx + bg * (1.0 - fx.a);
}
`;
