import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const digitalFogShaderSchema = z.object({
  fogColor: zColor().default("#1abfa8"),
  particleColor: zColor().default("#93fff0"),
  layerCount: z.number().int().min(2).max(12).default(6),
  /** Approximate number of glowing motes */
  particleCount: z.number().int().min(0).max(200).default(60),
  opacity: z.number().min(0).max(1).default(0.5),
  /** Distance traveled through the fog per loop */
  drift: z.number().min(0).max(4).default(1.2),
  /** Full drift cycles per composition; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(6).default(1),
  randomSeed: z.number().int().min(0).max(999).default(11),
});

export type DigitalFogShaderSchemaType = z.infer<typeof digitalFogShaderSchema>;

export const digitalFogShaderDurationFrames = 600;

export const defaultDigitalFogShaderProps = {
  fogColor: "#1abfa8",
  particleColor: "#93fff0",
  layerCount: 6,
  particleCount: 60,
  opacity: 0.5,
  drift: 1.2,
  loopCycles: 1,
  randomSeed: 11,
} as const;

export const digitalFogShaderPatterns: Record<
  string,
  DigitalFogShaderSchemaType
> = {
  cyanDrift: { ...defaultDigitalFogShaderProps },
  emeraldDense: {
    ...defaultDigitalFogShaderProps,
    fogColor: "#18e57d",
    particleColor: "#d5ffe8",
    layerCount: 9,
    particleCount: 40,
    opacity: 0.65,
    drift: 0.8,
    randomSeed: 42,
  },
};
