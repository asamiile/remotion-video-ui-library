import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";

export const shakeTextSchemaV1 = z.object({
  text: z.string().default("試行錯誤中…"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(20).max(120).default(48),
  letterSpacing: z.string().default("0.06em"),
  lineHeight: z.number().min(1).max(2).default(1.25),

  textColor: zColor().default("#e8f0f8"),

  /** Max jitter per frame (px, range is ± this value) */
  jitterMaxPx: z.number().min(0).max(24).default(5),
  /** Max rotation angle (deg, ±) */
  rotationMaxDeg: z.number().min(0).max(4).default(0.85),

  /** Burst intensity is re-rolled every this many frames */
  burstSegmentFrames: z.number().min(1).default(3),
  /** Probability of a burst segment (0-1) */
  burstProbability: z.number().min(0).max(1).default(0.42),
  /** Shake multiplier during a burst */
  burstIntensityMul: z.number().min(1).max(3).default(1.75),

  randomSeed: z.string().default("shake-v1"),

  /** Frames over which the shake decays to 0 near the end. 0 disables decay */
  settleDurationFrames: z.number().min(0).default(45),

  fadeInDuration: z.number().min(0).default(18),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#0c1016"),
});

export type ShakeTextSchemaV1Type = z.infer<typeof shakeTextSchemaV1>;

export const shakeTextV1DurationFrames = 180;

export const defaultShakeTextV1Props = {
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
} as const;

const shakeTextSharedV1 = {
  ...defaultShakeTextV1Props,
};

const enTypography = {
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
};

const jpTypography = {
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
};

export const shakeTextV1Patterns = {
  // --- Standard (trial-and-error style) ---
  /** English font (JetBrains Mono) - Composition: ShakeTextV1-Trial */
  trial: {
    ...shakeTextSharedV1,
    ...enTypography,
    text: "Trial and error…",
    letterSpacing: "0.05em",
    randomSeed: "shake-v1-trial-en",
    settleDurationFrames: 50,
  },
  /** Japanese font (LINE Seed) - Composition: ShakeTextV1-TrialJp */
  trialJp: {
    ...shakeTextSharedV1,
    ...jpTypography,
    text: "試行錯誤中…",
    randomSeed: "shake-v1-trial-jp",
    settleDurationFrames: 50,
  },

  // --- Subtle jitter ---
  /** English font - Composition: ShakeTextV1-Subtle */
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
  /** Japanese font - Composition: ShakeTextV1-SubtleJp */
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

  // --- Intense ---
  /** English */
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
  /** Japanese */
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
