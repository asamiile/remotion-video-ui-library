import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: grid cells + hash (random point per cell) + exp glow.
 * Each cell places one star at a random spot. Three layers at different
 * sizes and speeds give parallax; bright stars get cross-shaped glints.
 */
export const starfieldGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

vec4 starLayer(vec2 p, float layer) {
  float aspect = uResolution.x / uResolution.y;
  float cells = floor((22.0 + layer * 18.0) * uScale);
  float cellSize = 2.0 * aspect / cells;
  // Shift by whole screen widths per loop and wrap cells horizontally.
  float shift = uPhase * 2.0 * aspect * (3.0 - layer);
  vec2 q = vec2(p.x + aspect + shift, p.y + 1.0) / cellSize;
  vec2 cell = floor(q);
  vec2 id = vec2(mod(cell.x, cells), cell.y) + layer * 53.0 + uSeed;
  float h = hash12(id);
  if (h > 0.5) return vec4(0.0);

  vec2 pos = cell + 0.2 + 0.6 * vec2(hash12(id + 1.3), hash12(id + 4.1));
  vec2 d = (q - pos) * cellSize;
  float size = mix(0.0015, 0.0045, hash12(id + 8.8)) * (1.0 + (2.0 - layer) * 0.4);
  float twinkle = 0.6 + 0.4 * sin(TAU * (uPhase * 5.0 + h * 9.0));
  float core = exp(-dot(d, d) / (size * size));
  float bright = step(0.47, h);
  float glint = bright * (exp(-abs(d.x) / 0.002) * exp(-abs(d.y) / 0.03)
    + exp(-abs(d.y) / 0.002) * exp(-abs(d.x) / 0.03)) * 0.6;
  float light = (core + glint) * twinkle;
  vec3 color = bright > 0.5 ? uColorC : mix(uColorA, uColorB, hash12(id + 2.2));
  return vec4(color * light, light);
}

void main() {
  vec2 p = centered();
  vec4 stars = starLayer(p, 0.0) + starLayer(p, 1.0) * 0.8 + starLayer(p, 2.0) * 0.6;
  emit(stars.rgb * uIntensity, stars.a * uIntensity);
}
`;
