import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import { valueNoise3dGlsl } from "../../helpers/shader/glsl/noise";

/**
 * Technique: rising fBm + a heat → color ramp.
 * Noise scrolls upward and is cut off by height, giving licking flames along
 * the bottom edge. Endless upward motion cannot return to its start, so the
 * loop crossfades two samples one scroll-length apart. Embers rise on a grid
 * that moves whole cells per loop.
 */
export const fireFlamesGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}

const float SCROLL = 2.4;

float flameNoise(vec2 p, float offset) {
  vec2 q = vec2(p.x * 1.7 * uScale, p.y * 1.1 * uScale - offset);
  float turbulence = fbm3(vec3(q * 2.0, uSeed + 7.0 - offset * 0.3), 3) - 0.5;
  return fbm3(vec3(q + vec2(turbulence * 0.6, 0.0), uSeed), 5);
}

float embers(vec2 p) {
  float aspect = uResolution.x / uResolution.y;
  float cells = 26.0;
  float cellSize = 2.0 * aspect / cells;
  vec2 q = (p + vec2(aspect, 1.0)) / cellSize;
  // Scrolls by exactly one vertical ID period per loop, so it tiles seamlessly.
  q.y -= uPhase * 24.0;
  vec2 cell = floor(q);
  vec2 id = vec2(mod(cell.x, cells), mod(cell.y, 24.0)) + uSeed;
  if (hash12(id) > 0.18) return 0.0;
  vec2 pos = cell + vec2(0.5 + 0.35 * sin(TAU * (uPhase * 2.0 + hash12(id + 3.0))), hash12(id + 1.0));
  vec2 d = (q - pos) * cellSize;
  return exp(-dot(d, d) / 0.000025) * hash12(id + 5.0);
}

void main() {
  vec2 p = centered();
  float n = mix(
    flameNoise(p, SCROLL * uPhase),
    flameNoise(p, SCROLL * (uPhase - 1.0)),
    uPhase);

  float height = (p.y + 1.0) * 0.5; // 0 at the bottom, 1 at the top
  float heat = clamp(n * 1.7 - height * (1.9 / max(uIntensity, 0.1)) + 0.25, 0.0, 1.0);

  vec3 color = mix(uColorC, uColorB, smoothstep(0.15, 0.55, heat));
  color = mix(color, uColorA, smoothstep(0.55, 0.95, heat));
  float alpha = smoothstep(0.04, 0.3, heat);

  float ember = embers(p) * smoothstep(1.0, 0.1, height);
  color = color * alpha + uColorA * ember;
  alpha = clamp(alpha + ember, 0.0, 1.0);

  emit(color, alpha);
}
`;
