import { shaderBasicsCommonGlsl } from "../../helpers/shader/basics/common";

/**
 * Technique: fract (repetition) + perspective division + fwidth.
 * Dividing by the distance below the horizon turns a flat grid into a floor
 * receding into the distance; fract repeats the cells and fwidth keeps the
 * lines one pixel wide at every depth. A striped sun sits on the horizon.
 */
export const synthGridGlsl = /* glsl */ `
${shaderBasicsCommonGlsl}

void main() {
  vec2 p = centered();
  float horizon = 0.02;

  // Floor coordinates (computed everywhere so fwidth stays well-defined).
  float depth = 1.0 / max(horizon - p.y, 0.002);
  // Four rows scroll past per loop: whole grid periods keep it seamless.
  vec2 g = vec2(p.x * depth * 0.9 * uScale, depth * 0.6 * uScale + uPhase * 4.0);
  vec2 lineDist = abs(fract(g - 0.5) - 0.5) / fwidth(g);
  float line = 1.0 - min(min(lineDist.x, lineDist.y), 1.0);
  float distanceFade = smoothstep(60.0, 3.0, depth);
  float isFloor = step(p.y, horizon);

  vec3 floorColor = uBackground.rgb * 0.6 + uColorA * line * distanceFade * uIntensity
    + uColorA * 0.12 * exp(-(horizon - p.y) * 4.0);

  // Sky: glow rising from the horizon.
  vec3 sky = mix(uBackground.rgb, uColorC * 0.45, exp(-(p.y - horizon) * 3.0));

  // Sun: a circle whose lower half is cut by stripes that thicken downward.
  vec2 sunCenter = vec2(0.0, horizon + 0.38);
  float sunDist = length(p - sunCenter);
  float sunBody = smoothstep(0.42, 0.41, sunDist);
  float below = clamp((sunCenter.y - p.y) / 0.42, 0.0, 1.0);
  float stripe = step(below * 0.55, fract(p.y * 22.0 - uPhase * 5.0));
  float sun = sunBody * mix(1.0, stripe, step(0.0, sunCenter.y - p.y));
  vec3 sunColor = mix(uColorB, uColorC, below);
  sky = mix(sky, sunColor, sun) + uColorB * 0.25 * exp(-max(sunDist - 0.42, 0.0) * 5.0);

  vec3 color = mix(sky, floorColor, isFloor);
  color += uColorC * exp(-abs(p.y - horizon) / 0.015) * 0.6;

  emit(color, 1.0);
}
`;
