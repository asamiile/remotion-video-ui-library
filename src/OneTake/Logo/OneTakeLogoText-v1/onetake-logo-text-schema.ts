import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { SPACE_GROTESK_FONT_FAMILY } from "../../../helpers/space-grotesk";

export const oneTakeLogoTextSchemaV1 = z.object({
  eyebrowText: z.string().default("DAW Remote Controller"),
  titleText: z.string().default("OneTake - Remote Control"),

  eyebrowFontSize: z.number().min(1).default(24),
  titleFontSize: z.number().min(1).default(48),
  /** eyebrowとtitleの縦の間隔（px） */
  gapPx: z.number().min(0).default(20),

  /** asami.tokyoの`--font-onetake-mono`（JetBrains Mono）と一致 */
  eyebrowFontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  /** asami.tokyoの本文フォント`--font-sans`（Space Grotesk）と一致 */
  titleFontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),

  eyebrowColor: zColor().default("#37E9FF"),
  titleColor: zColor().default("#EEF1FC"),
  backgroundColor: zColor().default("#060810"),

  /** eyebrowの「ネオン管が点灯する」演出（asami.tokyoの`Join the waitlist`ボタンの
   *  hoverアニメーション`cta-flicker`を移植）が発火するフレーム */
  flickerTriggerFrame: z.number().min(0).default(15),
});

export type OneTakeLogoTextSchemaV1Type = z.infer<
  typeof oneTakeLogoTextSchemaV1
>;
