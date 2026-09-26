import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const slideInCaptionSchema = z.object({
  text: z.string().default(""),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(12).max(120).default(48),
  letterSpacing: z.string().default("0.02em"),
  lineHeight: z.number().min(1).max(2).default(1.35),

  textColor: zColor().default("#ffffff"),
  backgroundColor: zColor().default("#000000"),

  /** Center color of the scanning light (cyan-ish) */
  accentGlowColor: zColor().default("#22d3ee"),
  /** Width of the scanning light band (% of the text line width) */
  sweepWidthPercent: z.number().min(8).max(90).default(26),
  /** Glow blur (px) */
  sweepBlurPx: z.number().min(0).max(48).default(18),
  /** Opacity of the scanning light layer */
  sweepOpacity: z.number().min(0).max(1).default(0.92),
  /**
   * Tilt of the scanning light band (deg). Negative values tilt it toward a
   * top-left to bottom-right direction.
   */
  sweepAngleDeg: z.number().min(-45).max(45).default(-22),

  /** Margin from the left edge (%) */
  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  /** Margin from the bottom edge (%) */
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  delayFrames: z.number().min(0).default(6),
  /** Frames for the scan to travel from the left edge to the right edge (smaller = faster) */
  slideInDurationFrames: z.number().min(8).default(52),
});

export type SlideInCaptionSchemaType = z.infer<typeof slideInCaptionSchema>;

export const slideInCaptionDurationFrames = 150;

export const defaultSlideInCaptionProps = {
  text: "",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.02em",
  lineHeight: 1.35,

  textColor: "#ffffff",
  backgroundColor: "#000000",

  accentGlowColor: "#22d3ee",
  sweepWidthPercent: 26,
  sweepBlurPx: 18,
  sweepOpacity: 0.92,
  sweepAngleDeg: -22,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  delayFrames: 6,
  slideInDurationFrames: 48,
};
export const slideInCaptionPatterns = {
  /** Reference look: white text on black background */
  refWhite: {
    ...defaultSlideInCaptionProps,
    text: "2025/06/19 Electronics with Arduino UNO",
    fontSize: 48,
    fontWeight: "700" as const,
  },

  /** Same family as refWhite, with wider letter spacing for Japanese captions */
  refWhiteJp: {
    ...defaultSlideInCaptionProps,
    text: "2025/06/19 サンプル · スライドインキャプション",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    fontWeight: "700" as const,
    letterSpacing: "0.08em",
    lineHeight: 1.38,
  },
};
