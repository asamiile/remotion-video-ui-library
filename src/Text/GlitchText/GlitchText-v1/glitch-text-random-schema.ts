import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";

export const glitchTextRandomSchemaV1 = z.object({
  items: z
    .array(
      z.object({
        text: z.string(),
      })
    )
    .default([]),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontSize: z.number().min(16).max(160).default(32),
  letterSpacing: z.string().default("0.05em"),

  textColor: zColor().default("#EEF1FC"),
  channelRColor: zColor().default("rgba(255, 61, 158, 0.55)"), // #FF3D9E (magenta)
  channelBColor: zColor().default("rgba(55, 233, 255, 0.55)"), // #37E9FF (cyan)

  /** Max chroma-shift offset in px */
  rgbOffsetMax: z.number().min(0).max(24).default(8),
  /** Per-segment probability of strong glitch */
  strongGlitchProbability: z.number().min(0).max(1).default(0.2),
  /** Length of one glitch segment (frames) */
  glitchSegmentFrames: z.number().min(2).default(5),
  /** Probability per character of garbling during strong glitch */
  garbleRate: z.number().min(0).max(1).default(0.42),
  /** Subtle jitter (px) */
  jitterPx: z.number().min(0).max(12).default(2),

  scanlineOpacity: z.number().min(0).max(0.35).default(0.08),
  backgroundColor: zColor().default("#060810"),

  /** Frames between spawn attempts */
  spawnIntervalFrames: z.number().min(5).default(60),
  /** Frames from appearance to glitch start */
  glitchDelayFrames: z.number().min(0).default(90),
  /** Frames from appearance to fade-out start */
  displayDurationFrames: z.number().min(30).default(300),
  /** Fade-out duration (frames) */
  fadeOutDuration: z.number().min(10).default(30),

  randomSeed: z.string().default("glitch-random-v1"),
});

export type GlitchTextRandomSchemaV1Type = z.infer<typeof glitchTextRandomSchemaV1>;
