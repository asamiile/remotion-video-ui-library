/** Default minimum output length. Explicit short variants bypass this rule. */
export const MINIMUM_COMPOSITION_SECONDS = 10;

export const minimumCompositionFrames = (frames: number, fps: number): number =>
  Math.max(frames, Math.ceil(MINIMUM_COMPOSITION_SECONDS * fps));
