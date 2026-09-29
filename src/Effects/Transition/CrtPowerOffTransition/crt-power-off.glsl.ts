/**
 * CRT switching off and on: the picture squeezes to a bright horizontal
 * line, then to a glowing dot, leaving the screen black (the cut); it then
 * switches back on in reverse with a small overshoot. Outside the picture
 * the tube is dark; the picture itself shows the backdrop (transparent in
 * the Transparent patterns). Premultiplied RGBA.
 */
export const crtPowerOffGlsl = /* glsl */ `
uniform vec4 uBackground;
uniform vec3 uGlowColor;
uniform vec3 uTubeColor;
uniform float uOff;      // 0 = picture on, 1 = fully off
uniform float uScanlines;

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 c = (vUv - 0.5) * 2.0; // -1..1 on both axes

  // Squeeze vertically first, then horizontally, then the dot fades.
  float squeezeY = smoothstep(0.0, 0.55, uOff);
  float squeezeX = smoothstep(0.5, 0.85, uOff);
  float halfHeight = mix(1.0, 0.004, pow(squeezeY, 0.6));
  float halfWidth = mix(1.0, 0.006, pow(squeezeX, 0.7));
  float dotFade = 1.0 - smoothstep(0.85, 1.0, uOff);

  vec2 d = abs(c) - vec2(halfWidth, halfHeight);
  float inside = 1.0 - step(0.0, max(d.x, d.y));

  // The squeezed picture overexposes toward white.
  float overexpose = smoothstep(0.15, 0.6, uOff);

  // Glow around the collapsing picture, stretched along the line.
  vec2 gp = max(d, 0.0) * vec2(aspect, 1.0);
  float glow = exp(-length(gp) / 0.03) * 0.9 + exp(-length(gp) / 0.15) * 0.35;
  glow *= step(0.02, uOff) * dotFade;
  float scan = 1.0 - uScanlines * (0.5 + 0.5 * sin(gl_FragCoord.y * 3.14159265));

  vec4 bg = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  // Picture: the backdrop, washed toward the glow color as it collapses.
  vec4 picture = bg * (1.0 - overexpose) + vec4(uGlowColor, 1.0) * overexpose * dotFade;
  picture.rgb *= scan;
  // Tube: opaque dark glass lit by the glow.
  vec4 tube = vec4(uTubeColor + uGlowColor * glow, 1.0);

  vec4 color = inside > 0.5 && dotFade > 0.0 ? picture : tube;
  gl_FragColor = vec4(min(color.rgb, vec3(color.a)), color.a);
}
`;
