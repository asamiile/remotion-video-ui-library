import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const particleTerrainMeshSchema = z.object({
  backgroundColor: zColor().default("#04040c"),
  particleColor: zColor().default("#eef1fc"),

  gridColumns: z.number().min(4).max(120).default(48),
  gridRows: z.number().min(2).max(40).default(14),

  amplitudePx: z.number().min(0).max(400).default(120),
  waveFrequency: z.number().min(0.2).max(6).default(1.4),
  animationSpeed: z.number().min(0).max(3).default(0.4),

  particleSizePx: z.number().min(0.5).max(10).default(2.4),
  /** How strongly rows converge toward the vanishing point at the top (0 = flat, 1 = strong perspective) */
  perspectiveStrength: z.number().min(0).max(1).default(0.75),

  randomSeed: z.string().default("particle-terrain"),
});

export type ParticleTerrainMeshSchemaType = z.infer<
  typeof particleTerrainMeshSchema
>;

export const defaultParticleTerrainMeshProps = {
  backgroundColor: "#04040c",
  particleColor: "#eef1fc",

  gridColumns: 48,
  gridRows: 14,

  amplitudePx: 120,
  waveFrequency: 1.4,
  animationSpeed: 0.4,

  particleSizePx: 2.4,
  perspectiveStrength: 0.75,

  randomSeed: "particle-terrain",
} as const;

export const particleTerrainMeshPatterns = {
  /** White/silver undulating point-cloud terrain in perspective (English default) */
  driftingWave: {
    ...defaultParticleTerrainMeshProps,
  },

  /** Warm amber variant, calmer motion */
  amberCalm: {
    ...defaultParticleTerrainMeshProps,
    particleColor: "#ffd9a0",
    amplitudePx: 70,
    animationSpeed: 0.2,
  },
};
