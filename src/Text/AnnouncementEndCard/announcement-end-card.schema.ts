import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const announcementEndCardSchema = z.object({
  titleText: z.string().default("SAMPLE TITLE"),
  catchphraseText: z.string().default("A sample one-line genre catchphrase"),
  releaseDateText: z.string().default("COMING 20XX"),
  /** Generic placeholder badge, not a real content-rating system's mark */
  ratingLabelText: z.string().default("A"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  titleFontSize: z.number().min(20).max(160).default(64),
  catchphraseFontSize: z.number().min(12).max(80).default(24),
  releaseDateFontSize: z.number().min(10).max(60).default(22),

  textColor: zColor().default("#eef1fc"),
  subTextColor: zColor().default("#9098b8"),
  ratingBadgeColor: zColor().default("#242a42"),
  ratingTextColor: zColor().default("#eef1fc"),
  backgroundColor: zColor().default("#05060a"),

  fadeInFrames: z.number().min(0).default(16),
  delayFrames: z.number().min(0).default(0),
});

export type AnnouncementEndCardSchemaType = z.infer<
  typeof announcementEndCardSchema
>;

export const announcementEndCardDurationFrames = 150;

export const defaultAnnouncementEndCardProps = {
  titleText: "SAMPLE TITLE",
  catchphraseText: "A sample one-line genre catchphrase",
  releaseDateText: "COMING 20XX",
  ratingLabelText: "A",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  titleFontSize: 64,
  catchphraseFontSize: 24,
  releaseDateFontSize: 22,

  textColor: "#eef1fc",
  subTextColor: "#9098b8",
  ratingBadgeColor: "#242a42",
  ratingTextColor: "#eef1fc",
  backgroundColor: "#05060a",

  fadeInFrames: 16,
  delayFrames: 0,
} as const;

export const announcementEndCardPatterns = {
  /** Title, catchphrase, release date, rating badge (English default) */
  releaseCard: {
    ...defaultAnnouncementEndCardProps,
    titleText: "SAMPLE TITLE",
    catchphraseText: "A sample one-line genre catchphrase",
  },

  /** Same layout, Japanese sample copy */
  releaseCardJp: {
    ...defaultAnnouncementEndCardProps,
    titleText: "サンプルタイトル",
    catchphraseText: "ここに一言ジャンルコピーが入ります",
    releaseDateText: "20XX年発売",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
  },
};
