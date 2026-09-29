import { hashGlsl } from "../../../helpers/shader/glsl/noise";

/**
 * Thousands of streaking dust particles spiral down a log-polar tunnel toward
 * the center; a core flash swells to fill the frame at the midpoint (cut
 * point) and collapses again. Premultiplied RGBA output.
 */
export const quantumDustTunnelFragmentShader = /* glsl */ `
${hashGlsl}

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uAccent;
uniform float uTravel;
uniform float uEnvelope;
uniform float uFlash;
uniform float uIntensity;
uniform float uDensity;
uniform float uSeed;

const float TAU = 6.28318530718;

// One layer of particles laid out on a (angle, log radius) grid, so cells
// shrink toward the center like a perspective tunnel.
vec4 dustLayer(float angle, float logR, float layer) {
  float cells = floor(mix(46.0, 110.0, layer / 2.0) * uDensity);
  float swirl = 0.55 + layer * 0.3;
  vec2 u = vec2(angle + logR * swirl, logR) * cells / TAU;
  u.y += uTravel * (1.6 + layer * 0.8) * cells / TAU;
  vec2 base = floor(u);
  vec4 sum = vec4(0.0);
  // Streaks are longer than a cell radially, so also check the neighbors.
  for (int dy = -1; dy <= 1; dy++) {
    vec2 cell = base + vec2(0.0, float(dy));
    vec2 id = vec2(mod(cell.x, cells), cell.y) + layer * 97.0 + uSeed;
    float h = hash12(id);
    if (h > 0.55) continue;
    vec2 center = cell + 0.5 + (vec2(hash12(id + 1.7), hash12(id + 5.3)) - 0.5) * vec2(0.6, 0.9);
    vec2 d = (u - center) * vec2(1.0, 0.3); // radial streak
    float spark = exp(-dot(d, d) * 70.0);
    float pick = hash12(id + 9.1);
    vec3 color = pick < 0.12 ? uAccent : mix(uPrimary, uSecondary, pick);
    sum += vec4(color * spark, spark);
  }
  return sum;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float r = length(p);
  float angle = atan(p.y, p.x);
  float logR = log(max(r, 1e-3));

  vec4 dust = vec4(0.0);
  for (int i = 0; i < 3; i++) {
    dust += dustLayer(angle, logR, float(i));
  }
  // Fade out the singular center and the far rim.
  float radialFade = smoothstep(0.02, 0.25, r) * smoothstep(2.4, 1.2, r);
  dust *= radialFade * uEnvelope * uIntensity;

  // Swirling glow down the tunnel throat.
  float throat = exp(-r * 2.2) * 0.6 * uEnvelope;
  vec3 color = dust.rgb + mix(uSecondary, uPrimary, 0.5) * throat;
  float alpha = clamp(dust.a + throat * 0.8, 0.0, 1.0);

  // Core flash swelling to fill the frame at the midpoint.
  // Solid inside 0.55 * radius, which reaches past the frame corners at 1.
  float radius = uFlash * length(vec2(aspect, 1.0)) / 0.5;
  float flash = smoothstep(radius, radius * 0.55, r) * step(0.001, uFlash);
  float halo = exp(-max(r - radius, 0.0) / 0.12) * uFlash * 0.7;
  vec3 flashColor = mix(uAccent, vec3(1.0), smoothstep(radius, 0.0, r) * 0.6);
  color = mix(color + uPrimary * halo, flashColor, flash);
  alpha = max(clamp(alpha + halo, 0.0, 1.0), flash);

  // color is already premultiplied.
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;
