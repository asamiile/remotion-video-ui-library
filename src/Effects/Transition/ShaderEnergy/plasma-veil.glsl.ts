import { hashGlsl, valueNoise3dGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Two turbulent plasma curtains sweep in from the sides, seal at the midpoint
 * (fully opaque cut point) and part again. Premultiplied RGBA output.
 */
export const plasmaVeilFragmentShader = /* glsl */ `
${hashGlsl}
${valueNoise3dGlsl}

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;
uniform float uPeak;
uniform float uIntensity;
uniform float uDensity;
uniform float uSeed;
// Seconds since the animation started (not since frame 0), so the base and
// -10s versions render identical frames.
uniform float uAnimTime;

float ridge(float n) {
  return 1.0 - abs(n * 2.0 - 1.0);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float side = p.x < 0.0 ? 0.0 : 1.0;
  float t = uAnimTime * 1.4 + uSeed;

  // Jagged, independently churning front for each curtain.
  float opening = (1.0 - uPeak) * (aspect + 0.35);
  float coarse = (fbm3(vec3(side * 11.0, p.y * 1.5, t * 0.7), 5) - 0.5) * 0.8 * uIntensity;
  float fine = (fbm3(vec3(side * 5.0 + 3.0, p.y * 7.0, t * 2.3), 3) - 0.5) * 0.16 * uIntensity;
  float e = abs(p.x) - opening + coarse + fine;
  // Corona follows the smooth front so it doesn't streak horizontally.
  float eSmooth = abs(p.x) - opening + coarse;

  // Curtain body: rolling plasma with bright filaments.
  vec2 flow = p * 1.6 * uDensity + vec2(0.0, -t * 0.5);
  float plasma = fbm3(vec3(flow, t * 0.45 + side * 9.0), 5);
  float filaments = pow(ridge(fbm3(vec3(p * 3.2 * uDensity, t * 0.8 + side * 4.0), 4)), 7.0);
  vec3 body = mix(uSecondary, uPrimary, smoothstep(0.3, 0.75, plasma)) * (0.25 + 0.75 * plasma)
    + mix(uPrimary, uAccent, 0.6) * filaments * 0.7;
  float inside = smoothstep(0.0, 0.025, e);
  float bodyAlpha = inside * clamp(0.6 + plasma * 0.5 + filaments, 0.0, 1.0);

  // Hot leading edge with a wide corona.
  float core = exp(-abs(e) / 0.012);
  float corona = exp(-abs(eSmooth) / 0.08) * 0.45 + exp(-abs(eSmooth) / 0.3) * 0.1;
  float flicker = 0.75 + 0.25 * hash12(vec2(floor(uAnimTime * 24.0), side + uSeed));
  vec3 edge = (mix(uPrimary, vec3(1.0), 0.25) * corona + mix(uAccent, vec3(1.0), 0.5) * core)
    * uIntensity * flicker;
  float edgeAlpha = clamp((core + corona) * uIntensity, 0.0, 1.0);

  // Fade the off-screen corona in and out so the first/last frames are clear.
  float envelope = smoothstep(0.0, 0.2, uPeak);
  vec3 color = (body * bodyAlpha + edge) * envelope;
  float alpha = clamp(bodyAlpha + edgeAlpha * (1.0 - bodyAlpha), 0.0, 1.0) * envelope;

  // Guarantee a fully sealed frame at the midpoint.
  float seal = smoothstep(0.93, 1.0, uPeak);
  vec3 straight = color / max(alpha, 1e-3);
  alpha = mix(alpha, 1.0, seal);
  color = mix(color, straight, seal);

  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;
