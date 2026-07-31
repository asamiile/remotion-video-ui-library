import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";

export const glitchTextRandomSchema = z.object({
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

  randomSeed: z.string().default("glitch-random"),
});

export type GlitchTextRandomSchemaType = z.infer<typeof glitchTextRandomSchema>;

export const glitchTextRandomDurationFrames = 3000;

export const defaultGlitchTextRandomProps = {
  items: [],
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  fontSize: 32,
  letterSpacing: "0.05em",
  textColor: "#EEF1FC",
  channelRColor: "rgba(255, 61, 158, 0.55)",
  channelBColor: "rgba(55, 233, 255, 0.55)",
  rgbOffsetMax: 8,
  strongGlitchProbability: 0.2,
  glitchSegmentFrames: 5,
  garbleRate: 0.42,
  jitterPx: 2,
  scanlineOpacity: 0.08,
  backgroundColor: "#060810",
  spawnIntervalFrames: 60,
  glitchDelayFrames: 90,
  displayDurationFrames: 300,
  fadeOutDuration: 30,
  randomSeed: "glitch-random",
} as const;

export const glitchTextRandomPatterns = {
  "harshSignalRandom-01": {
    ...defaultGlitchTextRandomProps,
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 32,
    letterSpacing: "0.05em",
    textColor: "#EEF1FC",
    channelRColor: "rgba(255, 61, 158, 0.55)",
    channelBColor: "rgba(55, 233, 255, 0.55)",
    rgbOffsetMax: 12,
    strongGlitchProbability: 0.32,
    glitchSegmentFrames: 4,
    jitterPx: 3,
    spawnIntervalFrames: 60,
    glitchDelayFrames: 90,
    displayDurationFrames: 300,
    fadeOutDuration: 30,
    randomSeed: "glitch-harsh-random",
  },
  "harshSignalRandom-02": {
    ...defaultGlitchTextRandomProps,
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 32,
    letterSpacing: "0.05em",
    textColor: "#EEF1FC",
    channelRColor: "rgba(255, 61, 158, 0.55)",
    channelBColor: "rgba(55, 233, 255, 0.55)",
    rgbOffsetMax: 12,
    strongGlitchProbability: 0.32,
    glitchSegmentFrames: 4,
    jitterPx: 3,
    spawnIntervalFrames: 60,
    glitchDelayFrames: 90,
    displayDurationFrames: 300,
    fadeOutDuration: 30,
    randomSeed: "glitch-variant2",
  },
};
