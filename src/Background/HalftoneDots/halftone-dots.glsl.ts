import { shaderBasicsCommonGlsl } from "../../helpers/shader/basics/common";

/**
 * Technique: grid cells (floor / fract) + circle.
 * The screen is divided into cells; each cell draws one dot whose radius
 * follows a wave sweeping across the frame, like print halftone.
 */
export const halftoneDotsGlsl = /* glsl */ `
${shaderBasicsCommonGlsl}

void main() {
  vec2 p = centered();
  float cellSize = 0.06 / uScale;
  vec2 g = p / cellSize;
  vec2 cell = floor(g);
  vec2 local = fract(g) - 0.5;
  vec2 center = (cell + 0.5) * cellSize;

  // Brightness field sampled at the cell center.
  float wave = 0.5 + 0.5 * sin(dot(center, vec2(1.3, 0.8)) * 2.2 - TAU * uPhase * 2.0);
  float pool = exp(-dot(center * vec2(0.5, 0.9), center * vec2(0.5, 0.9)));
  float value = wave * mix(0.35, 1.0, pool);

  float radius = 0.5 * sqrt(value) * uIntensity;
  float d = length(local);
  float aa = fwidth(d);
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, d);

  vec3 color = mix(uColorA, uColorB, value) * dotMask;
  emit(color, dotMask);
}
`;
