import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const DISTRESSED_TITLE_CARD_VARIANTS = [
  "darkTitle",
  "agedPaperChapter",
] as const;

export const distressedTitleCardSchema = z.object({
  /** darkTitle: black bg, white distressed opening title. agedPaperChapter: cream paper bg, chapter number + title */
  variant: z.enum(DISTRESSED_TITLE_CARD_VARIANTS).default("darkTitle"),

  titleText: z.string().default("25TH ANNIVERSARY"),
  /** Only shown in agedPaperChapter (e.g. a chapter number) */
  numberText: z.string().default("01"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  numberFontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontSize: z.number().min(16).max(200).default(72),
  numberFontSize: z.number().min(16).max(300).default(140),
  letterSpacing: z.string().default("0.06em"),

  darkBackgroundColor: zColor().default("#060810"),
  darkTextColor: zColor().default("#eef1fc"),

  paperBackgroundColor: zColor().default("#e9dcc3"),
  paperTextColor: zColor().default("#231f1a"),
  numberGradientFrom: zColor().default("#ff8a3d"),
  numberGradientTo: zColor().default("#d7263d"),

  /** Roughens the text edges via an SVG turbulence displacement filter (0 = clean edges) */
  distressAmount: z.number().min(0).max(30).default(6),

  fadeInFrames: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),
});

export type DistressedTitleCardSchemaType = z.infer<
  typeof distressedTitleCardSchema
>;

export const distressedTitleCardDurationFrames = 180;

export const defaultDistressedTitleCardProps = {
  variant: "darkTitle" as const,
  titleText: "25TH ANNIVERSARY",
  numberText: "01",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  numberFontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 72,
  numberFontSize: 140,
  letterSpacing: "0.06em",

  darkBackgroundColor: "#060810",
  darkTextColor: "#eef1fc",

  paperBackgroundColor: "#e9dcc3",
  paperTextColor: "#231f1a",
  numberGradientFrom: "#ff8a3d",
  numberGradientTo: "#d7263d",

  distressAmount: 6,

  fadeInFrames: 12,
  delayFrames: 0,
};
export const distressedTitleCardPatterns = {
  /** Opening title: black bg, distressed white title (English default) */
  darkTitle: {
    ...defaultDistressedTitleCardProps,
    variant: "darkTitle" as const,
    titleText: "25TH ANNIVERSARY",
  },

  /** Opening title (Japanese sample) */
  darkTitleJp: {
    ...defaultDistressedTitleCardProps,
    variant: "darkTitle" as const,
    titleText: "25周年記念",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
  },

  /** Chapter card: aged paper bg + gradient chapter number (English sample) */
  agedPaperChapter: {
    ...defaultDistressedTitleCardProps,
    variant: "agedPaperChapter" as const,
    titleText: "THE BEGINNING",
    numberText: "01",
  },

  /** Chapter card (Japanese sample) */
  agedPaperChapterJp: {
    ...defaultDistressedTitleCardProps,
    variant: "agedPaperChapter" as const,
    titleText: "はじまりの章",
    numberText: "01",
  },
};
