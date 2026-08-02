import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const chapterTitleCardSchema = z.object({
  numberText: z.string().default("No.001"),
  headingText: z.string().default("SAMPLE TOPIC"),
  subtitleText: z.string().default("A short one-line description goes here."),

  bandColor: zColor().default("#8fd9c4"),
  headingColor: zColor().default("#0a0e12"),
  numberColor: zColor().default("#0a0e12"),
  subtitleColor: zColor().default("#eef1fc"),
  backgroundColor: zColor().default("#bdbdbd"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  numberFontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(16).max(160).default(56),
  numberFontSize: z.number().min(16).max(220).default(96),
  subtitleFontSize: z.number().min(12).max(80).default(26),

  bandHeightPercent: z.number().min(10).max(60).default(28),

  popInFrames: z.number().min(0).default(10),
  delayFrames: z.number().min(0).default(0),
});

export type ChapterTitleCardSchemaType = z.infer<
  typeof chapterTitleCardSchema
>;

export const chapterTitleCardDurationFrames = 150;

export const defaultChapterTitleCardProps = {
  numberText: "No.001",
  headingText: "SAMPLE TOPIC",
  subtitleText: "A short one-line description goes here.",

  bandColor: "#8fd9c4",
  headingColor: "#0a0e12",
  numberColor: "#0a0e12",
  subtitleColor: "#eef1fc",
  backgroundColor: "#bdbdbd",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  numberFontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 56,
  numberFontSize: 96,
  subtitleFontSize: 26,

  bandHeightPercent: 28,

  popInFrames: 10,
  delayFrames: 0,
} as const;

export const chapterTitleCardPatterns = {
  /** Mint band, large chapter number, caption line (English default) */
  mintBand: {
    ...defaultChapterTitleCardProps,
    numberText: "No.001",
    headingText: "SAMPLE TOPIC",
    subtitleText: "A short one-line description goes here.",
  },

  /** Same layout, Japanese sample copy */
  mintBandJp: {
    ...defaultChapterTitleCardProps,
    numberText: "No.001",
    headingText: "サンプルトピック",
    subtitleText: "ここに一行程度の説明文が入ります。",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    numberFontFamily: SPACE_GROTESK_FONT_FAMILY,
  },
};
