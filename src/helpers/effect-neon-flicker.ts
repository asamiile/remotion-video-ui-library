import { interpolate } from "remotion";

/**
 * Flicker curve for a neon tube powering on. One 1.1s cycle: opacity/brightness
 * flicker a few times before settling into a steady glow. Ported to `interpolate`
 * with the same percentages/values as the original CSS `@keyframes`, so it reproduces
 * frame-by-frame.
 * Works both for "fire once then stay lit" (pass `frame - triggerFrame` as `elapsedMs`)
 * and "loop continuously while hovered" (pass `elapsedMs % NEON_FLICKER_CYCLE_MS`).
 */
export const NEON_FLICKER_CYCLE_MS = 1100;

const KEYFRAME_PERCENTS = [
  0, 17, 17.5, 18.5, 19, 20, 20.5, 21.5, 36, 36.5, 37, 37.5, 52, 52.5, 53,
  53.5, 100,
];
const KEYFRAME_OPACITIES = [
  1, 1, 0.25, 1, 0.7, 1, 0.25, 1, 1, 0.25, 0.7, 1, 1, 0.25, 0.7, 1, 1,
];
const KEYFRAME_BRIGHTNESS = [
  1, 1, 2.4, 1, 1.6, 1, 2.4, 1, 1, 2.4, 1.6, 1, 1, 2.4, 1.6, 1, 1,
];

export type NeonFlickerState = { opacity: number; brightness: number };

/**
 * @param elapsedMs Milliseconds elapsed since the light-up animation started. A negative
 *   value (before it fires) returns the steady-lit state.
 *   To loop, pass `elapsedMs % NEON_FLICKER_CYCLE_MS` at the call site.
 *   To play once and hold the lit state, pass
 *   `Math.min(elapsedMs, NEON_FLICKER_CYCLE_MS)`.
 */
export function neonFlickerAt(elapsedMs: number): NeonFlickerState {
  if (elapsedMs < 0) {
    return { opacity: 1, brightness: 1 };
  }
  const percent = (elapsedMs / NEON_FLICKER_CYCLE_MS) * 100;
  return {
    opacity: interpolate(percent, KEYFRAME_PERCENTS, KEYFRAME_OPACITIES, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    brightness: interpolate(percent, KEYFRAME_PERCENTS, KEYFRAME_BRIGHTNESS, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  };
}
