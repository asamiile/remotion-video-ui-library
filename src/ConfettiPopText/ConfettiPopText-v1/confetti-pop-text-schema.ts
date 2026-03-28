import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const confettiPopTextSchemaV1 = z.object({
  text: z.string().default("おめでとう！"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(28).max(120).default(58),
  letterSpacing: z.string().default("0.08em"),
  lineHeight: z.number().min(1).max(2).default(1.2),

  textColor: zColor().default("#fff8f0"),

  /** delay 後、このフレームでクラッカー（フラッシュ＋弾け） */
  burstFrame: z.number().min(0).default(22),
  /** フラッシュの最大不透明度（白オーバーレイ） */
  flashPeakOpacity: z.number().min(0).max(1).default(0.48),
  /** フラッシュがほぼ消えるまでのフレーム数 */
  flashDurationFrames: z.number().min(1).default(6),

  /** 弾け後のテキスト光（text-shadow）が強い時間 */
  glowDurationFrames: z.number().min(0).default(26),

  /** 紙吹雪の数。0 で粒子のみオフ（フラッシュ・スプリング・グローはそのまま） */
  particleCount: z.number().min(0).max(88).default(42),
  /** true で中心から円が広がる */
  showShockwaveRing: z.boolean().default(true),

  particleLifeFrames: z.number().min(24).default(100),
  particleSpread: z.number().min(4).max(40).default(12),
  particleGravity: z.number().min(0).max(2).default(0.42),

  randomSeed: z.string().default("confetti-pop-rich"),

  fadeInDuration: z.number().min(0).default(8),
  delayFrames: z.number().min(0).default(0),

  positionX: z.number().min(0).max(100).default(50),
  positionY: z.number().min(0).max(100).default(50),

  backgroundColor: zColor().default("#1a1428"),
});

export type ConfettiPopTextSchemaV1Type = z.infer<typeof confettiPopTextSchemaV1>;
