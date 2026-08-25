import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const sciFiOverlayTypes = [
  "tacticalScan",
  "signalInterference",
  "dataAcquisitionLines",
  "holographicNoise",
  "reticleTracking",
  "cinematicDiagnosticFrame",
  "volumetricGrid",
  "digitalDebris",
  "biometricScan",
  "quantumParticle",
] as const;

export const sciFiOverlaySchema = z.object({
  effectType: z.enum(sciFiOverlayTypes),
  primaryColor: zColor().default("#37e9ff"),
  secondaryColor: zColor().default("#ff3d9e"),
  opacity: z.number().min(0).max(1).default(0.8),
  intensity: z.number().min(0).max(2).default(1),
  density: z.number().min(0.1).max(2).default(1),
  speed: z.number().min(0.1).max(4).default(1),
  initialDelayFrames: z.number().int().min(0).default(0),
  activeDurationFrames: z.number().int().min(1).default(300),
  fadeInFrames: z.number().int().min(0).default(10),
  fadeOutFrames: z.number().int().min(0).default(10),
  safeAreaPercent: z.number().min(0).max(30).default(5),
  randomSeed: z.string().default("sci-fi-overlay"),
});

export type SciFiOverlaySchemaType = z.infer<typeof sciFiOverlaySchema>;
export const sciFiOverlayDurationFrames = 300;

const base = {
  primaryColor: "#37e9ff",
  secondaryColor: "#ff3d9e",
  opacity: 0.8,
  intensity: 1,
  density: 1,
  speed: 1,
  initialDelayFrames: 0,
  activeDurationFrames: 300,
  fadeInFrames: 10,
  fadeOutFrames: 10,
  safeAreaPercent: 5,
} as const;

export const sciFiOverlayPatterns: Record<string, SciFiOverlaySchemaType> = {
  tacticalScanOverlay: {...base, effectType: "tacticalScan", randomSeed: "tactical-scan"},
  signalInterferenceOverlay: {...base, effectType: "signalInterference", intensity: 1.25, randomSeed: "signal-interference"},
  dataAcquisitionLines: {...base, effectType: "dataAcquisitionLines", randomSeed: "data-acquisition"},
  holographicNoiseOverlay: {...base, effectType: "holographicNoise", opacity: 0.68, randomSeed: "holographic-noise"},
  reticleTrackingOverlay: {...base, effectType: "reticleTracking", randomSeed: "reticle-tracking"},
  cinematicDiagnosticFrame: {...base, effectType: "cinematicDiagnosticFrame", opacity: 0.72, randomSeed: "diagnostic-frame"},
  volumetricGridOverlay: {...base, effectType: "volumetricGrid", opacity: 0.55, randomSeed: "volumetric-grid"},
  digitalDebrisOverlay: {...base, effectType: "digitalDebris", density: 1.2, speed: 1.4, randomSeed: "digital-debris"},
  biometricScanOverlay: {...base, effectType: "biometricScan", randomSeed: "biometric-scan"},
  quantumParticleOverlay: {...base, effectType: "quantumParticle", primaryColor: "#a78bfa", secondaryColor: "#37e9ff", opacity: 0.65, randomSeed: "quantum-particle"},
};
