import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: length + sin + smoothstep.
 * Distance from the center fed into a sine wave gives concentric rings;
 * subtracting time makes them travel outward, smoothstep sharpens the crests.
 */
export const rippleRingsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

void main() {
  vec2 p = centered();
  float d = length(p);

  float wave = sin(d * 18.0 * uScale - TAU * uPhase * 3.0);
  float crest = smoothstep(0.8, 0.98, wave);
  float body = smoothstep(0.0, 1.0, wave) * 0.22;
  float fade = exp(-d * 1.1);

  float alpha = (crest + body) * fade * uIntensity;
  vec3 tint = mix(uColorA, uColorB, clamp(d / 1.6, 0.0, 1.0));
  vec3 color = tint * alpha + uColorC * crest * fade * 0.35 * uIntensity;

  emit(color, alpha);
}
`;
