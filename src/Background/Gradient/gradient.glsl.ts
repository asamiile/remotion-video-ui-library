import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: mix + sin.
 * - waves: two slow sine waves bend a three-color gradient.
 * - mesh: four soft Gaussian blobs orbit on looping paths and are blended
 *   as a weighted average over colorA, like a mesh-gradient wallpaper.
 * - linear: a linear color ramp broken up by noise stretched along a gently
 *   bending diagonal, so it reads as soft, motion-blurred light streaks
 *   with an accent band and pale sheen.
 * - marble: fbm domain warping folds a colorA-to-colorB ramp into marbled
 *   swirls with soft colorC bands; no veins or drawn lines.
 * - scoop: ice-cream look; a colorA base with soft two-tone areas of colorC,
 *   colorB sauce ribbons, specks of speckColor and a fine frozen texture.
 * Contrast sharpens the mesh blobs and applies an S-curve to the result.
 * All motion uses whole turns of uPhase, so every style loops seamlessly.
 */
export const gradientFlowGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform float uStyle;
uniform float uGrain;
uniform float uVignette;
uniform float uContrast;
uniform float uRibbon;
uniform float uSpecks;
uniform vec3 uSpeckColor;

vec3 waves(vec2 p, float t) {
  // Waves whose phase advances by whole turns over the loop.
  float w1 = sin(p.x * 1.3 * uScale + t + sin(p.y * 2.0 + t) * 0.8);
  float w2 = sin(p.y * 1.7 * uScale - t * 2.0 + p.x * 0.6);
  float v = 0.5 + 0.25 * w1 + 0.25 * w2; // 0-1

  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.6, v));
  return mix(color, uColorC, smoothstep(0.55, 1.0, v) * uIntensity);
}

vec3 mesh(vec2 p, float t) {
  // A gentle warp keeps the blob edges organic rather than perfectly round.
  p += 0.12 * vec2(sin(p.y * 2.1 + t), sin(p.x * 1.7 - t));
  // Contrast lets more of colorA through and gives the blobs crisper edges.
  float baseWeight = mix(0.35, 0.06, uContrast);
  float falloff = 1.0 + 1.5 * uContrast;
  vec3 sum = uColorA * baseWeight;
  float weight = baseWeight;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float salt = hash12(vec2(fi * 3.7, uSeed)) * TAU;
    // Lissajous orbits with integer frequencies loop exactly once per cycle.
    vec2 c = vec2(
      0.9 * sin(t * (1.0 + mod(fi, 2.0)) + salt),
      0.55 * cos(t + salt * 1.3 + fi));
    c += vec2(fi - 1.5, mod(fi, 2.0) - 0.5) * vec2(0.55, 0.5);
    float radius = (0.75 + 0.2 * sin(t + fi * 1.9)) / uScale;
    vec2 d = p - c;
    float w = pow(exp(-dot(d, d) / (radius * radius)), falloff);
    vec3 col = fi < 0.5 ? uColorB
      : fi < 1.5 ? uColorC
      : fi < 2.5 ? mix(uColorB, uColorC, 0.5)
      : mix(uColorA, uColorC, 0.35);
    sum += col * w * uIntensity;
    weight += w * uIntensity;
  }
  return sum / weight;
}

vec3 linear(vec2 p, float t) {
  vec3 lo = loopOffset(uPhase, 0.5, uSeed);
  // Streaks run along a shallow diagonal that bends gently across the frame.
  float ang = 0.35 + 0.6 * hash12(vec2(uSeed, 2.0)) + 0.1 * p.x + 0.06 * sin(t + p.y * 1.3);
  vec2 along = vec2(cos(ang), sin(ang));
  vec2 across = vec2(-along.y, along.x);
  float a = dot(p, along) * uScale;
  float c = dot(p, across) * uScale;

  // Noise stretched ~10x along the streak reads as a motion-blurred light.
  float broad = fbm3(vec3(c * 1.3, a * 0.12, 0.0) + lo, 4);
  float fine = fbm3(vec3(c * 2.4, a * 0.18, 3.0) + lo * 1.4, 3);

  // Linear ramp across the streaks, pushed around by the broad streaks.
  float g = clamp(0.5 + c * 0.3 + (broad - 0.5) * 1.6, 0.0, 1.0);
  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 1.0, g));

  // A soft band of the accent color, then pale sheen streaks on top.
  float accent = smoothstep(0.5, 0.78, broad + (fine - 0.5) * 0.35);
  color = mix(color, uColorC, accent * 0.8 * uIntensity);
  float sheen = smoothstep(0.52, 0.85, fine) * smoothstep(0.4, 0.65, broad);
  color = mix(color, vec3(1.0), sheen * 0.32 * uIntensity);
  return color;
}

vec3 marble(vec2 p, float t) {
  vec3 lo = loopOffset(uPhase, 0.45, uSeed);
  vec2 m = p * 0.7 * uScale;
  // Two levels of domain warping fold the field into marbled swirls.
  vec2 q = vec2(
    fbm3(vec3(m, 0.0) + lo, 4),
    fbm3(vec3(m + vec2(5.2, 1.3), 1.0) + lo, 4));
  float f = fbm3(vec3(m + 4.0 * q, 2.0) + lo * 0.7, 5);

  // Soft color bands follow the warped contours, like paint combed on water.
  float s = f * 3.5 + q.x * 1.5;
  float w1 = 0.5 + 0.5 * cos(TAU * s);
  float w2 = 0.5 + 0.5 * cos(TAU * (s + 0.33));
  vec3 color = mix(uColorA, uColorB, smoothstep(0.15, 0.85, w1));
  color = mix(color, uColorC, smoothstep(0.55, 0.95, w2) * 0.7 * uIntensity);
  // Pale sheen on the lightest bands; wide falloff so it never reads as a vein.
  return mix(color, vec3(1.0), smoothstep(0.8, 1.0, w1) * 0.18 * uIntensity);
}

vec3 scoop(vec2 p, float t) {
  vec3 lo = loopOffset(uPhase, 0.35, uSeed);
  vec2 m = p * 0.6 * uScale;
  // Everything is drawn in warped space, so ribbons and chips fold together.
  vec2 q = vec2(
    fbm3(vec3(m, 0.0) + lo, 4),
    fbm3(vec3(m + vec2(5.2, 1.3), 1.0) + lo, 4));
  vec2 w = m + 3.0 * q;

  // Two-tone: large soft-edged areas of the second flavor (colorC).
  float region = fbm3(vec3(w * 0.6, 4.0) + lo * 0.5, 2);
  vec3 color = mix(uColorA, uColorC, smoothstep(0.47, 0.53, region));

  // Sauce ribbons (colorB): one broad band along a smooth warped contour.
  vec3 cp = vec3(w * 0.8, 6.0) + lo * 0.6;
  float contour = fbm3(cp, 3);
  // Divide by the slope so ribbons keep a steady on-screen width.
  float e = 0.01;
  vec2 grad = vec2(fbm3(cp + vec3(e, 0.0, 0.0), 3), fbm3(cp + vec3(0.0, e, 0.0), 3)) - contour;
  float slope = max(length(grad) / e, 1e-3);
  float dist = abs(contour - 0.5) / slope;
  float width = uRibbon * (0.03 + 0.035 * fbm3(vec3(w * 1.5, 9.0), 2));
  float ribbon = 1.0 - smoothstep(width * 0.6, width, dist);
  color = mix(color, uColorB, ribbon * step(0.001, uRibbon));

  // Chips / sprinkles: one irregular speck in some cells of the warped grid.
  // Chips follow the flow only loosely so they stay chunky, not stretched.
  vec2 g = (m + 0.8 * q) * 9.0;
  vec2 cell = floor(g);
  float h = hash12(cell + uSeed);
  vec2 center = cell + 0.25 + 0.5 * vec2(h, hash12(cell + 7.1));
  vec2 d = g - center;
  float jag = 0.75 + 0.5 * valueNoise3(vec3(normalize(d + 1e-4) * 2.0, h * 9.0));
  float r = length(d * vec2(1.0, 0.8 + 0.4 * h)) / jag;
  float size = 0.14 + 0.14 * hash12(cell + 3.3);
  float speck = (1.0 - smoothstep(size * 0.7, size, r)) * step(h, uSpecks * 0.6);
  color = mix(color, uSpeckColor, speck);

  // Frozen, creamy surface: fine crystalline shading plus a soft broad light.
  float crystal = valueNoise3(vec3(p * 60.0 * uScale + q * 4.0, 8.0));
  color *= 0.95 + 0.07 * crystal;
  color *= 0.94 + 0.12 * smoothstep(0.3, 0.7, q.y);
  return color;
}

void main() {
  vec2 p = centered();
  float t = TAU * uPhase;

  vec3 color = uStyle < 0.5 ? waves(p, t)
    : uStyle < 1.5 ? mesh(p, t)
    : uStyle < 2.5 ? linear(p, t)
    : uStyle < 3.5 ? marble(p, t)
    : scoop(p, t);

  // S-curve around mid grey for punchier, high-contrast palettes.
  vec3 c = clamp(color, 0.0, 1.0);
  color = mix(color, c * c * (3.0 - 2.0 * c), uContrast * 0.7);

  // Soft vignette: darken with squared distance from the center.
  vec2 v = p * vec2(0.55, 0.8);
  color *= 1.0 - 0.35 * uVignette * dot(v, v);

  // Film grain, re-rolled every step (uStep wraps with the loop).
  float n = hash12(gl_FragCoord.xy + vec2(uStep * 17.31, uStep * 5.13)) - 0.5;
  color += n * 0.12 * uGrain;

  emit(max(color, 0.0), 1.0);
}
`;
