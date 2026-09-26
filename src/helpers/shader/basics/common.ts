import { hashGlsl } from "../glsl/noise";

/**
 * Shared by the basic-technique shader backgrounds (GradientFlow, RippleRings, ...): the uniforms the template passes in
 * and two small helpers.
 *
 * - centered(): screen position with the origin in the middle, y in [-1, 1]
 *   and x scaled by the aspect ratio, so circles stay round.
 * - emit(): writes a premultiplied color over the backdrop color.
 *
 * All motion uses uPhase (0-1 over the loop), so animations built from
 * sin(TAU * uPhase * integer) or fract(... + uPhase * integer) loop seamlessly.
 */
export const shaderBasicsCommonGlsl = /* glsl */ `
${hashGlsl}

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec4 uBackground;
uniform float uPhase;
uniform float uStep;
uniform float uScale;
uniform float uIntensity;
uniform float uSeed;

const float TAU = 6.28318530718;

vec2 centered() {
  float aspect = uResolution.x / uResolution.y;
  return (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
}

void emit(vec3 premultipliedColor, float alpha) {
  alpha = clamp(alpha, 0.0, 1.0);
  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  gl_FragColor = vec4(min(premultipliedColor, vec3(alpha)), alpha) + bg * (1.0 - alpha);
}
`;
