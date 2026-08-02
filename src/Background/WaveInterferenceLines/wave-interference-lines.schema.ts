import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const waveInterferenceLinesSchema = z.object({
  backgroundColor: zColor().default("#030308"),

  bandColor: zColor().default("#1c3bff"),
  bandHeightPercent: z.number().min(5).max(60).default(22),
  bandOpacity: z.number().min(0).max(1).default(0.85),

  lineCount: z.number().min(1).max(30).default(14),
  lineColors: z
    .array(zColor())
    .min(1)
    .default(["#4dd2ff", "#6ee9c8", "#7aa6ff", "#b98bff", "#5ee6ff", "#eef1fc"]),
  lineWidthPx: z.number().min(0.5).max(6).default(1.2),
  waveAmplitudePx: z.number().min(4).max(320).default(120),
  waveFrequency: z.number().min(0.5).max(12).default(3),
  phaseSpeed: z.number().min(0).max(0.2).default(0.03),

  /** Number of brief white-flash accents scattered across the composition's duration */
  flashCount: z.number().min(0).max(20).default(2),
  flashHoldFrames: z.number().min(1).default(4),
  flashColor: zColor().default("#f4f6ff"),
  /** Faint grid texture that shows through only while a flash is active */
  gridOpacity: z.number().min(0).max(1).default(0.08),

  randomSeed: z.string().default("wave-interference-lines"),
});

export type WaveInterferenceLinesSchemaType = z.infer<
  typeof waveInterferenceLinesSchema
>;

export const waveInterferenceLinesDurationFrames = 180;

export const defaultWaveInterferenceLinesProps = {
  backgroundColor: "#030308",

  bandColor: "#1c3bff",
  bandHeightPercent: 22,
  bandOpacity: 0.85,

  lineCount: 14,
  lineColors: ["#4dd2ff", "#6ee9c8", "#7aa6ff", "#b98bff", "#5ee6ff", "#eef1fc"],
  lineWidthPx: 1.2,
  waveAmplitudePx: 120,
  waveFrequency: 3,
  phaseSpeed: 0.03,

  flashCount: 2,
  flashHoldFrames: 4,
  flashColor: "#f4f6ff",
  gridOpacity: 0.08,

  randomSeed: "wave-interference-lines",
} as const;

export const waveInterferenceLinesPatterns = {
  /** Blue horizontal glow band with a multicolor line-wave interference pattern */
  blueGlow: {
    ...defaultWaveInterferenceLinesProps,
    bandColor: "#1c3bff",
    randomSeed: "wave-interference-lines-blue",
  },

  /** Deep violet glow variant with a cyan/indigo line palette */
  magentaGlow: {
    ...defaultWaveInterferenceLinesProps,
    bandColor: "#6a1ecf",
    lineColors: ["#4dd2ff", "#6ee9c8", "#eef1fc", "#7aa6ff", "#c9b8ff"],
    randomSeed: "wave-interference-lines-magenta",
  },
};
