import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const kerningRevealCreditSchema = z.object({
  text: z.string().default("A SAMPLE FILM"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(52),
  letterSpacing: z.string().default("0.04em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Extra horizontal spread per character index step, collapsing to 0 as each converges (px) */
  spreadPx: z.number().min(0).max(80).default(20),
  /** Vertical settle distance each character rises through as it converges (px) */
  riseFromPx: z.number().min(0).max(80).default(14),
  /** Frame delay between each character's converge start, leftmost first */
  staggerFrames: z.number().min(0).max(20).default(3),
  /** How many frames a single character's own converge/fade takes */
  convergeFrames: z.number().min(1).default(20),

  delayFrames: z.number().min(0).default(0),
});

export type KerningRevealCreditSchemaType = z.infer<
  typeof kerningRevealCreditSchema
>;

export const kerningRevealCreditDurationFrames = 120;

export const defaultKerningRevealCreditProps = {
  text: "A SAMPLE FILM",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 52,
  letterSpacing: "0.04em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  spreadPx: 20,
  riseFromPx: 14,
  staggerFrames: 3,
  convergeFrames: 20,

  delayFrames: 0,
} as const;

export const kerningRevealCreditPatterns = {
  /** Wide tracking collapsing into place, staggered left to right (English default) */
  trackingConverge: {
    ...defaultKerningRevealCreditProps,
    text: "A SAMPLE FILM",
  },

  /** Same motion, Japanese sample copy */
  trackingConvergeJp: {
    ...defaultKerningRevealCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.08em",
    text: "サンプル映画",
  },
};
