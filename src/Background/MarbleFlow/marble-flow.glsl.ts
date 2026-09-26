import { shaderBasicsCommonGlsl } from "../../helpers/shader/basics/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: domain warping (noise that bends the input of more noise).
 * fbm(p + fbm(p + fbm(p))) produces flowing, liquid marble. The two warp
 * vectors (q, r) are reused to pick colors, and fine veins follow the
 * final value.
 */
export const marbleFlowGlsl = /* glsl */ `
${shaderBasicsCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

void main() {
  vec2 p = centered() * 0.9 * uScale;
  vec3 lo = loopOffset(uPhase, 0.45, uSeed);

  vec2 q = vec2(
    fbm3(vec3(p, 0.0) + lo, 5),
    fbm3(vec3(p + vec2(5.2, 1.3), 1.0) + lo, 5));
  vec2 r = vec2(
    fbm3(vec3(p + 4.0 * q + vec2(1.7, 9.2), 2.0) + lo * 0.7, 5),
    fbm3(vec3(p + 4.0 * q + vec2(8.3, 2.8), 3.0) + lo * 0.7, 5));
  float f = fbm3(vec3(p + 4.0 * r, 5.0) + lo * 0.5, 5);

  vec3 color = mix(uColorA, uColorB, clamp(f * f * 3.0, 0.0, 1.0));
  color = mix(color, uColorC, clamp(length(q - 0.5) * 1.6, 0.0, 1.0) * 0.55);
  color *= 0.55 + 0.9 * f;

  // Thin glossy veins.
  float vein = 1.0 - smoothstep(0.0, 0.03, abs(fract(f * 7.0) - 0.5) - 0.44);
  color += vec3(0.35) * vein * r.x * uIntensity;

  emit(color, 1.0);
}
`;
