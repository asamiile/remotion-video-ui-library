import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const stripeWaveFieldSchema = z.object({
  /** Near-black backdrop shown during the quiet build-up/wind-down portions */
  backgroundColor: zColor().default("#020204"),

  stripeColors: z
    .array(zColor())
    .min(2)
    .default(["#1ca7c8", "#2f6bff", "#4dd2ff", "#7a5cff", "#39e6b0", "#5ee6ff"]),
  stripeCount: z.number().min(4).max(60).default(24),
  /** How fast the vertical-stripe hues cycle (deg per frame) */
  hueRotateSpeed: z.number().min(0).max(6).default(1.2),

  gridOverlayOpacity: z.number().min(0).max(1).default(0.06),

  lineCount: z.number().min(1).max(30).default(18),
  lineColor: zColor().default("#eaf6ff"),
  lineWidthPx: z.number().min(0.5).max(6).default(1),
  waveAmplitudePx: z.number().min(4).max(320).default(90),
  waveFrequency: z.number().min(0.5).max(12).default(4),
  /** 0 = smooth sine waves, 1 = sharply jagged/zigzag waves */
  jaggedness: z.number().min(0).max(1).default(0.35),
  phaseSpeed: z.number().min(0).max(0.2).default(0.04),

  /** Frames to build up from a near-flat quiet state to full intensity */
  buildUpFrames: z.number().min(0).default(60),
  /** Frames at the end to wind back down to the quiet state */
  windDownFrames: z.number().min(0).default(60),

  randomSeed: z.string().default("stripe-wave-field"),
});

export type StripeWaveFieldSchemaType = z.infer<typeof stripeWaveFieldSchema>;

export const stripeWaveFieldDurationFrames = 200;

export const defaultStripeWaveFieldProps = {
  backgroundColor: "#020204",

  stripeColors: ["#1ca7c8", "#2f6bff", "#4dd2ff", "#7a5cff", "#39e6b0", "#5ee6ff"],
  stripeCount: 24,
  hueRotateSpeed: 1.2,

  gridOverlayOpacity: 0.06,

  lineCount: 18,
  lineColor: "#eaf6ff",
  lineWidthPx: 1,
  waveAmplitudePx: 90,
  waveFrequency: 4,
  jaggedness: 0.35,
  phaseSpeed: 0.04,

  buildUpFrames: 60,
  windDownFrames: 60,

  randomSeed: "stripe-wave-field",
} as const;

export const stripeWaveFieldPatterns = {
  /** Rainbow-like multicolor stripes with a pale-pink line-wave overlay */
  chromaticStripes: {
    ...defaultStripeWaveFieldProps,
    randomSeed: "stripe-wave-field-chromatic",
  },

  /** Deeper midnight palette, slower hue cycling */
  duskStripes: {
    ...defaultStripeWaveFieldProps,
    stripeColors: ["#0a1f4d", "#1a3a8f", "#2f6bff", "#5b2ca0", "#1ca7c8"],
    hueRotateSpeed: 0.5,
    lineColor: "#ffffff",
    randomSeed: "stripe-wave-field-dusk",
  },
};
