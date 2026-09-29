import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const shaderSciFiOverlayTypes = [
  "plasmaEdgeArc",
  "volumetricLightScan",
  "energyContourLines",
] as const;

export const shaderSciFiOverlaySchema = z.object({
  effectType: z.enum(shaderSciFiOverlayTypes),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  opacity: z.number().min(0).max(1),
  intensity: z.number().min(0).max(2),
  density: z.number().min(0.25).max(2),
  /** Full animation cycles per composition; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(6),
  safeAreaPercent: z.number().min(0).max(20),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20); see loopCycles */
  durationSeconds: z.number().int().min(10).max(60).optional(),
});

export type ShaderSciFiOverlaySchemaType = z.infer<
  typeof shaderSciFiOverlaySchema
>;

export const shaderSciFiOverlayDurationFrames = (props: {
  durationSeconds?: number;
}) => (props.durationSeconds ?? 20) * 30;

const base = {
  primaryColor: "#37e9ff",
  secondaryColor: "#8b5cf6",
  accentColor: "#ff3ca6",
  opacity: 0.85,
  intensity: 1,
  density: 1,
  loopCycles: 1,
  safeAreaPercent: 5,
};

/** WebGL counterparts of the textless sci-fi overlays with the same names. */
export const shaderSciFiOverlayPatterns: Record<
  string,
  ShaderSciFiOverlaySchemaType
> = {
  plasmaEdgeArcShader: {
    ...base,
    effectType: "plasmaEdgeArc",
    intensity: 1.25,
    // One 10-second cycle: same motion as the former 2 cycles in 20 seconds, half the file size.
    loopCycles: 1,
    durationSeconds: 10,
    randomSeed: 3,
  },
  volumetricLightScanShader: {
    ...base,
    effectType: "volumetricLightScan",
    accentColor: "#ffffff",
    opacity: 0.75,
    randomSeed: 8,
  },
  energyContourLinesShader: {
    ...base,
    effectType: "energyContourLines",
    opacity: 0.8,
    randomSeed: 21,
  },
};
