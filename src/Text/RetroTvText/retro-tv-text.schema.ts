import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

/**
 * A 1970s-style wooden TV with a flat screen: it powers on, shows the title
 * on a scanlined picture, loses the signal, and ends on static.
 */
export const retroTvTextSchema = z.object({
  text: z.string(),
  /** Second line under the title; empty hides it */
  subText: z.string(),
  fontFamily: z.string(),
  fontSize: z.number().min(16).max(200),
  /** Phosphor color of the text on the screen */
  textColor: zColor(),
  /** Picture background behind the text */
  screenColor: zColor(),
  /** Wood cabinet base color; the grain is drawn on top */
  cabinetColor: zColor(),
  /** Front plate around the screen, dials, and speaker grille */
  panelColor: zColor(),
  /** Room behind the TV; "transparent" for an overlay */
  backgroundColor: zColor(),

  /** Frame the screen powers on (the line opens into the picture) */
  powerOnFrame: z.number().int().min(0),
  /** Frame the signal starts breaking up */
  glitchStartFrame: z.number().int().min(0),
  /** Frame the picture is fully replaced by static */
  staticStartFrame: z.number().int().min(0),
  /** Darkness between scanlines, 0-1 */
  scanlines: z.number().min(0).max(1),
  /** Slow push-in on the TV over the clip, as extra scale (0 = locked off) */
  pushIn: z.number().min(0).max(0.3),
  randomSeed: z.number().int().min(0).max(999),
});

export type RetroTvTextSchemaType = z.infer<typeof retroTvTextSchema>;

export const retroTvTextDurationFrames = 180;

const base = {
  subText: "",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 92,
  textColor: "#eaf3ff",
  screenColor: "#0b1622",
  cabinetColor: "#7a4a2a",
  panelColor: "#d9d4c7",
  backgroundColor: "#1b1714",
  powerOnFrame: 12,
  glitchStartFrame: 112,
  staticStartFrame: 128,
  scanlines: 0.35,
  pushIn: 0.05,
  randomSeed: 7,
};

export const retroTvTextPatterns = {
  /** Walnut cabinet with an off-white front plate, English title */
  walnut: {
    ...base,
    text: "NOW ON AIR",
    subText: "CHANNEL 7",
  },
  /** Japanese sample */
  walnutJp: {
    ...base,
    text: "放送開始",
    subText: "チャンネル 7",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    randomSeed: 12,
  },
};
