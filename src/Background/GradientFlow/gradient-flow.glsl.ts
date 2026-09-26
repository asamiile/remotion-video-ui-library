import { shaderBasicsCommonGlsl } from "../../helpers/shader/basics/common";

/**
 * Technique: mix + sin.
 * Two slow sine waves bend a three-color gradient into a flowing backdrop.
 */
export const gradientFlowGlsl = /* glsl */ `
${shaderBasicsCommonGlsl}

void main() {
  vec2 p = centered();

  // Waves whose phase advances by whole turns over the loop.
  float w1 = sin(p.x * 1.3 * uScale + TAU * uPhase + sin(p.y * 2.0 + TAU * uPhase) * 0.8);
  float w2 = sin(p.y * 1.7 * uScale - TAU * uPhase * 2.0 + p.x * 0.6);
  float t = 0.5 + 0.25 * w1 + 0.25 * w2; // 0-1

  vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.6, t));
  color = mix(color, uColorC, smoothstep(0.55, 1.0, t) * uIntensity);

  // Soft vignette: darken with squared distance from the center.
  vec2 v = p * vec2(0.55, 0.8);
  color *= 1.0 - 0.35 * dot(v, v);

  emit(color, 1.0);
}
`;
