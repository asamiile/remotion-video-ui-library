import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const shakeTextV1DurationFrames = 300;

/** 言語に依存しないパラメータ */
const shakeTextSharedV1 = {
  fontWeight: "700" as const,
  fontSize: 48,

  textColor: "#fff8f0",

  jitterMaxPx: 5,
  rotationMaxDeg: 0.85,

  burstSegmentFrames: 3,
  burstProbability: 0.42,
  burstIntensityMul: 1.75,

  fadeInDuration: 18,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#0c1016",
};

const jpTypography = {
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  letterSpacing: "0.06em",
  lineHeight: 1.25,
};

const enTypography = {
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  letterSpacing: "0.06em",
  lineHeight: 1.25,
};

export const shakeTextV1Patterns = {
  // --- 標準（試行錯誤系）---
  /** 英語フォント（JetBrains Mono）— Composition: ShakeTextV1-Trial */
  trial: {
    ...shakeTextSharedV1,
    ...enTypography,
    text: "Trial and error…",
    letterSpacing: "0.05em",
    randomSeed: "shake-v1-trial-en",
    settleDurationFrames: 50,
  },
  /** 日本語フォント（LINE Seed）— Composition: ShakeTextV1-TrialJp */
  trialJp: {
    ...shakeTextSharedV1,
    ...jpTypography,
    text: "試行錯誤中…",
    randomSeed: "shake-v1-trial-jp",
    settleDurationFrames: 50,
  },

  // --- 控えめなジッター ---
  /** 英語フォント — Composition: ShakeTextV1-Subtle */
  subtle: {
    ...shakeTextSharedV1,
    ...enTypography,
    text: "Fine-tuning…",
    letterSpacing: "0.05em",
    jitterMaxPx: 2.5,
    rotationMaxDeg: 0.4,
    burstProbability: 0.28,
    burstIntensityMul: 1.45,
    settleDurationFrames: 36,
    randomSeed: "shake-v1-subtle-en",
  },
  /** 日本語フォント — Composition: ShakeTextV1-SubtleJp */
  subtleJp: {
    ...shakeTextSharedV1,
    ...jpTypography,
    text: "調整しています",
    jitterMaxPx: 2.5,
    rotationMaxDeg: 0.4,
    burstProbability: 0.28,
    burstIntensityMul: 1.45,
    settleDurationFrames: 36,
    randomSeed: "shake-v1-subtle-jp",
  },

  // --- 強め ---
  /** 英語 */
  intense: {
    ...shakeTextSharedV1,
    ...enTypography,
    text: "RETRY · DEBUG",
    letterSpacing: "0.12em",
    jitterMaxPx: 7,
    rotationMaxDeg: 1.15,
    burstProbability: 0.52,
    burstIntensityMul: 2,
    settleDurationFrames: 40,
    randomSeed: "shake-v1-intense-en",
  },
  /** 日本語 */
  intenseJp: {
    ...shakeTextSharedV1,
    ...jpTypography,
    text: "再試行 · デバッグ",
    letterSpacing: "0.1em",
    lineHeight: 1.3,
    jitterMaxPx: 7,
    rotationMaxDeg: 1.15,
    burstProbability: 0.52,
    burstIntensityMul: 2,
    settleDurationFrames: 40,
    randomSeed: "shake-v1-intense-jp",
  },
};
