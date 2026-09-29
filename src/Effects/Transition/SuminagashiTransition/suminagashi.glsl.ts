import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Suminagashi (Japanese ink marbling): concentric ink rings from dropped
 * points, twisted by a few vortices and a slow drift.
 */
const marblingGlsl = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform float uProgress;
uniform float uPeak;
uniform float uAnimTime;
uniform float uRingFrequency;
uniform float uSwirl;
uniform float uDropCount;
uniform float uSeed;

// Twist p around three vortices, then add a slow fBm drift.
vec2 marble(vec2 p, float swirl) {
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 c = (vec2(hash12(vec2(fi, uSeed)), hash12(vec2(uSeed, fi + 4.0))) - 0.5) * vec2(2.4, 1.4);
    vec2 v = p - c;
    float angle = swirl * exp(-dot(v, v) / 0.55) * (mod(fi, 2.0) < 1.0 ? 2.6 : -2.2);
    float cs = cos(angle);
    float sn = sin(angle);
    p = c + mat2(cs, -sn, sn, cs) * v;
  }
  vec2 drift = vec2(
    fbm3(vec3(p * 0.8, uAnimTime * 0.25 + uSeed), 4),
    fbm3(vec3(p * 0.8 + 7.1, uAnimTime * 0.25), 4)) - 0.5;
  return p + drift * (0.25 + swirl * 0.35);
}

// Distance from the nearest ink drop.
float dropDistance(vec2 q) {
  float d = 1e3;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    if (fi >= uDropCount) break;
    vec2 c = i == 0
      ? vec2(0.0)
      : (vec2(hash12(vec2(fi + 11.0, uSeed)), hash12(vec2(uSeed + 2.0, fi + 17.0))) - 0.5) * vec2(2.6, 1.5);
    d = min(d, length(q - c));
  }
  return d;
}
`;

/** Overlay: alternating ink rings spread, widen to seal the frame, then thin away. */
export const suminagashiOverlayGlsl = /* glsl */ `
${marblingGlsl}

uniform vec4 uBackground;
uniform vec3 uInkColor;
uniform vec3 uInk2Color;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  vec2 q = marble(p, uSwirl * smoothstep(0.0, 1.0, uProgress));
  float d = dropDistance(q);

  // Rings drift outward as more ink is dropped in the middle.
  float v = d * uRingFrequency - uProgress * 3.0;
  float f = fract(v);
  float width = mix(0.28, 1.06, smoothstep(0.45, 1.0, uPeak));
  float aa = fwidth(v) * 1.2;
  float band = 1.0 - smoothstep(width - aa, width + aa, f);

  float reach = 3.4 * smoothstep(0.0, 0.46, uProgress);
  float visible = smoothstep(reach, reach - 0.2, d);

  // Pigment gathers at the edges of each ring.
  float edge = exp(-min(f, max(width - f, 0.0)) / 0.06);
  float density = 0.82 + 0.3 * fbm3(vec3(q * 5.0, 3.0), 4);
  vec3 ink = mix(uInkColor, uInk2Color, mod(floor(v), 2.0));
  vec3 color = ink * density * (1.0 - 0.25 * edge * (1.0 - smoothstep(0.9, 1.0, width)));

  float alpha = band * visible;
  alpha = mix(alpha, 1.0, smoothstep(0.93, 1.0, uPeak));
  // The remaining thin rings wash out so the last frame is clear.
  alpha *= uProgress < 0.5 ? 1.0 : smoothstep(0.0, 0.35, uPeak);

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(color * alpha, alpha) + bg * (1.0 - alpha);
}
`;
