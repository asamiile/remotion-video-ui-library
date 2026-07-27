import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const introSchemaV1 = z.object({
  // Scene copy (sample values); overridden via config/local/composition-text.local.json
  authorName: z.string().default("著者名プレビュー"),
  introTitle: z.string().default("イントロタイトル（プレビュー）"),
  introDescription: z
    .string()
    .default("説明文のプレビューです。\n改行を含められます。"),

  backgroundColor: zColor().default("#6B685C"),

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

  fontFamily: z.string().default("'Line Seed JP_100'"),

  fadeInDuration: z.number().min(1).default(30), // frames
  fadeOutDuration: z.number().min(1).default(30), // frames
});

export type IntroSchemaV1Type = z.infer<typeof introSchemaV1>;
