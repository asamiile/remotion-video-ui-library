import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: fixed grid cells with variable-size printing marks.
 * The screen is divided into cells; each cell draws one dot whose radius
 * follows a wave sweeping across the frame, like print halftone.
 */
export const halftoneDotsGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

uniform float uField;
uniform float uShape;

void main() {
  vec2 p = centered();
  float cellSize = 0.06 / uScale;
  vec2 g = p / cellSize;
  vec2 cell = floor(g);
  vec2 local = fract(g) - 0.5;
  vec2 center = (cell + 0.5) * cellSize;

  // Line screens sample continuously along each fixed horizontal row.
  if (uShape > 2.5 && uShape < 3.5) center.x = p.x;

  // Brightness field sampled at the cell center.
  float wave = 0.5 + 0.5 * sin(dot(center, vec2(1.3, 0.8)) * 2.2 - TAU * uPhase * 2.0);
  float pool = exp(-dot(center * vec2(0.5, 0.9), center * vec2(0.5, 0.9)));
  float value = wave * mix(0.35, 1.0, pool);

  float phase = TAU * uPhase;
  if (uField > 0.5 && uField < 1.5) {
    // Concentric fronts expand without moving the printing grid.
    value = 0.5 + 0.5 * sin(length(center) * 10.0 - phase);
  } else if (uField > 1.5 && uField < 2.5) {
    // Periodic domain warping forms broad, gently breathing contour bands.
    float terrain = center.x * 2.0 + center.y * 1.4
      + 0.65 * sin(center.y * 2.5 + 0.6 * sin(phase))
      + 0.35 * cos(center.x * 3.0 - 0.5 * cos(phase));
    value = 0.5 + 0.5 * sin(terrain * 4.0 - phase);
  } else if (uField > 2.5 && uField < 3.5) {
    // Orbiting light stays outside a calm elliptical title area.
    vec2 orbit = vec2(1.15 * cos(phase), 0.7 * sin(phase));
    vec2 delta = center - orbit;
    float light = exp(-dot(delta, delta) * 1.8);
    float border = smoothstep(0.45, 1.15, length(center * vec2(0.72, 1.0)));
    value = border * (0.12 + 0.88 * light);
  } else if (uField > 3.5 && uField < 4.5) {
    float left = sin(length(center - vec2(-0.65, 0.0)) * 9.0 - phase);
    float right = sin(length(center - vec2(0.65, 0.0)) * 9.0 + phase);
    value = 0.5 + 0.25 * (left + right);
  } else if (uField > 4.5) {
    float bend = 0.45 * sin(center.x * 2.2 + phase);
    value = 0.5 + 0.5 * sin((center.y + bend) * 6.0 - phase);
  }

  float radius = 0.5 * sqrt(value) * uIntensity;
  float d = length(local);
  if (uShape > 0.5 && uShape < 1.5) {
    d = abs(local.x) + abs(local.y);
  } else if (uShape > 1.5 && uShape < 2.5) {
    d = max(abs(local.x), abs(local.y));
  } else if (uShape > 2.5 && uShape < 3.5) {
    d = abs(local.y);
  } else if (uShape > 3.5) {
    vec2 q = abs(local);
    d = min(max(q.x, q.y * 3.0), max(q.x * 3.0, q.y));
  }
  float aa = max(fwidth(d), 0.00001);
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, d);

  if (uIntensity <= 0.0) dotMask = 0.0;

  vec3 color = mix(uColorA, uColorB, value) * dotMask;
  emit(color, dotMask);
}
`;
