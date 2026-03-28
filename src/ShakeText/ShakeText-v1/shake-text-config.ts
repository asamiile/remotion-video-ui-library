import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const shakeTextV1DurationFrames = 300;

const defaultShakeTextV1Props = {
  text: "試行錯誤中…",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.06em",
  lineHeight: 1.25,

  textColor: "#e8f0f8",

  jitterMaxPx: 5,
  rotationMaxDeg: 0.85,

  burstSegmentFrames: 3,
  burstProbability: 0.42,
  burstIntensityMul: 1.75,

  randomSeed: "shake-v1",

  settleDurationFrames: 45,

  fadeInDuration: 18,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#0c1016",
};

export const shakeTextV1Patterns = {
  /** 標準：試行錯誤 */
  trial: {
    ...defaultShakeTextV1Props,
    text: "試行錯誤中…",
    settleDurationFrames: 50,
  },

  /** 控えめなジッター */
  subtle: {
    ...defaultShakeTextV1Props,
    text: "調整しています",
    jitterMaxPx: 2.5,
    rotationMaxDeg: 0.4,
    burstProbability: 0.28,
    burstIntensityMul: 1.45,
    settleDurationFrames: 36,
  },

  /** 強め（英字） */
  intense: {
    ...defaultShakeTextV1Props,
    text: "RETRY · DEBUG",
    fontSize: 48,
    letterSpacing: "0.12em",
    jitterMaxPx: 7,
    rotationMaxDeg: 1.15,
    burstProbability: 0.52,
    burstIntensityMul: 2,
    settleDurationFrames: 40,
  },
};
