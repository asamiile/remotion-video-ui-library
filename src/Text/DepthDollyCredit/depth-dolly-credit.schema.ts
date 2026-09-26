import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const depthDollyCreditSchema = z.object({
  text: z.string().default("A SAMPLE FILM"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(52),
  letterSpacing: z.string().default("0.04em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Scale a character starts at, as if distant, before the dolly band reaches it */
  startScale: z.number().min(0.1).max(1).default(0.4),
  /** Peak scale it briefly overshoots to right as the band passes, before settling to 1 */
  overshootScale: z.number().min(1).max(2).default(1.14),
  /** Blur applied while a character is still distant (px) */
  startBlurPx: z.number().min(0).max(40).default(8),
  /** Opacity a character starts at while distant */
  startOpacity: z.number().min(0).max(1).default(0.3),
  /** Dolly band softness, as a fraction of the text's width (0-1) */
  bandWidth: z.number().min(0.02).max(1).default(0.16),

  /** How many frames the dolly band takes to sweep once, left to right, across the text */
  sweepDurationFrames: z.number().min(1).default(70),
  delayFrames: z.number().min(0).default(0),
});

export type DepthDollyCreditSchemaType = z.infer<typeof depthDollyCreditSchema>;

export const depthDollyCreditDurationFrames = 130;

export const defaultDepthDollyCreditProps = {
  text: "A SAMPLE FILM",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 52,
  letterSpacing: "0.04em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  startScale: 0.4,
  overshootScale: 1.14,
  startBlurPx: 8,
  startOpacity: 0.3,
  bandWidth: 0.16,

  sweepDurationFrames: 70,
  delayFrames: 0,
} as const;

export const depthDollyCreditPatterns = {
  /** Characters push in from a distant, small, blurred state with a camera-dolly overshoot (English default) */
  dollyPush: {
    ...defaultDepthDollyCreditProps,
    text: "A SAMPLE FILM",
  },

  /** Same motion, Japanese sample copy */
  dollyPushJp: {
    ...defaultDepthDollyCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.08em",
    text: "サンプル映画",
  },
};
