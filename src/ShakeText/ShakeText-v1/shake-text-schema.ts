import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const shakeTextSchemaV1 = z.object({
  text: z.string().default("試行錯誤中…"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(20).max(120).default(56),
  letterSpacing: z.string().default("0.06em"),
  lineHeight: z.number().min(1).max(2).default(1.25),

  textColor: zColor().default("#e8f0f8"),

  /** 1 フレームあたりの最大ジッター（px、±この値の範囲） */
  jitterMaxPx: z.number().min(0).max(24).default(5),
  /** 最大回転角（deg、±） */
  rotationMaxDeg: z.number().min(0).max(4).default(0.85),

  /** このフレーム単位でバースト強度を更新 */
  burstSegmentFrames: z.number().min(1).default(3),
  /** バースト区間の確率（0〜1） */
  burstProbability: z.number().min(0).max(1).default(0.42),
  /** バースト時の揺れ倍率 */
  burstIntensityMul: z.number().min(1).max(3).default(1.75),

  randomSeed: z.string().default("shake-v1"),

  /** 終盤で揺れを 0 へ減衰させるフレーム数。0 で減衰なし */
  settleDurationFrames: z.number().min(0).default(45),

  fadeInDuration: z.number().min(0).default(18),
  delayFrames: z.number().min(0).default(0),

  positionX: z.number().min(0).max(100).default(50),
  positionY: z.number().min(0).max(100).default(50),

  backgroundColor: zColor().default("#0c1016"),
});

export type ShakeTextSchemaV1Type = z.infer<typeof shakeTextSchemaV1>;
