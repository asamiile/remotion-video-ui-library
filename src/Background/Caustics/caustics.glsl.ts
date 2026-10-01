import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: ridged noise (1 - |2n - 1|) raised to a power.
 * Ridges of noise form thin bright lines; two drifting layers multiplied
 * together brighten where they cross, like sunlight focused by a water
 * surface onto a pool floor.
 */
export const causticsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

float ridge(float n) {
  return 1.0 - abs(n * 2.0 - 1.0);
}

void main() {
  vec2 p = centered() * 2.2 * uScale;
  vec3 lo1 = loopOffset(uPhase, 0.5, uSeed);
  vec3 lo2 = loopOffset(uPhase, 0.5, uSeed + 2.4);

  // Few octaves keep the ridges long and thin instead of blotchy.
  float a = pow(ridge(fbm3(vec3(p, 0.0) + lo1, 2)), 16.0);
  float b = pow(ridge(fbm3(vec3(p * 1.3 + 3.1, 4.0) + lo2, 2)), 16.0);
  float light = (a + b) * 0.45 + a * b * 3.0;

  // Soft sunlight falloff toward the bottom of the frame.
  float falloff = mix(0.55, 1.0, vUv.y);
  vec3 floorColor = mix(uColorB * 0.6, uColorB, vUv.y);
  vec3 caustic = uColorA * light * falloff * uIntensity;

  if (uBackground.a > 0.0) {
    emit(floorColor + caustic + uColorC * 0.08 * falloff, 1.0);
  } else {
    // Transparent: only the light, for layering over footage.
    float alpha = clamp(max(caustic.r, max(caustic.g, caustic.b)), 0.0, 1.0);
    emit(caustic, alpha);
  }
}
`;
