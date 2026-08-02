import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const HALFTONE_WAVEFORM_SHAPES = ["sine", "spikyNoise"] as const;

export const halftoneWaveformSchema = z.object({
  backgroundColor: zColor().default("#04040a"),

  bandColors: z
    .array(zColor())
    .min(2)
    .default(["#1c3bff", "#1ca7c8", "#8a2be2", "#2f6bff", "#39c8e6"]),
  hueRotateSpeed: z.number().min(0).max(6).default(1.5),

  waveShapeType: z.enum(HALFTONE_WAVEFORM_SHAPES).default("sine"),
  waveColor: zColor().default("#eef1fc"),

  gridColumns: z.number().min(10).max(200).default(90),
  /** How many dot rows the tallest possible waveform excursion spans (symmetric above/below center) */
  maxRows: z.number().min(1).max(60).default(20),
  dotSizePx: z.number().min(0.5).max(10).default(2.2),

  /** Max waveform half-height, as a percentage of the frame height */
  amplitudePercent: z.number().min(1).max(50).default(28),
  frequency: z.number().min(0.2).max(12).default(3),
  phaseSpeed: z.number().min(0).max(0.3).default(0.05),
  /** For spikyNoise: how often (in frames) each column re-rolls its height */
  noiseUpdateEveryFrames: z.number().min(1).default(6),

  flashCount: z.number().min(0).max(20).default(2),
  flashHoldFrames: z.number().min(1).default(3),
  flashColor: zColor().default("#ffffff"),

  randomSeed: z.string().default("halftone-waveform"),
});

export type HalftoneWaveformSchemaType = z.infer<typeof halftoneWaveformSchema>;

export const halftoneWaveformDurationFrames = 180;

export const defaultHalftoneWaveformProps = {
  backgroundColor: "#04040a",

  bandColors: ["#1c3bff", "#1ca7c8", "#8a2be2", "#2f6bff", "#39c8e6"],
  hueRotateSpeed: 1.5,

  waveShapeType: "sine" as const,
  waveColor: "#eef1fc",

  gridColumns: 90,
  maxRows: 20,
  dotSizePx: 2.2,

  amplitudePercent: 28,
  frequency: 3,
  phaseSpeed: 0.05,
  noiseUpdateEveryFrames: 6,

  flashCount: 2,
  flashHoldFrames: 3,
  flashColor: "#ffffff",

  randomSeed: "halftone-waveform",
} as const;

export const halftoneWaveformPatterns = {
  /** Smooth, continuously pulsing sine-shaped waveform (English default) */
  smoothPulse: {
    ...defaultHalftoneWaveformProps,
    waveShapeType: "sine" as const,
    randomSeed: "halftone-waveform-smooth",
  },

  /** Sharp, erratic noise-driven waveform */
  spikyNoise: {
    ...defaultHalftoneWaveformProps,
    waveShapeType: "spikyNoise" as const,
    noiseUpdateEveryFrames: 5,
    randomSeed: "halftone-waveform-spiky",
  },
};
