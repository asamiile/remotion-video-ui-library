export const defaultDuotoneGradeOverlayV1Props = {
  channelAColor: "#ff3d9e",
  channelBColor: "#37e9ff",
  channelShiftPx: 3,
  channelOpacity: 0.35,

  washColor: "#242a42",
  washOpacity: 0.18,

  trackingNoiseEnabled: false,
  trackingNoiseOpacity: 0.5,
  trackingBandHeightPx: 10,
};

/**
 * Grading overlay that reproduces the "duotone processing with magenta/green
 * chromatic aberration applied throughout the video" technique from the
 * HUNTER×HUNTER volume 38 PV analysis (video_analysis/). Always transparent
 * background, meant to be composited over other footage. Offsetting the two
 * `channelA/B` layers with mix-blend-mode: screen reproduces the aberration
 * fringing, `washColor` reproduces the overall tone, and `trackingNoiseEnabled`
 * reproduces the top/bottom noise bands.
 */
export const duotoneGradeOverlayV1Patterns = {
  /** Magenta/green pairing close to the analyzed PV */
  magentaGreen: {
    ...defaultDuotoneGradeOverlayV1Props,
    channelAColor: "#ff3d9e",
    channelBColor: "#37e9ff",
    trackingNoiseEnabled: true,
  },

  /** Example swapped to OneTake's brand colors (cyan/violet) */
  cyanViolet: {
    ...defaultDuotoneGradeOverlayV1Props,
    channelAColor: "#37e9ff",
    channelBColor: "#9c7bff",
    washColor: "#060810",
    trackingNoiseEnabled: false,
  },
};
