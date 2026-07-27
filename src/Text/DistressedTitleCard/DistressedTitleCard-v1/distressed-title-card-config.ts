import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../../helpers/space-grotesk";

export const distressedTitleCardV1DurationFrames = 90;

export const defaultDistressedTitleCardV1Props = {
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

export const distressedTitleCardV1Patterns = {
  /** Opening title: black bg, distressed white title (English default) */
  darkTitle: {
    ...defaultDistressedTitleCardV1Props,
    variant: "darkTitle" as const,
    titleText: "25TH ANNIVERSARY",
  },

  /** Opening title (Japanese sample) */
  darkTitleJp: {
    ...defaultDistressedTitleCardV1Props,
    variant: "darkTitle" as const,
    titleText: "25周年記念",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
  },

  /** Chapter card: aged paper bg + gradient chapter number (English sample) */
  agedPaperChapter: {
    ...defaultDistressedTitleCardV1Props,
    variant: "agedPaperChapter" as const,
    titleText: "THE BEGINNING",
    numberText: "01",
  },

  /** Chapter card (Japanese sample) */
  agedPaperChapterJp: {
    ...defaultDistressedTitleCardV1Props,
    variant: "agedPaperChapter" as const,
    titleText: "はじまりの章",
    numberText: "01",
  },
};
