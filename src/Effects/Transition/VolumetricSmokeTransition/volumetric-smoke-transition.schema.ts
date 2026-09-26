import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const volumetricSmokeTransitionSchema = z.object({
  /** Preview backdrop; becomes transparent with --transparent-bg / --alpha */
  backgroundColor: zColor().default("#0b0b0d"),
  smokeColor: zColor().default("#9b9582"),
  shadowColor: zColor().default("#24241d"),
  glowColor: zColor().default("#ff5a3c"),
  glowStrength: z.number().min(0).max(4).default(1.6),
  density: z.number().min(0.1).max(8).default(3.4),
  noiseScale: z.number().min(0.2).max(4).default(1.5),
  raySteps: z.number().int().min(16).max(128).default(40),
  stepJitter: z.number().min(0).max(1).default(0),
  /** Where the smoke gathers first: the center, or rolling in from the edges */
  origin: z.enum(["center", "edges"]).default("center"),
  /** How far the smoke rushes toward the camera during the transition */
  travelDistance: z.number().min(0).max(6).default(2.2),
  resolutionScale: z.number().min(0.25).max(1).default(0.75),
});

export type VolumetricSmokeTransitionSchemaType = z.infer<
  typeof volumetricSmokeTransitionSchema
>;

/** Smoke rolls in, fully covers the frame around the midpoint, then clears. */
export const volumetricSmokeTransitionAnimationDurationFrames = 54;
export const volumetricSmokeTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : volumetricSmokeTransitionAnimationDurationFrames;

export const defaultVolumetricSmokeTransitionProps = {
  backgroundColor: "#0b0b0d",
  smokeColor: "#9b9582",
  shadowColor: "#24241d",
  glowColor: "#ff5a3c",
  glowStrength: 1.6,
  density: 3.4,
  noiseScale: 1.5,
  raySteps: 40,
  stepJitter: 0,
  origin: "center",
  travelDistance: 2.2,
  resolutionScale: 0.75,
} as const;

export const volumetricSmokeTransitionPatterns: Record<
  string,
  VolumetricSmokeTransitionSchemaType
> = {
  emberBillow: { ...defaultVolumetricSmokeTransitionProps },
  /** Bright white smoke closing in from the frame edges */
  ashWhiteout: {
    ...defaultVolumetricSmokeTransitionProps,
    smokeColor: "#eef0f2",
    shadowColor: "#7d838b",
    glowColor: "#ffffff",
    glowStrength: 0.5,
    density: 3,
    noiseScale: 1.2,
    raySteps: 64,
    stepJitter: 0.6,
    origin: "edges",
  },
  /** Dense red smoke bursting from the center with a hot core */
  crimsonBurst: {
    ...defaultVolumetricSmokeTransitionProps,
    smokeColor: "#6e2a20",
    shadowColor: "#1a0706",
    glowColor: "#ff8a2a",
    glowStrength: 3,
    density: 4,
    noiseScale: 1.3,
    raySteps: 48,
    travelDistance: 3.2,
  },
  /** Black ink smoke with a violet inner light, rolling in from the edges */
  inkVeil: {
    ...defaultVolumetricSmokeTransitionProps,
    smokeColor: "#2a2d44",
    shadowColor: "#040409",
    glowColor: "#9a5cff",
    glowStrength: 2.2,
    density: 4.4,
    noiseScale: 1.6,
    raySteps: 32,
    origin: "edges",
  },
  /** Acid-green chemical cloud */
  toxicCloud: {
    ...defaultVolumetricSmokeTransitionProps,
    smokeColor: "#9fb46a",
    shadowColor: "#1b2210",
    glowColor: "#c8ff3a",
    glowStrength: 1.8,
    density: 3,
    noiseScale: 1.8,
    raySteps: 56,
    stepJitter: 0.5,
    travelDistance: 1.6,
  },
};
