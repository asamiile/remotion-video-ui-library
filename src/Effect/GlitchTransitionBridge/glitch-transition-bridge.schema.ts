import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const glitchTransitionBridgeSchema = z.object({
  backgroundColor: zColor().default("#060810"),

  streakCount: z.number().min(1).max(20).default(6),
  streakBaseColor: zColor().default("#eef1fc"),
  channelAColor: zColor().default("#ff3d9e"),
  channelBColor: zColor().default("#37e9ff"),
  streakChannelShiftPx: z.number().min(0).max(24).default(4),

  /** Whether to show the geometric line-art motif (triangle) */
  lineArtEnabled: z.boolean().default(true),
  lineArtColor: zColor().default("#7c86a8"),

  randomSeed: z.string().default("glitch-bridge"),
});

export type GlitchTransitionBridgeSchemaType = z.infer<
  typeof glitchTransitionBridgeSchema
>;

export const glitchTransitionBridgeDurationFrames = 15;

export const defaultGlitchTransitionBridgeProps = {
  backgroundColor: "#060810",
  streakCount: 6,
  streakBaseColor: "#eef1fc",
  channelAColor: "#ff3d9e",
  channelBColor: "#37e9ff",
  streakChannelShiftPx: 4,
  lineArtEnabled: true,
  lineArtColor: "#7c86a8",
  randomSeed: "glitch-bridge",
} as const;

