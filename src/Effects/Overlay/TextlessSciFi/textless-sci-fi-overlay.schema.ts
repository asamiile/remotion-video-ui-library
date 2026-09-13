import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const textlessSciFiOverlayTypes = [
  "scannerSweep",
  "chromaticSignalTear",
  "circuitTracePulse",
  "hologramDepthSlices",
  "targetBracketSwarm",
  "perspectiveGridPulse",
  "energyContourLines",
  "glitchBlockDisplacement",
  "particleConnectionField",
  "lensSensorArtifacts",
  "volumetricLightScan",
  "digitalFragmentDrift",
  "plasmaEdgeArc",
  "radialInterfacePulse",
  "compressionNoiseBurst",
  "syntheticFilmGrain",
  "refractiveWaveDistortion",
  "apertureIrisOverlay",
] as const;

export const textlessSciFiOverlaySchema = z.object({
  effectType: z.enum(textlessSciFiOverlayTypes),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  opacity: z.number().min(0).max(1),
  intensity: z.number().min(0).max(2),
  density: z.number().min(0.25).max(2),
  speed: z.number().min(0.1).max(3),
  safeAreaPercent: z.number().min(0).max(20),
  randomSeed: z.string(),
});

export type TextlessSciFiOverlaySchemaType = z.infer<typeof textlessSciFiOverlaySchema>;

export const textlessSciFiOverlayDurationFrames = 300;

const base = {
  primaryColor: "#37e9ff",
  secondaryColor: "#8b5cf6",
  accentColor: "#ff3ca6",
  opacity: 0.72,
  intensity: 1,
  density: 1,
  speed: 1,
  safeAreaPercent: 5,
} as const;

export const textlessSciFiOverlayPatterns: Record<string, TextlessSciFiOverlaySchemaType> = {
  scannerSweepOverlay: {...base, effectType: "scannerSweep", randomSeed: "scanner-sweep"},
  chromaticSignalTear: {...base, effectType: "chromaticSignalTear", intensity: 1.2, randomSeed: "chromatic-tear"},
  circuitTracePulse: {...base, effectType: "circuitTracePulse", density: 1.15, randomSeed: "circuit-trace"},
  hologramDepthSlices: {...base, effectType: "hologramDepthSlices", opacity: 0.58, randomSeed: "depth-slices"},
  targetBracketSwarm: {...base, effectType: "targetBracketSwarm", randomSeed: "bracket-swarm"},
  perspectiveGridPulse: {...base, effectType: "perspectiveGridPulse", opacity: 0.55, randomSeed: "grid-pulse"},
  energyContourLines: {...base, effectType: "energyContourLines", opacity: 0.6, randomSeed: "contour-lines"},
  glitchBlockDisplacement: {...base, effectType: "glitchBlockDisplacement", intensity: 1.25, randomSeed: "block-displacement"},
  particleConnectionField: {...base, effectType: "particleConnectionField", density: 1.2, randomSeed: "particle-field"},
  lensSensorArtifacts: {...base, effectType: "lensSensorArtifacts", opacity: 0.5, randomSeed: "sensor-artifacts"},
  volumetricLightScan: {...base, effectType: "volumetricLightScan", opacity: 0.48, randomSeed: "volumetric-scan"},
  digitalFragmentDrift: {...base, effectType: "digitalFragmentDrift", density: 1.15, randomSeed: "fragment-drift"},
  plasmaEdgeArc: {...base, effectType: "plasmaEdgeArc", intensity: 1.25, randomSeed: "plasma-arc"},
  radialInterfacePulse: {...base, effectType: "radialInterfacePulse", randomSeed: "radial-pulse"},
  compressionNoiseBurst: {...base, effectType: "compressionNoiseBurst", intensity: 1.3, randomSeed: "compression-burst"},
  syntheticFilmGrain: {...base, effectType: "syntheticFilmGrain", opacity: 0.42, density: 1.4, randomSeed: "synthetic-grain"},
  refractiveWaveDistortion: {...base, effectType: "refractiveWaveDistortion", opacity: 0.5, randomSeed: "refractive-wave"},
  apertureIrisOverlay: {...base, effectType: "apertureIrisOverlay", opacity: 0.65, randomSeed: "aperture-iris"},
};
