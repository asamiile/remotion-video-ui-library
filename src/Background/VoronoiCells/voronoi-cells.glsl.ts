import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: Voronoi (distance to the nearest random point).
 * Each grid cell holds one moving point; every pixel finds its nearest and
 * second-nearest points. Their difference is small near borders, which
 * draws glowing cell walls.
 */
export const voronoiCellsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

void main() {
  vec2 p = centered() * 2.4 * uScale;
  vec2 cell = floor(p);
  vec2 f = fract(p);

  float nearest = 8.0;
  float second = 8.0;
  vec2 nearestId = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 n = vec2(float(x), float(y));
      vec2 id = cell + n + uSeed;
      vec2 h = vec2(hash12(id), hash12(id + 7.3));
      // Each point circles once per loop.
      vec2 point = n + 0.5 + 0.38 * vec2(cos(TAU * (uPhase + h.x)), sin(TAU * (uPhase + h.y)));
      float d = length(point - f);
      if (d < nearest) {
        second = nearest;
        nearest = d;
        nearestId = id;
      } else if (d < second) {
        second = d;
      }
    }
  }

  float edge = second - nearest;
  float wall = 1.0 - smoothstep(0.0, 0.05, edge);
  float glow = exp(-edge / 0.12) * 0.5;
  vec3 cellColor = mix(uColorA, uColorB, hash12(nearestId)) * (0.35 + 0.65 * (1.0 - nearest));
  vec3 color = cellColor + uColorC * (wall + glow) * uIntensity;

  emit(color, 1.0);
}
`;
