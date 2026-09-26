import {
  hashGlsl,
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../../helpers/shader/glsl/noise";

/**
 * A swinging overhead light cone with streaked god rays, drifting haze, dust
 * glinting in the beam and a scan plane sweeping down through it.
 * Premultiplied RGBA over transparency.
 */
export const volumetricLightScanFragmentShader = /* glsl */ `
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

float dust(vec2 p, float aspect) {
  float cells = floor(28.0 * uDensity);
  float cellSize = 2.0 * aspect / cells;
  vec3 lo = loopOffset(uPhase, 0.15, uSeed);
  vec2 q = (p + vec2(aspect, 1.0) + lo.xy) / cellSize;
  vec2 cell = floor(q);
  vec2 id = cell + uSeed * 3.3;
  float h = hash12(id);
  if (h > 0.45) return 0.0;
  vec2 pos = cell + vec2(hash12(id + 2.1), hash12(id + 6.4));
  vec2 d = (q - pos) * cellSize;
  float twinkle = 0.5 + 0.5 * sin(TAU * (uPhase * 4.0 + h * 7.0));
  return exp(-dot(d, d) / 0.000018) * twinkle;
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
  float top = 1.0 - uSafeArea * 2.0;

  // Source swings side to side above the frame; one swing per loop.
  float sway = sin(TAU * uPhase);
  vec2 source = vec2(sway * aspect * 0.55, top + 0.18);
  vec2 v = p - source;
  float dist = length(v);
  float angle = atan(v.x, -v.y) + sway * 0.18;

  vec3 lo = loopOffset(uPhase, 0.9, uSeed);
  float rays = fbm3(vec3(angle * 9.0 * uDensity, dist * 0.25, 0.0) + lo, 4);
  float streaks = pow(smoothstep(0.3, 0.8, rays), 1.6);
  float cone = exp(-pow(angle / 0.42, 2.0));
  float falloff = exp(-dist * 0.55);
  float haze = fbm3(vec3(p * 1.8, 5.0) + lo * 0.6, 4);

  float beam = cone * falloff * (0.25 + streaks) * (0.6 + 0.6 * haze) * uIntensity;
  vec3 color = mix(uSecondary, uPrimary, streaks) * beam;

  // Scan plane sweeping down, re-entering from above out of frame.
  float scanY = mix(top + 0.2, -1.2, fract(uPhase * 2.0));
  float scan = exp(-abs(p.y - scanY) / 0.012) + exp(-abs(p.y - scanY) / 0.08) * 0.25;
  color += uPrimary * scan * (0.15 + cone * falloff * 1.4) * uIntensity;

  color += uAccent * dust(p, aspect) * cone * falloff * 2.0;

  color *= uOpacity;
  float alpha = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
}
`;
