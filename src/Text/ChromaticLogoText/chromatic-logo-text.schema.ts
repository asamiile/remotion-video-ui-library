import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const chromaticLogoTextSchema = z.object({
  text: z.string().default("SAMPLE MARK"),
  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(200).default(64),
  letterSpacing: z.string().default("0.08em"),

  textColor: zColor().default("#f4f6ff"),
  channelAColor: zColor().default("rgba(255, 61, 158, 0.65)"),
  channelBColor: zColor().default("rgba(55, 233, 255, 0.65)"),

  /** Static (non-glitching) chroma-shift offset in px, applied to left/right channels */
  offsetPx: z.number().min(0).max(12).default(2),
  /** Very slow breathing oscillation layered on top of the static offset (0 = perfectly still) */
  pulseAmplitudePx: z.number().min(0).max(6).default(0.6),
  pulseSpeed: z.number().min(1).max(120).default(48),

  backgroundColor: zColor().default("#05060a"),
  fadeInFrames: z.number().min(0).default(18),
  delayFrames: z.number().min(0).default(0),
});

export type ChromaticLogoTextSchemaType = z.infer<
  typeof chromaticLogoTextSchema
>;

export const chromaticLogoTextDurationFrames = 150;

export const defaultChromaticLogoTextProps = {
  text: "SAMPLE MARK",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 64,
  letterSpacing: "0.08em",

  textColor: "#f4f6ff",
  channelAColor: "rgba(255, 61, 158, 0.65)",
  channelBColor: "rgba(55, 233, 255, 0.65)",

  offsetPx: 2,
  pulseAmplitudePx: 0.6,
  pulseSpeed: 48,

  backgroundColor: "#05060a",
  fadeInFrames: 18,
  delayFrames: 0,
} as const;

export const chromaticLogoTextPatterns = {
  /** Subtle static chroma-shift for a logo/title card (English default) */
  studioMark: {
    ...defaultChromaticLogoTextProps,
    text: "SAMPLE MARK",
  },

  /** Same look, Japanese sample copy */
  studioMarkJp: {
    ...defaultChromaticLogoTextProps,
    text: "サンプルマーク",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.12em",
  },
};
