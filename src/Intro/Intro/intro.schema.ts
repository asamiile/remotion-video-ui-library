import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const introSchema = z.object({
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

export type IntroSchemaType = z.infer<typeof introSchema>;

export interface IntroScene {
  id: string;
  centerText?: string;
  centerFontSize?: number;
  centerFontWeight?: "400" | "700";
  centerLineHeight?: number;
  bottomRightText?: string;
  bottomRightFontSize?: number;
  bottomRightBottom?: number;
  bottomRightRight?: number;
  fadeOutStartSeconds?: number;
  duration: number;
}

import { msToFrame } from "../../helpers/ms-to-frame";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export const introSceneTimingV1 = [
  {
    id: "scene1",
    centerFontWeight: "700" as const,
    fadeOutStartSeconds: 6,
    duration: 300,
  },
  {
    id: "scene2",
    fadeOutStartSeconds: 10,
    duration: 420,
  },
] as const;

export const defaultIntroProps = {
  authorName: "著者名プレビュー",
  introTitle: "イントロタイトル（プレビュー）",
  introDescription: "説明文のプレビューです。\n改行を含められます。",
  backgroundColor: "#6B685C",
  textColor: "#DFE2D7",
  fontFamily: LINESEED_FONT,
  titleFontSize: 76,
  titleFontWeight: "700" as const,
  titleLineHeight: 1.6,
  descriptionFontSize: 52,
  descriptionFontWeight: "400" as const,
  descriptionLineHeight: 1.8,
  bottomRightFontSize: 48,
  bottomRightBottom: 72,
  bottomRightRight: 100,
  fadeInDuration: msToFrame(4000),
  fadeOutDuration: msToFrame(2000),
} as const;
