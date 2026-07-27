export const defaultLetterboxOverlayV1Props = {
  barColor: "#000000",
  barHeightPercent: 12,
  revealFrames: 0,
  delayFrames: 0,
};

export const letterboxOverlayV1Patterns = {
  /** Bars present from the first frame */
  static: {
    ...defaultLetterboxOverlayV1Props,
    revealFrames: 0,
  },

  /** Bars slide in from the top/bottom edges */
  revealIn: {
    ...defaultLetterboxOverlayV1Props,
    revealFrames: 15,
  },
};
