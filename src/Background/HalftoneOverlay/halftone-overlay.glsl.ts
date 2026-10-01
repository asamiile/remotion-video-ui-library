import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";
import {
  loopOffsetGlsl,
  valueNoise3dGlsl,
} from "../../helpers/shader/glsl/noise";

/**
 * Transparent halftone screen in output pixels: a rotated grid of cells,
 * one mark per cell, sized by coverage (dot area or line thickness).
 * Coverage can vary slowly (looping noise) and fade toward the center.
 * Only the marks are opaque; everything else is fully transparent.
 */
export const halftoneOverlayGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}
${valueNoise3dGlsl}
${loopOffsetGlsl}

uniform float uCellPx;
uniform float uAngle;
uniform float uCoverage;
uniform float uVariation;
uniform float uEdgeFade;
uniform float uDriftCells;
uniform float uShape;

void main() {
  vec2 px = gl_FragCoord.xy - uResolution * 0.5;
  float a = radians(uAngle);
  vec2 r = vec2(cos(a) * px.x - sin(a) * px.y, sin(a) * px.x + cos(a) * px.y);
  // Sliding a whole number of cells per loop keeps the loop seamless.
  r.x += uPhase * uDriftCells * uCellPx;
  vec2 g = r / uCellPx;
  vec2 local = fract(g) - 0.5;

  // Coverage, varied slowly across the frame and faded toward the center.
  vec2 p = centered();
  float coverage = uCoverage;
  float n = valueNoise3(vec3(p * 1.6, 0.0) + loopOffset(uPhase, 0.6, uSeed));
  coverage *= mix(1.0, 0.35 + 1.3 * n, uVariation);
  float edge = smoothstep(0.35, 1.25, length(p * vec2(0.62, 0.95)));
  coverage *= mix(1.0, edge, uEdgeFade);
  coverage = clamp(coverage, 0.0, 1.0);

  float d;
  float size;
  if (uShape < 0.5) {
    // Dot area = coverage of the cell.
    d = length(local);
    size = sqrt(coverage / 3.14159265);
  } else {
    // Line thickness = coverage of the row.
    d = abs(local.y);
    size = 0.5 * coverage;
  }
  float aa = max(fwidth(d), 1e-5);
  float mask = (1.0 - smoothstep(size - aa, size + aa, d)) * step(0.001, coverage);

  emit(uColorA * mask, mask);
}
`;
