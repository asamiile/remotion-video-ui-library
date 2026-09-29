import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Ink bleeding into paper. Drops spread as a warped, smooth-unioned distance
 * field with fibrous edges, a darker drying rim and a faint wet halo; the
 * reveal phase bleeds holes open from a second seed set. Output is
 * premultiplied RGBA.
 */
export const inkBleedFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec4 uBackground;
uniform vec3 uInkColor;
uniform vec3 uRimColor;
uniform float uGrow;
uniform float uReveal;
uniform float uFill;
uniform float uSeedCount;
uniform float uSpread;
uniform float uStagger;
uniform float uSeed;
uniform float uWarp;
uniform float uFringe;
uniform float uGranulation;
uniform float uRimStrength;

const int MAX_SEEDS = 8;
const float MAX_RADIUS = 3.0;
const float EDGE = 0.012;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec2 seedPosition(float i, float salt, float aspect) {
  if (i == 0.0 && salt == 0.0) return vec2(0.0);
  vec2 h = vec2(
    hash12(vec2(i * 7.13 + salt, uSeed)),
    hash12(vec2(uSeed + 3.7, i * 3.71 + salt)));
  return (h * 2.0 - 1.0) * vec2(aspect, 1.0) * 0.85 * uSpread;
}

// Signed distance to the ink boundary: < 0 inside the stain.
float bleedField(vec2 p, float progress, float salt, float aspect) {
  float d = 1e3;
  for (int i = 0; i < MAX_SEEDS; i++) {
    float fi = float(i);
    if (fi >= uSeedCount) break;
    float delay = fi == 0.0 ? 0.0 : hash12(vec2(fi + salt, uSeed + 9.1)) * uStagger;
    float local = clamp((progress - delay) / max(1.0 - delay, 1e-3), 0.0, 1.0);
    if (local <= 0.0) continue;
    // Starts as a small drop, soaks outward, then settles.
    float size = 0.75 + 0.5 * hash12(vec2(fi + salt, uSeed + 1.3));
    float eased = local * local * (3.0 - 2.0 * local);
    float radius = (0.04 + eased) * MAX_RADIUS * size;
    d = smin(d, length(p - seedPosition(fi, salt, aspect)) - radius, 0.3);
  }
  return d;
}

// Paper-fiber irregularity along the edge.
float fringe(vec2 p, float salt) {
  float fibers = fbm3(vec3(p * vec2(26.0, 9.0), salt + 3.0), 4) - 0.5;
  float grain = fbm3(vec3(p * 60.0, salt + 7.0), 3) - 0.5;
  return (fibers * 0.09 + grain * 0.035) * uFringe;
}

vec2 warp(vec2 p, float salt) {
  vec2 w = vec2(
    fbm3(vec3(p * 1.4, salt), 4),
    fbm3(vec3(p * 1.4 + 5.2, salt + 1.0), 4)) - 0.5;
  return p + w * uWarp;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  float f = bleedField(warp(p, 0.0), uGrow, 0.0, aspect) + fringe(p, 0.0);
  float ink = smoothstep(EDGE, -EDGE, f);
  float rimWidth = 0.02 + 0.05 * uRimStrength;
  float rim = exp(-max(-f, 0.0) / rimWidth) * ink * uRimStrength;

  // Capillary tendrils wicking out along the paper fibers, plus a wet halo.
  float fibers = fbm3(vec3(p * 34.0, 5.0), 4);
  float feather = smoothstep(0.12, 0.0, f - (fibers - 0.5) * 0.18 * uFringe)
    * smoothstep(0.45, 0.7, fibers) * 0.45 * step(0.0, f);
  float halo = smoothstep(0.14, 0.0, f) * (1.0 - ink) * 0.14;

  // Wet-in-wet unevenness: lighter pools that drift while the ink is wet.
  float wash = fbm3(vec3(p * 1.1, uGrow * 0.8 + 2.0), 4);
  float body = ink * mix(0.84, 1.0, smoothstep(0.3, 0.7, wash));
  body = max(body, rim * ink);

  float hole = 0.0;
  if (uReveal > 0.0) {
    float h = bleedField(warp(p, 17.0), uReveal, 17.0, aspect) + fringe(p, 17.0);
    // Soft, fiber-broken hole edge so the opening bleeds rather than cuts.
    hole = smoothstep(0.05, -0.03, h + (fibers - 0.5) * 0.08 * uFringe);
    // Pigment pushed outward by the opening hole collects in a dark ring.
    rim = max(rim, exp(-max(h, 0.0) / rimWidth) * (1.0 - hole) * uRimStrength);
  }

  float granulation = mix(1.0, 0.8 + 0.4 * fbm3(vec3(p * 9.0, 31.0), 4), uGranulation);
  vec3 color = mix(uInkColor * granulation, uRimColor, clamp(rim, 0.0, 1.0));

  float alpha = max(body, max(feather, halo));
  alpha = mix(alpha, 1.0, uFill);
  alpha *= 1.0 - hole;
  alpha *= 1.0 - smoothstep(0.92, 1.0, uReveal);

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(color * alpha, alpha) + bg * (1.0 - alpha);
}
`;
