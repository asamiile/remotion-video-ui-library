import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

const presentsCreditLineSchema = z.object({
  text: z.string(),
  fontSize: z.number().min(12).max(160),
});

export const cinematicPresentsCreditSchema = z.object({
  /** Shown one at a time, in order, movie-opening-credit style */
  lines: z.array(presentsCreditLineSchema).min(1).max(5).default([
    { text: "SAMPLE STUDIO PRESENTS", fontSize: 32 },
    { text: "A SAMPLE STUDIO PRODUCTION", fontSize: 32 },
    { text: "SAMPLE TITLE", fontSize: 64 },
  ]),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  letterSpacing: z.string().default("0.16em"),
  textColor: zColor().default("#eef1fc"),
  backgroundColor: zColor().default("#05060a"),

  /** How long each line is fully visible (excludes its own fade in/out) */
  perLineHoldFrames: z.number().min(1).default(40),
  fadeFrames: z.number().min(0).default(14),

  delayFrames: z.number().min(0).default(0),
});

export type CinematicPresentsCreditSchemaType = z.infer<
  typeof cinematicPresentsCreditSchema
>;

export const defaultCinematicPresentsCreditProps = {
  lines: [
    { text: "SAMPLE STUDIO PRESENTS", fontSize: 32 },
    { text: "A SAMPLE STUDIO PRODUCTION", fontSize: 32 },
    { text: "SAMPLE TITLE", fontSize: 64 },
  ],

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  letterSpacing: "0.16em",
  textColor: "#eef1fc",
  backgroundColor: "#05060a",

  perLineHoldFrames: 40,
  fadeFrames: 14,

  delayFrames: 0,
} as const;

export const cinematicPresentsCreditPatterns = {
  /** Three-card movie-style opening credit sequence (English default) */
  threeCard: {
    ...defaultCinematicPresentsCreditProps,
    lines: [
      { text: "SAMPLE STUDIO PRESENTS", fontSize: 32 },
      { text: "A SAMPLE STUDIO PRODUCTION", fontSize: 32 },
      { text: "SAMPLE TITLE", fontSize: 64 },
    ],
  },

  /** Same sequence, Japanese sample copy */
  threeCardJp: {
    ...defaultCinematicPresentsCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.1em",
    lines: [
      { text: "サンプルスタジオ提供", fontSize: 32 },
      { text: "サンプルスタジオ制作", fontSize: 32 },
      { text: "サンプルタイトル", fontSize: 64 },
    ],
  },
};
