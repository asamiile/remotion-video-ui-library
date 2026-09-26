import { shaderBasicsCommonGlsl } from "../../helpers/shader/basics/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Technique: fBm displacement + stretched noise for vertical rays.
 * Three curtains whose lower edge wanders with low-frequency noise; light
 * rises from that edge in fine vertical rays and fades upward, shifting from
 * colorA at the bottom to colorB at the top.
 */
export const auroraGlsl = /* glsl */ `
${shaderBasicsCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

void main() {
  vec2 p = centered();
  vec3 color = vec3(0.0);

  for (int i = 0; i < 3; i++) {
    float layer = float(i);
    vec3 lo = loopOffset(uPhase, 0.6 + layer * 0.15, layer * 2.1 + uSeed);
    float edge = -0.25 + layer * 0.22
      + (fbm3(vec3(p.x * 0.55 * uScale, layer * 4.0, 0.0) + lo, 4) - 0.5) * 0.9;
    float above = p.y - edge;

    float rays = fbm3(vec3(p.x * 7.0 * uScale + lo.x * 3.0, layer * 9.0, lo.z * 2.0), 4);
    float curtain = smoothstep(-0.04, 0.03, above) * exp(-max(above, 0.0) * (2.2 + layer));
    float light = curtain * (0.35 + 1.1 * smoothstep(0.35, 0.8, rays));

    vec3 tint = mix(uColorA, uColorB, clamp(above * 1.4, 0.0, 1.0));
    color += tint * light * (0.9 - layer * 0.2);
  }
  // A faint glow hugging the horizon.
  color += uColorC * exp(-abs(p.y + 0.55) * 3.0) * 0.12;

  color *= uIntensity;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  emit(color, alpha);
}
`;
