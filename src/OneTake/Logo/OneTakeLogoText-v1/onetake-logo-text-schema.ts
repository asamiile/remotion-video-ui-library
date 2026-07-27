import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { SPACE_GROTESK_FONT_FAMILY } from "../../../helpers/space-grotesk";

export const oneTakeLogoTextSchemaV1 = z.object({
  eyebrowText: z.string().default("DAW Remote Controller"),
  titleText: z.string().default("OneTake - Remote Control"),

  eyebrowFontSize: z.number().min(1).default(24),
  titleFontSize: z.number().min(1).default(48),
  /** Vertical spacing between eyebrow and title (px) */
  gapPx: z.number().min(0).default(20),

  /** Matches asami.tokyo's `--font-onetake-mono` (JetBrains Mono) */
  eyebrowFontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  /** Matches asami.tokyo's body font `--font-sans` (Space Grotesk) */
  titleFontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),

  eyebrowColor: zColor().default("#37E9FF"),
  titleColor: zColor().default("#EEF1FC"),
  backgroundColor: zColor().default("#060810"),

  /** Frame at which the eyebrow's "neon tube turning on" effect fires
   *  (ported from asami.tokyo's `Join the waitlist` button hover animation
   *  `cta-flicker`) */
  flickerTriggerFrame: z.number().min(0).default(15),
});

export type OneTakeLogoTextSchemaV1Type = z.infer<
  typeof oneTakeLogoTextSchemaV1
>;
