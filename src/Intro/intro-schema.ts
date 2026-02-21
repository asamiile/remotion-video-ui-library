import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const introSchema = z.object({
  // 背景設定
  backgroundColor: zColor().default("#6B685C"),
  
  // テキスト設定
  textColor: zColor().default("#DFE2D7"),
  titleFontSize: z.number().min(20).max(100).default(72),
  titleFontWeight: z.enum(["400", "700"]).default("700"),
  titleLineHeight: z.number().min(0.5).max(3).default(1.6),
  descriptionFontSize: z.number().min(20).max(100).default(48),
  descriptionFontWeight: z.enum(["400", "700"]).default("400"),
  descriptionLineHeight: z.number().min(0.5).max(3).default(1.6),
  bottomRightFontSize: z.number().min(16).max(50).default(36),
  bottomRightBottom: z.number().min(0).max(500).default(40),
  bottomRightRight: z.number().min(0).max(500).default(40),
  
  // フォント設定
  fontFamily: z.string().default("'Line Seed JP_100'"),
  
  // アニメーション設定
  fadeInDuration: z.number().min(1).default(30), // フレーム数
  fadeOutDuration: z.number().min(1).default(30), // フレーム数
});

export type IntroSchemaType = z.infer<typeof introSchema>;
