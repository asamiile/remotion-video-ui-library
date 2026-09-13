import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const pedigreeCreditTextSchema = z.object({
  /** One or more lines, e.g. a lead-in line plus a pedigree/achievement line */
  lines: z.array(z.string()).default(["FROM THE TEAM BEHIND", "SAMPLE PROJECT ONE / TWO / THREE"]),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(120).default(36),
  lineHeight: z.number().min(1).max(2).default(1.4),
  letterSpacing: z.string().default("0.02em"),

  textColorStart: zColor().default("#ffffff"),
  textColorEnd: zColor().default("#8890ac"),

  streakColor: zColor().default("rgba(255,255,255,0.9)"),
  streakWidthPercent: z.number().min(2).max(60).default(18),
  backgroundColor: zColor().default("#05060a"),

  /** How many frames the light streak takes to sweep once across the text block */
  sweepDurationFrames: z.number().min(1).default(70),
  fadeInFrames: z.number().min(0).default(16),
  delayFrames: z.number().min(0).default(0),
});

export type PedigreeCreditTextSchemaType = z.infer<
  typeof pedigreeCreditTextSchema
>;

export const pedigreeCreditTextDurationFrames = 150;

export const defaultPedigreeCreditTextProps = {
  lines: ["FROM THE TEAM BEHIND", "SAMPLE PROJECT ONE / TWO / THREE"],

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 36,
  lineHeight: 1.4,
  letterSpacing: "0.02em",

  textColorStart: "#ffffff",
  textColorEnd: "#8890ac",

  streakColor: "rgba(255,255,255,0.9)",
  streakWidthPercent: 18,
  backgroundColor: "#05060a",

  sweepDurationFrames: 70,
  fadeInFrames: 16,
  delayFrames: 0,
} as const;

export const pedigreeCreditTextPatterns = {
  /** Gradient credit block with a single light-streak sweep (English default) */
  staffCredit: {
    ...defaultPedigreeCreditTextProps,
    lines: ["FROM THE TEAM BEHIND", "SAMPLE PROJECT ONE / TWO / THREE"],
  },

  /** Same layout, Japanese sample copy */
  staffCreditJp: {
    ...defaultPedigreeCreditTextProps,
    lines: ["サンプル作品のスタッフが贈る"],
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.06em",
  },
};
