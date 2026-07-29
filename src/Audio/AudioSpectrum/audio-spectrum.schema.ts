import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const audioSpectrumSchema = z.object({
  audioFile: z.string().default("audio/AudioSpectrum/dialogue.wav"), // path relative to public/
  audioOffsetInSeconds: z.number().default(0),
  barCount: z.number().min(8).max(128).default(32),
  barColor: zColor().default("#DFE2D7"),
  barWidth: z.number().min(1).max(50).default(8),
  barGap: z.number().min(0).max(20).default(2),

  sensitivity: z.number().min(0.1).max(10).default(1),
  smoothing: z.number().min(0).max(1).default(0.85), // higher = smoother

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

});

export type AudioSpectrumSchemaType = z.infer<typeof audioSpectrumSchema>;


export const defaultAudioSpectrumProps = {
  audioFile: "audio/AudioSpectrum/dialogue.wav",
  audioOffsetInSeconds: 0,

  barCount: 32,
  barColor: "#DFE2D7",
  barWidth: 12,
  barGap: 2,

  sensitivity: 1,
  smoothing: 0.85,

  positionX: 84,
  positionY: 10,
};
export const audioSpectrumPatterns = {
  simple: {
    ...defaultAudioSpectrumProps,
    barCount: 16,
  },

  detailed: {
    ...defaultAudioSpectrumProps,
    barCount: 32,
    barWidth: 12,
    barGap: 2,
  },
};
