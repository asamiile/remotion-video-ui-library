import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const flickerTitleSchema = z.object({
  eyebrowText: z.string().default("EYEBROW LABEL"),
  titleText: z.string().default("Your Title Here"),

  eyebrowFontSize: z.number().min(1).default(24),
  titleFontSize: z.number().min(1).default(48),
  /** Vertical gap between eyebrow and title (px) */
  gapPx: z.number().min(0).default(20),

  eyebrowFontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  titleFontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),

  eyebrowColor: zColor().default("#9AA3B2"),
  titleColor: zColor().default("#F5F5F7"),
  backgroundColor: zColor().default("#0A0A0F"),

  /** Glow behind the eyebrow text; "transparent" or a 0 blur turns it off */
  eyebrowGlowColor: zColor().default("transparent"),
  eyebrowGlowBlurPx: z.number().min(0).max(60).default(0),

  /** Frame at which the eyebrow's flicker-in effect (`helpers/effect-neon-flicker.ts`) fires */
  flickerTriggerFrame: z.number().min(0).default(15),
  /** Replays the flicker every N frames (0 = fire once, then stay lit) */
  flickerRepeatFrames: z.number().int().min(0).default(0),
});

export type FlickerTitleSchemaType = z.infer<typeof flickerTitleSchema>;

export const flickerTitleDurationFrames = 90;

export const defaultFlickerTitleProps = {
  eyebrowText: "EYEBROW LABEL",
  titleText: "Your Title Here",
  eyebrowFontSize: 24,
  titleFontSize: 48,
  gapPx: 20,
  eyebrowFontFamily: JETBRAINS_MONO_FONT_FAMILY,
  titleFontFamily: LINE_SEED_JP_FONT_FAMILY,
  eyebrowColor: "#9AA3B2",
  titleColor: "#F5F5F7",
  backgroundColor: "#0A0A0F",
  eyebrowGlowColor: "transparent",
  eyebrowGlowBlurPx: 0,
  flickerTriggerFrame: 15,
  flickerRepeatFrames: 0,
} as const satisfies FlickerTitleSchemaType;

/**
 * `default` is registered as `FlickerTitle`; every other key as
 * `FlickerTitle-<Pattern>`.
 */
export const flickerTitlePatterns = {
  /** Neutral title card; the eyebrow flickers on once */
  default: defaultFlickerTitleProps,

  /** Cyan glowing eyebrow over a dark navy backdrop, flickering every 3 seconds */
  cyanGlow: {
    ...defaultFlickerTitleProps,
    titleFontFamily: SPACE_GROTESK_FONT_FAMILY,
    eyebrowColor: "#37E9FF",
    titleColor: "#EEF1FC",
    backgroundColor: "#060810",
    eyebrowGlowColor: "rgba(55, 233, 255, 0.5)",
    eyebrowGlowBlurPx: 12,
    flickerRepeatFrames: flickerTitleDurationFrames,
  },
} satisfies Record<string, FlickerTitleSchemaType>;
