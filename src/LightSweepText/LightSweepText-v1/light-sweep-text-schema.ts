import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const lightSweepTextSchemaV1 = z.object({
  text: z.string().default("COMPLETE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(24).max(160).default(48),
  letterSpacing: z.string().default("0.14em"),
  lineHeight: z.number().min(1).max(2).default(1.2),

  baseTextColor: zColor().default("#5ba3e8"),
  /** スイープ通過後・完了パルス時に寄せる色 */
  activeTextColor: zColor().default("#d8ecff"),

  /** delay 後の相対フレームでスイープ開始 */
  sweepStartFrame: z.number().min(0).default(42),
  sweepDurationFrames: z.number().min(6).default(14),
  sweepEasing: z.enum(["linear", "easeOut", "easeInOut"]).default("easeOut"),

  /** ぼけ光の塊の幅（親テキスト幅に対する %） */
  sweepBandWidthPercent: z.number().min(12).max(88).default(44),
  /**
   * 光帯の傾き（deg）。負で左肩上がり（横移動と組み合わせて斜めスイープに見える）。
   * 0 で従来どおり垂直な帯のみ。
   */
  sweepBandTiltDeg: z.number().min(-55).max(55).default(-20),

  /** 横切る光のぼかし（px）。大きいほど線が見えにくく拡散 */
  softGlowBlur: z.number().min(8).max(56).default(32),
  softGlowOpacity: z.number().min(0).max(1).default(0.52),

  /** スイープ終了後のテキスト発光パルス（フレーム） */
  completionGlowFrames: z.number().min(0).default(16),
  completionGlowStrength: z.number().min(0).max(2.2).default(1.15),

  fadeInDuration: z.number().min(0).default(14),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#05080f"),
  vignetteOpacity: z.number().min(0).max(0.9).default(0.55),
});

export type LightSweepTextSchemaV1Type = z.infer<typeof lightSweepTextSchemaV1>;
