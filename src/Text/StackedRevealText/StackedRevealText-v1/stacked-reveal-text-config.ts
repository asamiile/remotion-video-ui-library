import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

/**
 * A shared duration sized for 3-4 lines * holdFramesPerLine plus a trailing
 * hold. This reproduces the "stack lines one by one, hard-cut to the next"
 * technique identified in the Hunter x Hunter volume 37/38 PV technique
 * analysis (video_analysis/).
 */
export const stackedRevealTextV1DurationFrames = 210;

export const defaultStackedRevealTextV1Props = {
  lines: ["MEASURING", "THE GAP", "BETWEEN IDEA AND SHIP"],
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 64,
  letterSpacing: "0.04em",
  lineHeight: 1.15,

  textColor: "#eef1fc",
  backgroundColor: "#060810",

  orientation: "horizontal" as const,
  lineGapPx: 28,

  holdFramesPerLine: 15,
  lineFadeInFrames: 4,

  haloEnabled: false,
  haloColor: "#ff3d9e",
  haloBlurPx: 18,

  delayFrames: 0,
};

export const stackedRevealTextV1Patterns = {
  /** Filled text (normal), horizontal, short fade close to a hard cut (English default) */
  stacked: {
    ...defaultStackedRevealTextV1Props,
    lines: ["MEASURING", "THE GAP", "BETWEEN IDEA AND SHIP"],
    orientation: "horizontal" as const,
  },

  /** Vertical writing mode, stacked reveal (Japanese sample). Newer lines stack toward the left */
  stackedJp: {
    ...defaultStackedRevealTextV1Props,
    lines: ["サンプルの", "見出し行が", "積み上がる例"],
    orientation: "vertical" as const,
    letterSpacing: "0.12em",
  },

  /** Climax effect (Japanese sample): wraps the text in a glow (halo) */
  climaxHaloJp: {
    ...defaultStackedRevealTextV1Props,
    lines: ["ここが山場", "という例（サンプル）"],
    orientation: "vertical" as const,
    letterSpacing: "0.12em",
    haloEnabled: true,
    haloColor: "#ff3d9e",
    haloBlurPx: 22,
  },
};
