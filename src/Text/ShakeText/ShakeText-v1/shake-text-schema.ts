import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

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
