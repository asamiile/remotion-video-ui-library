import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const circularNeonLogoFrameSchema = z.object({
  logoText: z.string().default("SAMPLE"),

  ringColor: zColor().default("#37e9ff"),
  ringThicknessPx: z.number().min(1).max(20).default(4),
  ringDiameterPx: z.number().min(40).max(800).default(280),
  ringGlowPx: z.number().min(0).max(60).default(16),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontSize: z.number().min(12).max(120).default(40),
  textColor: zColor().default("#ff2d9e"),
  textGlowPx: z.number().min(0).max(60).default(14),

  backgroundColor: zColor().default("#05060a"),

  popInFrames: z.number().min(0).default(16),
  delayFrames: z.number().min(0).default(0),
});

export type CircularNeonLogoFrameSchemaType = z.infer<
  typeof circularNeonLogoFrameSchema
>;

export const circularNeonLogoFrameDurationFrames = 150;

export const defaultCircularNeonLogoFrameProps = {
  logoText: "SAMPLE",

  ringColor: "#37e9ff",
  ringThicknessPx: 4,
  ringDiameterPx: 280,
  ringGlowPx: 16,

  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 40,
  textColor: "#ff2d9e",
  textGlowPx: 14,

  backgroundColor: "#05060a",

  popInFrames: 16,
  delayFrames: 0,
} as const;

export const circularNeonLogoFramePatterns = {
  /** Cyan neon ring with a glowing pink logo inside (English default) */
  cyanRingPinkLogo: {
    ...defaultCircularNeonLogoFrameProps,
    logoText: "SAMPLE",
  },

  /** Same layout, Japanese sample copy */
  cyanRingPinkLogoJp: {
    ...defaultCircularNeonLogoFrameProps,
    logoText: "サンプル",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
  },
};
