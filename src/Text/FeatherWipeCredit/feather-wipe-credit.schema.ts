import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const featherWipeCreditSchema = z.object({
  text: z.string().default("STARRING SAMPLE CAST"),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(44),
  letterSpacing: z.string().default("0.08em"),
  textColor: zColor().default("#f2f4fb"),
  backgroundColor: zColor().default("#05060a"),

  /** Softness of the wipe boundary, as a percent of the text block's width */
  featherWidthPercent: z.number().min(1).max(50).default(12),
  /** Thin light line drawn at the wipe boundary as it travels */
  edgeGlowColor: zColor().default("rgba(255,255,255,0.9)"),
  edgeGlowWidthPx: z.number().min(0).max(40).default(3),
  /** How far each character rises as the wipe boundary reaches it (px) */
  liftPx: z.number().min(0).max(80).default(16),

  /** How many frames the wipe takes to travel once, left to right, across the text */
  wipeDurationFrames: z.number().min(1).default(70),
  delayFrames: z.number().min(0).default(0),
});

export type FeatherWipeCreditSchemaType = z.infer<
  typeof featherWipeCreditSchema
>;

export const featherWipeCreditDurationFrames = 130;

export const defaultFeatherWipeCreditProps = {
  text: "STARRING SAMPLE CAST",

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.08em",
  textColor: "#f2f4fb",
  backgroundColor: "#05060a",

  featherWidthPercent: 12,
  edgeGlowColor: "rgba(255,255,255,0.9)",
  edgeGlowWidthPx: 3,
  liftPx: 16,

  wipeDurationFrames: 70,
  delayFrames: 0,
} as const;

export const featherWipeCreditPatterns = {
  /** Soft-edged mask wipe with a light-line boundary and a per-character rise (English default) */
  curtainWipe: {
    ...defaultFeatherWipeCreditProps,
    text: "STARRING SAMPLE CAST",
  },

  /** Same motion, Japanese sample copy */
  curtainWipeJp: {
    ...defaultFeatherWipeCreditProps,
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.06em",
    text: "出演 サンプルキャスト",
  },
};
