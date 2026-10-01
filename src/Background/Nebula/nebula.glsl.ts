import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: layered fBm with warping, thresholded into gas and dust.
 * Two warped gas clouds in colorA / colorB, dark dust lanes cut through
 * them, a glowing core in colorC and a thin layer of twinkling stars.
 */
export const nebulaGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

float stars(vec2 p) {
  float aspect = uResolution.x / uResolution.y;
  float cells = 70.0;
  float cellSize = 2.0 * aspect / cells;
  vec2 q = (p + vec2(aspect, 1.0)) / cellSize;
  vec2 cell = floor(q);
  vec2 id = cell + uSeed * 3.1;
  float h = hash12(id);
  if (h > 0.35) return 0.0;
  vec2 pos = cell + 0.2 + 0.6 * vec2(hash12(id + 1.7), hash12(id + 4.4));
  vec2 d = (q - pos) * cellSize;
  float twinkle = 0.55 + 0.45 * sin(TAU * (uPhase * 4.0 + h * 11.0));
  return exp(-dot(d, d) / 0.000006) * twinkle;
}

void main() {
  vec2 p = centered() * 1.1 * uScale;
  vec3 lo = loopOffset(uPhase, 0.22, uSeed);

  vec2 warp = vec2(fbm3(vec3(p * 0.9, 1.0) + lo, 4), fbm3(vec3(p * 0.9 + 4.3, 2.0) + lo, 4)) - 0.5;
  float gasA = fbm3(vec3(p * 1.2 + warp * 1.4, 3.0) + lo, 6);
  float gasB = fbm3(vec3(p * 1.7 - warp * 1.1 + 2.7, 6.0) + lo * 1.3, 6);
  float dust = smoothstep(0.52, 0.72, fbm3(vec3(p * 2.4 + warp * 2.0, 9.0) + lo, 5));

  vec3 color = uColorA * pow(smoothstep(0.35, 0.8, gasA), 1.6) * 1.5
    + uColorB * pow(smoothstep(0.4, 0.85, gasB), 1.8) * 1.2;
  color += uColorC * exp(-dot(p - vec2(0.2, 0.05), p - vec2(0.2, 0.05)) * 2.2) * gasA * 0.9;
  color *= 1.0 - dust * 0.75;
  color *= uIntensity;
  color += vec3(stars(centered())) * (1.0 - dust * 0.6);

  emit(uBackground.rgb * (1.0 - clamp(length(color), 0.0, 1.0)) + color, 1.0);
}
`;
