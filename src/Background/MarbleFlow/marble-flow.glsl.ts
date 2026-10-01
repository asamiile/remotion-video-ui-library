import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: domain warping (noise that bends the input of more noise).
 * fbm(p + fbm(p + fbm(p))) produces flowing, liquid marble. The two warp
 * vectors (q, r) are reused to pick colors, and fine veins follow the
 * final value.
 *
 * Before the marble is sampled, the lookup point is moved twice:
 * 1. flow mode: a looping rotation / wave / scale of the whole field
 * 2. ripple: radial sine rings, like refraction through a water surface
 * Every motion is driven by uPhase, so all modes loop seamlessly.
 *
 * Clarity fakes translucent stone: the dark bands are lifted toward a
 * milky tint, the second warp layer (r) acts as layer thickness so light
 * glows through thin areas, and the vein lines are softened.
 */
export const marbleFlowGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform float uFlowMode;
uniform float uWarp;
uniform float uVeinDensity;
uniform float uClarity;
uniform float uRipple;
uniform float uRippleSources;
uniform float uRippleSpeed;

vec2 rotate2(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

/** Seeded point inside the visible area, in marble space. */
vec2 seededPoint(float i, float salt) {
  float aspect = uResolution.x / uResolution.y;
  vec2 h = vec2(
    hash12(vec2(i * 7.13 + salt, uSeed + 0.5)),
    hash12(vec2(uSeed + 1.5, i * 3.71 + salt)));
  return (h * 2.0 - 1.0) * vec2(aspect, 1.0) * 0.65 * 0.9 * uScale;
}

vec2 applyFlow(vec2 p, float t) {
  if (uFlowMode < 0.5) {
    return p;
  }
  if (uFlowMode < 1.5) {
    // Swirl: one full turn per cycle plus a twist that tightens at the core.
    float r = length(p) / uScale;
    return rotate2(p, t + 1.4 * sin(t) * exp(-r * 0.9));
  }
  if (uFlowMode < 2.5) {
    // Wave: crossing sine sways, like silk moving in a breeze.
    p.y += sin(p.x * 1.6 / uScale + t) * 0.22 * uScale;
    p.x += sin(p.y * 1.2 / uScale - t) * 0.14 * uScale;
    return p;
  }
  // Pulse: the field breathes in and out with a slight counter-rotation.
  return rotate2(p * (1.0 + 0.2 * sin(t)), 0.12 * sin(t));
}

void main() {
  float t = TAU * uPhase;
  vec2 p = centered() * 0.9 * uScale;
  vec3 lo = loopOffset(uPhase, 0.45, uSeed);

  p = applyFlow(p, t);

  // Water ripples: offset along the ring normal, shade from the slope.
  float shade = 0.0;
  if (uRipple > 0.0) {
    int sources = int(uRippleSources + 0.5);
    for (int i = 0; i < 4; i++) {
      if (i >= sources) break;
      vec2 c = sources == 1 ? vec2(0.0) : seededPoint(float(i), 11.0);
      vec2 d = p - c;
      float r = length(d) + 1e-4;
      float rs = r / uScale;
      float wave = rs * 11.0 - t * uRippleSpeed + float(i) * 1.7;
      float envelope = exp(-rs * (sources == 1 ? 0.9 : 1.8));
      p += d / r * sin(wave) * envelope * uRipple * 0.12 * uScale;
      shade += cos(wave) * envelope;
    }
  }

  vec2 q = vec2(
    fbm3(vec3(p, 0.0) + lo, 5),
    fbm3(vec3(p + vec2(5.2, 1.3), 1.0) + lo, 5));
  vec2 r = vec2(
    fbm3(vec3(p + uWarp * q + vec2(1.7, 9.2), 2.0) + lo * 0.7, 5),
    fbm3(vec3(p + uWarp * q + vec2(8.3, 2.8), 3.0) + lo * 0.7, 5));
  float f = fbm3(vec3(p + uWarp * r, 5.0) + lo * 0.5, 5);

  vec3 color = mix(uColorA, uColorB, clamp(f * f * 3.0, 0.0, 1.0));
  color = mix(color, uColorC, clamp(length(q - 0.5) * 1.6, 0.0, 1.0) * 0.55);
  color *= mix(0.55 + 0.9 * f, 0.85 + 0.45 * f, uClarity);

  // Thin glossy veins, softer and lower-contrast as clarity rises.
  float veinWidth = mix(0.03, 0.08, uClarity);
  float vein = 1.0 - smoothstep(0.0, veinWidth, abs(fract(f * uVeinDensity) - 0.5) - 0.44);
  color += vec3(0.35) * mix(1.0, 0.45, uClarity) * vein * r.x * uIntensity * step(0.001, uVeinDensity);

  // Translucency: the top layer thins out where f is low and reveals a soft,
  // low-frequency layer underneath (q is already smooth), light glows
  // through thin areas, and a sheen rides the mid values.
  vec3 tint = mix(uColorB, uColorC, 0.45);
  vec3 deep = mix(uColorA, uColorB, smoothstep(0.3, 0.7, q.x));
  deep = mix(deep, tint, 0.3 * smoothstep(0.35, 0.75, q.y));
  float coverage = smoothstep(0.3, 0.75, f);
  color = mix(deep, color, mix(1.0, 0.3 + 0.7 * coverage, uClarity));
  float thin = smoothstep(0.3, 0.8, r.y);
  float sheen = 1.0 - smoothstep(0.0, 0.18, abs(f - 0.55));
  color = mix(color, tint, uClarity * 0.2 * (1.0 - f));
  color += tint * uClarity * 0.25 * thin * thin;
  color += mix(uColorC, vec3(1.0), 0.5) * uClarity * 0.12 * sheen;
  // Roll off highlights so light areas stay glassy instead of clipping.
  color = mix(color, 1.0 - exp(-color * 1.5), uClarity * 0.7);

  // Ripple lighting: bright on one slope, dim on the other.
  float light = clamp(shade * uRipple, -1.0, 1.0);
  color *= 1.0 + light * 0.45;
  color += vec3(0.25) * max(light, 0.0) * uIntensity;

  emit(color, 1.0);
}
`;
