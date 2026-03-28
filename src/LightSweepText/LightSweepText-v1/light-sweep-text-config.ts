import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const lightSweepTextV1DurationFrames = 210;

const defaultLightSweepTextV1Props = {
  text: "COMPLETE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.14em",
  lineHeight: 1.2,

  baseTextColor: "#5ba3e8",
  activeTextColor: "#d8ecff",

  sweepStartFrame: 42,
  sweepDurationFrames: 14,
  sweepEasing: "easeOut" as const,

  sweepBandWidthPercent: 44,
  softGlowBlur: 32,
  softGlowOpacity: 0.52,

  completionGlowFrames: 16,
  completionGlowStrength: 1.15,

  fadeInDuration: 14,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#05080f",
  vignetteOpacity: 0.55,
};

export const lightSweepTextV1Patterns = {
  /** 処理完了・疾走スイープ */
  complete: {
    ...defaultLightSweepTextV1Props,
    text: "COMPLETE",
    sweepStartFrame: 48,
    sweepDurationFrames: 12,
    sweepBandWidthPercent: 40,
    softGlowBlur: 30,
    softGlowOpacity: 0.5,
  },

  /** 日本語・余韻少し長め */
  doneJp: {
    ...defaultLightSweepTextV1Props,
    text: "処理完了",
    fontSize: 48,
    letterSpacing: "0.18em",
    sweepStartFrame: 54,
    sweepDurationFrames: 16,
    completionGlowFrames: 20,
    sweepBandWidthPercent: 46,
    softGlowBlur: 34,
  },

  /** 速いスイープ（キレ寄り） */
  rapid: {
    ...defaultLightSweepTextV1Props,
    text: "OK",
    fontSize: 48,
    sweepStartFrame: 36,
    sweepDurationFrames: 9,
    sweepEasing: "linear" as const,
    sweepBandWidthPercent: 36,
    softGlowBlur: 26,
    softGlowOpacity: 0.48,
  },
};
