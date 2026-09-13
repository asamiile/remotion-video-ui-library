import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";

export const emergingNoiseTitleSchema = z.object({
  text: z.string().default("SAMPLE TITLE"),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontSize: z.number().min(12).max(160).default(48),
  letterSpacing: z.string().default("0.05em"),
  textColor: zColor().default("#ffffff"),

  backgroundColor: zColor().default("#04040c"),

  /** Frames for the title to build up one character at a time */
  buildFrames: z.number().min(1).default(60),
  delayFrames: z.number().min(0).default(0),

  /** Short word fragments that flash briefly at random positions on screen */
  wordFragments: z.array(z.string()).default(["ALE", "AIR", "AN"]),
  fragmentColor: zColor().default("#ffffff"),
  fragmentFontSize: z.number().min(8).max(80).default(24),
  fragmentFlashFrames: z.number().min(1).default(10),

  randomSeed: z.string().default("emerging-noise-title"),
});

export type EmergingNoiseTitleSchemaType = z.infer<
  typeof emergingNoiseTitleSchema
>;

export const emergingNoiseTitleDurationFrames = 150;

export const defaultEmergingNoiseTitleProps = {
  text: "SAMPLE TITLE",

  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  fontSize: 48,
  letterSpacing: "0.05em",
  textColor: "#ffffff",

  backgroundColor: "#04040c",

  buildFrames: 60,
  delayFrames: 0,

  wordFragments: ["ALE", "AIR", "AN"],
  fragmentColor: "#ffffff",
  fragmentFontSize: 24,
  fragmentFlashFrames: 10,

  randomSeed: "emerging-noise-title",
} as const;

export const emergingNoiseTitlePatterns = {
  /** Title builds up letter by letter, with short word fragments flashing around it (English default) */
  buildUp: {
    ...defaultEmergingNoiseTitleProps,
    text: "SAMPLE TITLE",
  },

  /** Same treatment, Japanese sample copy */
  buildUpJp: {
    ...defaultEmergingNoiseTitleProps,
    text: "サンプルタイトル",
    wordFragments: ["サン", "プル", "タイ"],
  },
};
