import { shaderBackgroundCommonGlsl } from "../../helpers/shader/background/common";

/**
 * Technique: per-pixel hash noise re-rolled every step.
 * Analog TV static: blocky random pixels, scanlines, a bright bar rolling
 * down the screen and horizontal line jitter. colorC adds chroma noise.
 *
 * Optional analog artifacts (each off at 0):
 * - uCurvature: CRT barrel distortion, rounded corners and vignette
 * - uPhosphorMask: RGB phosphor stripes
 * - uScanlines: darkness between scanlines
 * - uTrackingBand: VHS tracking band with displaced, streaky lines
 * - uSignalBursts: occasional bursts of heavy static with tearing
 * - uVerticalRoll: picture rolling upward with a dark sync bar
 */
export const tvStaticGlsl = /* glsl */ `
${shaderBackgroundCommonGlsl}

uniform float uCurvature;
uniform float uPhosphorMask;
uniform float uScanlines;
uniform float uTrackingBand;
uniform float uSignalBursts;
uniform float uVerticalRoll;

// Signal bursts last this many steps.
const float BURST_STEPS = 6.0;

void main() {
  vec2 uv = vUv;

  // CRT barrel distortion; outside the tube is the dark bezel.
  vec2 c = uv * 2.0 - 1.0;
  c *= 1.0 + uCurvature * 0.08 * vec2(c.y * c.y, c.x * c.x);
  uv = c * 0.5 + 0.5;
  vec2 corner = max(abs(c) - (1.0 - 0.08 * uCurvature), 0.0);
  float screen = 1.0 - smoothstep(0.075 * uCurvature, 0.075 * uCurvature + 0.004, length(corner));
  screen *= step(abs(c.x), 1.0) * step(abs(c.y), 1.0);
  // Clamped: uv leaves 0-1 outside the tube, and pow() of a negative is NaN.
  float vignette = mix(1.0, pow(max(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.0), 0.3), uCurvature);

  // Vertical hold failure: the picture rolls up past a dark sync bar.
  float rolled = fract(uv.y + uPhase * 2.0 * step(0.001, uVerticalRoll));
  float syncBar = smoothstep(0.0, 0.02, rolled) * smoothstep(0.1, 0.05, rolled) * uVerticalRoll;

  // Occasional signal bursts, chosen per window of steps (loops with uStep).
  float window = floor(uStep / BURST_STEPS);
  float burst = step(1.0 - uSignalBursts * 0.45, hash12(vec2(window, uSeed + 5.0)));

  vec2 px = uv * uResolution;
  float line = floor(px.y / 3.0);
  float tear = burst * (hash12(vec2(floor(px.y / 24.0), uStep)) - 0.5) * 60.0;
  float rowJitter = (hash12(vec2(line, uStep + uSeed)) - 0.5) * 6.0 + tear;

  // VHS tracking band drifting near the bottom of the frame.
  float bandY = 0.2 + 0.08 * sin(TAU * uPhase);
  float band = exp(-pow((uv.y - bandY) / 0.045, 2.0)) * uTrackingBand;
  rowJitter += band * (hash12(vec2(line, uStep * 1.7)) - 0.5) * 140.0;

  float pixelSize = max(1.0, floor(2.0 * uScale));
  vec2 cell = floor((px + vec2(rowJitter, rolled * uResolution.y - px.y)) / pixelSize);
  vec2 seed = cell + vec2(uStep * 17.13, uStep * 3.71) + uSeed;
  float n = hash12(seed);

  // Bright bar rolling down three times per loop.
  float roll = fract(uv.y + uPhase * 3.0);
  float bar = smoothstep(0.0, 0.06, roll) * smoothstep(0.22, 0.06, roll);
  float scan = 1.0 - uScanlines * (0.5 + 0.5 * sin(px.y * 3.14159265));

  float v = clamp(pow(n, 0.75) * scan * (0.95 + 0.6 * bar), 0.0, 1.0);
  vec3 chroma = vec3(hash12(seed + 1.1), hash12(seed + 2.3), hash12(seed + 3.7)) - 0.5;
  vec3 color = max(mix(uColorA, uColorB, v) + chroma * uColorC * 0.9, 0.0);

  // RGB phosphor stripes: each column lights one channel.
  float column = mod(floor(px.x), 3.0);
  vec3 mask = vec3(column == 0.0 ? 1.0 : 0.0, column == 1.0 ? 1.0 : 0.0, column == 2.0 ? 1.0 : 0.0);
  color *= mix(vec3(1.0), mask * 2.2 + 0.25, uPhosphorMask);

  float intensity = uIntensity * (1.0 + burst * 2.5);
  float alpha = clamp(v * intensity, 0.0, 1.0);
  vec3 premultiplied = color * alpha;

  // Tracking streaks and white dropouts ride on top of the static.
  float streak = band * step(0.55, hash12(vec2(line, floor(px.x / 90.0) + uStep * 3.0)));
  float dropout = step(0.9993 - band * 0.02, hash12(vec2(line, floor(px.x / 36.0) + uStep * 7.0)))
    * (uTrackingBand + burst * 0.5);
  float highlight = clamp(streak * 0.7 + dropout, 0.0, 1.0);
  premultiplied = premultiplied * (1.0 - highlight) + uColorB * highlight;
  alpha = alpha + highlight * (1.0 - alpha);

  // The sync bar blanks the picture.
  premultiplied *= 1.0 - syncBar * 0.92;
  alpha = mix(alpha, 1.0, syncBar * step(0.5, uBackground.a));

  premultiplied *= vignette * screen;
  alpha *= screen;
  if (uCurvature > 0.0 && screen < 1.0) {
    // Dark bezel around the tube.
    float bezel = 1.0 - screen;
    premultiplied = premultiplied + vec3(0.015) * bezel;
    alpha = alpha + bezel * (1.0 - alpha);
  }

  emit(premultiplied, alpha);
}
`;
