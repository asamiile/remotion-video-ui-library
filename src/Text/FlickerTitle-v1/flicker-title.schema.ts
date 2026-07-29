import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const flickerTitleSchemaV1 = z.object({
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

  /** Frame at which the eyebrow's flicker-in effect (`helpers/neon-flicker.ts`) fires */
  flickerTriggerFrame: z.number().min(0).default(15),
});

export type FlickerTitleSchemaV1Type = z.infer<typeof flickerTitleSchemaV1>;

import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/space-grotesk";

export const flickerTitleV1DurationFrames = 90;

export const defaultFlickerTitleV1Props = {
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
  flickerTriggerFrame: 15,
} as const;

export const oneTakeLogoTextVariantProps = {
  eyebrowText: "DAW Remote Controller",
  titleText: "OneTake - Remote Control",
  eyebrowFontSize: 24,
  titleFontSize: 48,
  gapPx: 20,
  eyebrowFontFamily: JETBRAINS_MONO_FONT_FAMILY,
  titleFontFamily: SPACE_GROTESK_FONT_FAMILY,
  eyebrowColor: "#37E9FF",
  titleColor: "#EEF1FC",
  backgroundColor: "#060810",
  flickerTriggerFrame: 15,
} as const;
