import {zColor} from "@remotion/zod-types";
import {z} from "zod";

export const sciFiTransitionTypes = [
  "phaseDesync", "packetLossCascade", "signalFold", "lidarDepthGate",
  "vectorLock", "diagnosticCurtain", "voxelMaterialize", "quantumDustTunnel",
  "holographicMembrane", "photonShear", "plasmaVeil", "neutrinoFlashRing",
  "gravityLens", "hyperplaneFlip", "spatialSeam", "dataCellAuthorization",
  "neuralRoute", "coordinateRemap",
] as const;

export const sciFiTransitionsSchema = z.object({
  effectType: z.enum(sciFiTransitionTypes),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  intensity: z.number().min(0.1).max(2),
  density: z.number().min(0.25).max(2),
  direction: z.enum(["left-to-right", "right-to-left", "center-out", "edges-in"]),
  randomSeed: z.string(),
  durationFrames: z.number().int().min(20).max(120),
});

export type SciFiTransitionsProps = z.infer<typeof sciFiTransitionsSchema>;

const base = {
  primaryColor: "#37e9ff",
  secondaryColor: "#8b5cf6",
  accentColor: "#ffffff",
  intensity: 1,
  density: 1,
  direction: "left-to-right" as const,
};

export const sciFiTransitionPatterns: Record<string, SciFiTransitionsProps> = {
  phaseDesyncTransition: {...base, effectType: "phaseDesync", durationFrames: 39, randomSeed: "phase-desync"},
  packetLossCascadeTransition: {...base, effectType: "packetLossCascade", accentColor: "#ff9b28", durationFrames: 45, randomSeed: "packet-loss"},
  signalFoldTransition: {...base, effectType: "signalFold", durationFrames: 33, randomSeed: "signal-fold"},
  lidarDepthGateTransition: {...base, effectType: "lidarDepthGate", primaryColor: "#69ff96", durationFrames: 54, randomSeed: "lidar-depth"},
  vectorLockTransition: {...base, effectType: "vectorLock", accentColor: "#d9ff4f", durationFrames: 51, randomSeed: "vector-lock"},
  diagnosticCurtainTransition: {...base, effectType: "diagnosticCurtain", accentColor: "#ffbf69", durationFrames: 39, randomSeed: "diagnostic-curtain"},
  voxelMaterializeTransition: {...base, effectType: "voxelMaterialize", durationFrames: 69, randomSeed: "voxel-materialize"},
  quantumDustTunnelTransition: {...base, effectType: "quantumDustTunnel", accentColor: "#ffd36b", durationFrames: 60, randomSeed: "quantum-dust"},
  holographicMembraneTransition: {...base, effectType: "holographicMembrane", durationFrames: 54, randomSeed: "holographic-membrane"},
  photonShearTransition: {...base, effectType: "photonShear", accentColor: "#ffe8b5", durationFrames: 30, randomSeed: "photon-shear"},
  plasmaVeilTransition: {...base, effectType: "plasmaVeil", durationFrames: 51, randomSeed: "plasma-veil"},
  neutrinoFlashRingTransition: {...base, effectType: "neutrinoFlashRing", durationFrames: 33, randomSeed: "neutrino-ring"},
  gravityLensTransition: {...base, effectType: "gravityLens", durationFrames: 60, randomSeed: "gravity-lens"},
  hyperplaneFlipTransition: {...base, effectType: "hyperplaneFlip", durationFrames: 48, randomSeed: "hyperplane-flip"},
  spatialSeamTransition: {...base, effectType: "spatialSeam", durationFrames: 54, randomSeed: "spatial-seam"},
  dataCellAuthorizationTransition: {...base, effectType: "dataCellAuthorization", primaryColor: "#69ff96", accentColor: "#ffbf69", durationFrames: 60, randomSeed: "data-cell"},
  neuralRouteTransition: {...base, effectType: "neuralRoute", durationFrames: 69, randomSeed: "neural-route"},
  coordinateRemapTransition: {...base, effectType: "coordinateRemap", durationFrames: 51, randomSeed: "coordinate-remap"},
};

export const defaultSciFiTransitionsProps = sciFiTransitionPatterns.lidarDepthGateTransition;
export const sciFiTransitionsDurationFrames = (props: SciFiTransitionsProps) =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1" ? 150 : props.durationFrames;
