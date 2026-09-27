import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Timing for a transition animation centered in its composition (the base
 * version fits it exactly; the padded "-5s" version pads both sides).
 *
 * `animationTime` counts from the animation start, not frame 0, so both
 * versions feed shaders identical values — use it instead of uTime.
 */
export const useCenteredTransition = (animationFrames: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const start = Math.floor((durationInFrames - animationFrames) / 2);
  const animationFrame = frame - start;
  const clampedFrame = Math.min(
    Math.max(animationFrame, 0),
    animationFrames - 1,
  );
  const progress = clampedFrame / (animationFrames - 1);

  return {
    /** Inside the animation window */
    active: animationFrame >= 0 && animationFrame < animationFrames,
    /** Before the window: 0, after: 1 */
    progress,
    /** 0 → 1 at the midpoint (the cut) → 0 */
    peak: 1 - Math.abs(progress * 2 - 1),
    animationTime: clampedFrame / fps,
  };
};
