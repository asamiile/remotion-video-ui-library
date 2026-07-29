import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const confettiPopTextSchemaV1 = z.object({
  text: z.string().default("Congratulations!"),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(28).max(120).default(48),
  letterSpacing: z.string().default("0.08em"),
  lineHeight: z.number().min(1).max(2).default(1.2),

  textColor: zColor().default("#fff8f0"),

  /** Frame (after delay) at which the cracker fires (flash + burst) */
  burstFrame: z.number().min(0).default(22),
  /** Peak opacity of the flash (white overlay) */
  flashPeakOpacity: z.number().min(0).max(1).default(0.48),
  /** Frames until the flash has mostly faded out */
  flashDurationFrames: z.number().min(1).default(6),

  /** Duration the text glow (text-shadow) stays strong after the burst */
  glowDurationFrames: z.number().min(0).default(26),

  /** Confetti particle count. 0 disables particles only (flash/spring/glow are unaffected) */
  particleCount: z.number().min(0).max(200).default(96),
  /** When true, a ring expands outward from the center */
  showShockwaveRing: z.boolean().default(true),

  particleLifeFrames: z.number().min(24).default(100),
  particleSpread: z.number().min(4).max(40).default(12),
  particleGravity: z.number().min(0).max(2).default(0.42),

  randomSeed: z.string().default("confetti-pop-rich"),

  fadeInDuration: z.number().min(0).default(8),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#1a1428"),
});

export type ConfettiPopTextSchemaV1Type = z.infer<typeof confettiPopTextSchemaV1>;

import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const confettiPopTextV1DurationFrames = 180;

export const defaultConfettiPopTextV1Props = {
  text: "Congratulations!",
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.08em",
  lineHeight: 1.2,
  textColor: "#fff8f0",
  burstFrame: 22,
  flashPeakOpacity: 0.48,
  flashDurationFrames: 6,
  glowDurationFrames: 26,
  particleCount: 96,
  showShockwaveRing: true,
  particleLifeFrames: 100,
  particleSpread: 12,
  particleGravity: 0.42,
  randomSeed: "confetti-pop-rich",
  fadeInDuration: 8,
  delayFrames: 0,
  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,
  backgroundColor: "#1a1428",
} as const;

const confettiPopSharedV1 = {
  ...defaultConfettiPopTextV1Props,
  fontSize: 48,
  burstFrame: 22,
  particleCount: 96,
};

export const confettiPopTextV1Patterns = {
  /** Latin script - JetBrains Mono */
  richPop: {
    ...confettiPopSharedV1,
    text: "Congratulations!",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    letterSpacing: "0.06em",
    randomSeed: "confetti-pop-rich-en",
  },

  /** Japanese - LINE Seed JP */
  richPopJp: {
    ...confettiPopSharedV1,
    text: "おめでとう！",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    letterSpacing: "0.08em",
    randomSeed: "confetti-pop-rich-jp",
  },
};
