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
