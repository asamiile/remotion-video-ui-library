import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const exposureFlashCreditSchema = z.object({
  text: z.string().default("DIRECTED BY SAMPLE NAME"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(44),
  letterSpacing: z.string().default("0.1em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Opacity of a character while it's still ahead of the exposure band */
  dimOpacity: z.number().min(0).max(1).default(0.15),
  /** Peak brightness() multiplier right as the exposure band passes a character */
  flashBrightness: z.number().min(1).max(4).default(2.4),
  /** Exposure band softness, as a fraction of the text's width (0-1) */
  bandWidth: z.number().min(0.02).max(1).default(0.14),

  /** How many frames the exposure band takes to sweep once, left to right, across the text */
  sweepDurationFrames: z.number().min(1).default(60),
  delayFrames: z.number().min(0).default(0),
});

export type ExposureFlashCreditSchemaType = z.infer<
  typeof exposureFlashCreditSchema
>;

export const exposureFlashCreditDurationFrames = 120;

export const defaultExposureFlashCreditProps = {
  text: "DIRECTED BY SAMPLE NAME",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.1em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  dimOpacity: 0.15,
  flashBrightness: 2.4,
  bandWidth: 0.14,

  sweepDurationFrames: 60,
  delayFrames: 0,
} as const;

export const exposureFlashCreditPatterns = {
  /** Projector-flash style reveal: an overexposure band sweeps left to right (English default) */
  projectorFlash: {
    ...defaultExposureFlashCreditProps,
    text: "DIRECTED BY SAMPLE NAME",
  },

  /** Same motion, Japanese sample copy */
  projectorFlashJp: {
    ...defaultExposureFlashCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.06em",
    text: "監督 サンプル ネーム",
  },
};
