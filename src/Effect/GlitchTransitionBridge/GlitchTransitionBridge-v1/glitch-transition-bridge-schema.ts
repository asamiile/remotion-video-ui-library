import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const glitchTransitionBridgeSchemaV1 = z.object({
  backgroundColor: zColor().default("#060810"),

  streakCount: z.number().min(1).max(20).default(6),
  streakBaseColor: zColor().default("#eef1fc"),
  channelAColor: zColor().default("#ff3d9e"),
  channelBColor: zColor().default("#37e9ff"),
  streakChannelShiftPx: z.number().min(0).max(24).default(4),

  /** Whether to show the geometric line-art motif (triangle) */
  lineArtEnabled: z.boolean().default(true),
  lineArtColor: zColor().default("#7c86a8"),

  randomSeed: z.string().default("glitch-bridge-v1"),
});

export type GlitchTransitionBridgeSchemaV1Type = z.infer<
  typeof glitchTransitionBridgeSchemaV1
>;
