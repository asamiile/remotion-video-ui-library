import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const rainbowNeonTextSchemaV1 = z.object({
  text: z.string().default("NEON"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(20).max(200).default(48),
  letterSpacing: z.string().default("0.08em"),
  lineHeight: z.number().min(1).max(2).default(1.15),

  /** 虹グラデが色相一周するまでのフレーム数（小さいほど速い循環） */
  hueCycleFrames: z.number().min(18).default(120),

  /**
   * true: グラデが「青・緑」から「黄・赤系」へ徐々に移行する。
   * false: 常にフルスペクトル寄りのストップ色のみ。
   */
  colorShiftEnabled: z.boolean().default(true),
  /** 移行が始まるフレーム（delay 後の相対フレーム） */
  colorShiftStartFrame: z.number().min(0).default(72),
  /** 青緑→黄赤へ補間する長さ（フレーム）。0 なら開始フレームで一気に切り替え */
  colorShiftDurationFrames: z.number().min(0).default(96),

  /** メインのネオン管ストローク幅 */
  strokeWidth: z.number().min(0.5).max(24).default(5),
  /** チューブの「芯」ハイライト。0 で描画しない */
  innerStrokeWidth: z.number().min(0).max(10).default(2),
  innerStrokeColor: zColor().default("rgba(255, 252, 240, 0.92)"),

  /** メイン縁に乗せる発光ぼかし（0 でフィルタなし） */
  mainGlowBlur: z.number().min(0).max(24).default(3),
  /** 背後ハロー用にメインより太くする追加幅 */
  haloExtraWidth: z.number().min(0).max(48).default(8),
  /** ハローのぼかし（0 でハロー層を出さない） */
  haloGlowBlur: z.number().min(0).max(48).default(16),
  haloOpacity: z.number().min(0).max(1).default(0.45),

  fadeInDuration: z.number().min(0).default(15),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#06060a"),
  vignetteOpacity: z.number().min(0).max(0.92).default(0.52),
});

export type RainbowNeonTextSchemaV1Type = z.infer<typeof rainbowNeonTextSchemaV1>;
