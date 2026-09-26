import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const volumetricSmokeSchema = z.object({
  backgroundColor: zColor().default("#6d6858"),
  /** Lit side of the smoke */
  smokeColor: zColor().default("#9b9582"),
  /** Self-shadowed side of the smoke */
  shadowColor: zColor().default("#24241d"),
  /** Inner glow showing through thin regions */
  glowColor: zColor().default("#ff5a3c"),
  glowStrength: z.number().min(0).max(4).default(1.6),
  density: z.number().min(0.1).max(8).default(3),
  /** 0 = sparse wisps, 1 = the whole frame filled */
  coverage: z.number().min(0).max(1).default(0.72),
  /** Size of the smoke puffs; larger = finer detail */
  noiseScale: z.number().min(0.2).max(4).default(1.5),
  /** Fewer steps give a layered, contour-like look */
  raySteps: z.number().int().min(16).max(128).default(40),
  /** 0 keeps the layered look, 1 smooths it into soft gradients */
  stepJitter: z.number().min(0).max(1).default(0),
  /** Full cycles of drift per composition; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(6).default(1),
  /** Distance traveled through the smoke per cycle */
  driftDistance: z.number().min(0).max(6).default(1.4),
  /** Internal render resolution relative to the composition */
  resolutionScale: z.number().min(0.25).max(1).default(0.75),
});

export type VolumetricSmokeSchemaType = z.infer<typeof volumetricSmokeSchema>;

export const volumetricSmokeDurationFrames = 600;

export const defaultVolumetricSmokeProps = {
  backgroundColor: "#6d6858",
  smokeColor: "#9b9582",
  shadowColor: "#24241d",
  glowColor: "#ff5a3c",
  glowStrength: 1.6,
  density: 3,
  coverage: 0.72,
  noiseScale: 1.5,
  raySteps: 40,
  stepJitter: 0,
  loopCycles: 1,
  driftDistance: 1.4,
  resolutionScale: 0.75,
} as const;

export const volumetricSmokePatterns: Record<
  string,
  VolumetricSmokeSchemaType
> = {
  emberHaze: { ...defaultVolumetricSmokeProps },
  ashDrift: {
    ...defaultVolumetricSmokeProps,
    backgroundColor: "#15181c",
    smokeColor: "#b7bfc8",
    shadowColor: "#1c2127",
    glowColor: "#7fb4ff",
    glowStrength: 0.7,
    density: 2.4,
    coverage: 0.6,
    raySteps: 72,
    stepJitter: 0.6,
    resolutionScale: 0.75,
  },
  /** Dense dark-red smoke with a hot orange core */
  crimsonInferno: {
    ...defaultVolumetricSmokeProps,
    backgroundColor: "#3a0f0a",
    smokeColor: "#6e2a20",
    shadowColor: "#1a0706",
    glowColor: "#ff8a2a",
    glowStrength: 3,
    density: 3.8,
    coverage: 0.8,
    noiseScale: 1.3,
    raySteps: 48,
    driftDistance: 1.8,
  },
  /** Acid-green chemical fumes */
  toxicFume: {
    ...defaultVolumetricSmokeProps,
    backgroundColor: "#1c2410",
    smokeColor: "#9fb46a",
    shadowColor: "#1b2210",
    glowColor: "#c8ff3a",
    glowStrength: 1.8,
    density: 2.8,
    coverage: 0.66,
    noiseScale: 1.8,
    raySteps: 56,
    stepJitter: 0.5,
  },
  /** Pale, sparse mist drifting over a light backdrop */
  ghostMist: {
    ...defaultVolumetricSmokeProps,
    backgroundColor: "#c9ccd0",
    smokeColor: "#f4f5f7",
    shadowColor: "#8e949c",
    glowColor: "#ffffff",
    glowStrength: 0.4,
    density: 1.6,
    coverage: 0.5,
    noiseScale: 1.1,
    raySteps: 64,
    stepJitter: 0.6,
    driftDistance: 1,
  },
  /** Black ink-like smoke with a violet inner light */
  inkAbyss: {
    ...defaultVolumetricSmokeProps,
    backgroundColor: "#0a0c1c",
    smokeColor: "#2a2d44",
    shadowColor: "#040409",
    glowColor: "#9a5cff",
    glowStrength: 2.2,
    density: 4.2,
    coverage: 0.7,
    noiseScale: 1.6,
    raySteps: 32,
    loopCycles: 2,
    driftDistance: 1.1,
  },
};
