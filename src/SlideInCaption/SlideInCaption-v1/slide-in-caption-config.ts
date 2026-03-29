import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

/** コンポジション尺（余裕を持ったホールド含む） */
export const slideInCaptionV1DurationFrames = 200;

export const defaultSlideInCaptionV1Props = {
  text: "",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.02em",
  lineHeight: 1.35,

  textColor: "#ffffff",
  backgroundColor: "#000000",

  accentGlowColor: "#22d3ee",
  sweepWidthPercent: 26,
  sweepBlurPx: 18,
  sweepOpacity: 0.92,
  sweepAngleDeg: -22,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  delayFrames: 6,
  slideInDurationFrames: 48,
};

export const slideInCaptionV1Patterns = {
  /** 添付リファレンス：白テキスト · 黒背景 */
  refWhite: {
    ...defaultSlideInCaptionV1Props,
    text: "2025/06/19 Electronics with Arduino UNO",
    fontSize: 48,
    fontWeight: "700" as const,
  },

  /** refWhite と同系統・日本語キャプション向けに字間を広めに */
  refWhiteJp: {
    ...defaultSlideInCaptionV1Props,
    text: "2025/06/19 サンプル · スライドインキャプション",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    fontWeight: "700" as const,
    letterSpacing: "0.08em",
    lineHeight: 1.38,
  },
};
