import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const slideInCaptionSchemaV1 = z.object({
  text: z.string().default(""),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(12).max(120).default(48),
  letterSpacing: z.string().default("0.02em"),
  lineHeight: z.number().min(1).max(2).default(1.35),

  textColor: zColor().default("#ffffff"),
  backgroundColor: zColor().default("#000000"),

  /** 走査光の中心色（シアン系） */
  accentGlowColor: zColor().default("#22d3ee"),
  /** 走査光バンドの幅（テキスト行幅に対する %） */
  sweepWidthPercent: z.number().min(8).max(90).default(26),
  /** 発光のぼかし（px） */
  sweepBlurPx: z.number().min(0).max(48).default(18),
  /** 走査光レイヤの不透明度 */
  sweepOpacity: z.number().min(0).max(1).default(0.92),
  /**
   * 走査光バンドの傾き（deg）。負の値で左上→右下方向に傾くイメージ。
   */
  sweepAngleDeg: z.number().min(-45).max(45).default(-22),

  /** 左端からの余白（%） */
  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  /** 下端からの余白（%） */
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  delayFrames: z.number().min(0).default(6),
  /** 走査が左端→右端に届くまでのフレーム（小さいほど高速） */
  slideInDurationFrames: z.number().min(8).default(52),
});

export type SlideInCaptionSchemaV1Type = z.infer<typeof slideInCaptionSchemaV1>;
