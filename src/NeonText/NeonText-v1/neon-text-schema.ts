import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const neonTextSchemaV1 = z.object({
  text: z.string().default("SAMPLE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(24).max(220).default(48),
  letterSpacing: z.string().default("0.12em"),
  /** LightSweep / Shake 等と揃えた行高（bottom 基準時の見え位置に効く） */
  lineHeight: z.number().min(1).max(2).default(1.2),

  coreColor: zColor().default("#fff8f4"),
  glowColor: zColor().default("#ff2fd0"),
  haloColor: zColor().default("#9d4dff"),

  /**
   * gradient: 横方向 linear-gradient の塗り（添付のようなネオチューブ風）。
   * solid のときは coreColor を使用。
   */
  neonFillMode: z.enum(["solid", "gradient"]).default("solid"),
  /** gradient 時のストップ（左→右）。2〜8 色。未指定や不足時は solid にフォールバック */
  neonGradientStops: z.array(zColor()).min(2).max(8).optional(),

  tubeStrokeColor: zColor().default("rgba(20, 0, 40, 0.45)"),
  tubeStrokeWidth: z.number().min(0).max(6).default(1),

  shadowStrength: z.number().min(0.4).max(1.8).default(1),

  animationMode: z
    .enum(["static", "pulse", "flicker", "breathe", "blink"])
    .default("pulse"),
  pulsePeriodFrames: z.number().min(20).default(90),
  breathePeriodFrames: z.number().min(40).default(140),

  /** Lチカ（矩形波）: 1 周期のフレーム数（点灯＋消灯） */
  blinkPeriodFrames: z.number().min(10).default(60),
  /** 点灯時間の割合（0.5 = 50% デューティ） */
  blinkDutyRatio: z.number().min(0.1).max(0.9).default(0.5),
  /** 消灯時の文字・全体 opacity（0 に近いほどハード点滅） */
  blinkDimOpacity: z.number().min(0).max(1).default(0.06),
  /** 消灯時の発光（text-shadow）強度の倍率 */
  blinkGlowOffMul: z.number().min(0).max(1).default(0.12),

  flickerStrength: z.number().min(0).max(0.45).default(0.12),
  randomSeed: z.string().default("neon-v1"),

  fadeInDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#070712"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.55),
});

export type NeonTextSchemaV1Type = z.infer<typeof neonTextSchemaV1>;
