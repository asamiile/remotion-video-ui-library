import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const slideInCaptionSchemaV1 = z.object({
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

export type SlideInCaptionSchemaV1Type = z.infer<typeof slideInCaptionSchemaV1>;
