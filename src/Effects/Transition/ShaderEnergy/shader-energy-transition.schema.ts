import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const shaderEnergyTransitionTypes = [
  "plasmaVeil",
  "quantumDustTunnel",
] as const;

export const shaderEnergyTransitionSchema = z.object({
  effectType: z.enum(shaderEnergyTransitionTypes),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  intensity: z.number().min(0.1).max(2),
  density: z.number().min(0.25).max(2),
  randomSeed: z.number().int().min(0).max(999),
  durationFrames: z.number().int().min(20).max(120),
});

export type ShaderEnergyTransitionSchemaType = z.infer<
  typeof shaderEnergyTransitionSchema
>;

const base = {
  primaryColor: "#37e9ff",
  secondaryColor: "#8b5cf6",
  accentColor: "#ffffff",
  intensity: 1,
  density: 1,
};

/** WebGL counterparts of the SVG sci-fi transitions with the same names. */
export const shaderEnergyTransitionPatterns: Record<
  string,
  ShaderEnergyTransitionSchemaType
> = {
  plasmaVeilShaderTransition: {
    ...base,
    effectType: "plasmaVeil",
    durationFrames: 51,
    randomSeed: 17,
  },
  quantumDustTunnelShaderTransition: {
    ...base,
    effectType: "quantumDustTunnel",
    accentColor: "#ffd36b",
    durationFrames: 60,
    randomSeed: 5,
  },
};

export const shaderEnergyTransitionDurationFrames = (
  props: ShaderEnergyTransitionSchemaType,
) =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1" ? 150 : props.durationFrames;
