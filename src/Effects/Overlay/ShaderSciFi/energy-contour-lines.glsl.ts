import {
  hashGlsl,
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../../helpers/shader/glsl/noise";

/**
 * Live topographic map: isolines of an evolving noise height field, with
 * accented index contours and energy pulses climbing the terrain.
 * Anti-aliased with screen-space derivatives. Premultiplied RGBA.
 */
export const energyContourLinesFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uIntensity;
uniform float uDensity;
uniform float uSafeArea;
uniform float uPhase;
uniform float uSeed;

const float TAU = 6.28318530718;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;

  vec3 q = vec3(p * 0.85, uSeed * 0.37) + loopOffset(uPhase, 0.7, uSeed);
  float h = fbm3(q, 5);

  float levels = 16.0 * uDensity;
  float v = h * levels;
  float fw = max(fwidth(v), 1e-4);
  float dLine = abs(fract(v + 0.5) - 0.5) / fw;
  float index = mod(floor(v + 0.5), 5.0);
  float isMajor = 1.0 - step(0.5, index);
  float width = mix(0.6, 1.4, isMajor) * (0.7 + 0.5 * uIntensity);
  float line = 1.0 - smoothstep(width - 0.5, width + 0.6, dLine);

  // Energy pulses climbing the terrain; three per loop keeps it seamless.
  float pulse = pow(0.5 + 0.5 * sin(v * 0.8 - uPhase * TAU * 3.0), 10.0);

  vec3 tint = mix(uSecondary, uPrimary, smoothstep(0.3, 0.72, h));
  vec3 lineColor = mix(tint, uAccent, isMajor * 0.7);
  float lineStrength = line * (0.35 + 0.35 * isMajor + 1.2 * pulse * uIntensity);
  vec3 color = lineColor * lineStrength + uAccent * line * pulse * 0.4;
  // Faint glow over the summits.
  color += tint * smoothstep(0.62, 0.82, h) * 0.06;

  // Fade out toward the safe area.
  vec2 edge = vec2(aspect, 1.0) * (1.0 - uSafeArea * 2.0);
  vec2 over = abs(p) - edge;
  float mask = smoothstep(0.0, -0.08, max(over.x, over.y));

  color *= uOpacity * mask;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;
