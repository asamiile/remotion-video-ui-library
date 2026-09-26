import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const focusPullCreditSchema = z.object({
  text: z.string().default("DIRECTED BY SAMPLE NAME"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(44),
  letterSpacing: z.string().default("0.1em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Fraction of dim opacity while a character is still ahead of the focus band */
  dimOpacity: z.number().min(0).max(1).default(0.25),
  /** Max blur applied to a character before the focus band reaches it (px) */
  maxBlurPx: z.number().min(0).max(40).default(14),
  /** Focus band softness, as a fraction of the text's width (0-1) */
  bandWidth: z.number().min(0.02).max(1).default(0.16),
  /** Extra scale applied right as the band passes a character, for a "focus lands" pop */
  pulseScale: z.number().min(0).max(0.3).default(0.05),

  /** How many frames the focus band takes to sweep once, left to right, across the text */
  sweepDurationFrames: z.number().min(1).default(70),
  delayFrames: z.number().min(0).default(0),
});

export type FocusPullCreditSchemaType = z.infer<typeof focusPullCreditSchema>;

export const focusPullCreditDurationFrames = 130;

export const defaultFocusPullCreditProps = {
  text: "DIRECTED BY SAMPLE NAME",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.1em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  dimOpacity: 0.25,
  maxBlurPx: 14,
  bandWidth: 0.16,
  pulseScale: 0.05,

  sweepDurationFrames: 70,
  delayFrames: 0,
} as const;

export const focusPullCreditPatterns = {
  /** Rack-focus style reveal: a focus band sweeps left to right, resolving blur to sharp (English default) */
  rackFocus: {
    ...defaultFocusPullCreditProps,
    text: "DIRECTED BY SAMPLE NAME",
  },

  /** Same motion, Japanese sample copy */
  rackFocusJp: {
    ...defaultFocusPullCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.06em",
    text: "監督 サンプル ネーム",
  },
};
