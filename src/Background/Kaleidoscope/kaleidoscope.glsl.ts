import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: polar coordinates + angle folding (mod / abs).
 * Folding the angle into mirrored wedges makes any pattern symmetric.
 * Rotating by exactly one wedge per loop looks identical, so it loops.
 */
export const kaleidoscopeGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

void main() {
  vec2 p = centered();
  float r = length(p);
  float wedges = 8.0;
  float wedge = TAU / wedges;

  float angle = atan(p.y, p.x) + wedge * uPhase;
  angle = mod(angle, wedge);
  angle = abs(angle - wedge * 0.5); // mirror inside each wedge
  vec2 q = vec2(cos(angle), sin(angle)) * r;

  float petals = sin(q.x * 10.0 * uScale - TAU * uPhase * 2.0) * cos(q.y * 14.0 * uScale);
  float rings = sin(r * 16.0 * uScale - TAU * uPhase * 3.0);
  float v = petals * 0.6 + rings * 0.4;

  float fill = smoothstep(-0.2, 1.0, v);
  float lines = 1.0 - smoothstep(0.0, 2.0 * fwidth(v) + 0.03, abs(v));
  vec3 color = mix(uColorA, uColorB, 0.5 + 0.5 * v) * (0.2 + 0.8 * fill)
    + uColorC * lines * uIntensity;
  color *= smoothstep(1.9, 0.6, r);
  color = mix(uBackground.rgb, color, smoothstep(1.9, 1.2, r));

  emit(color, 1.0);
}
`;
