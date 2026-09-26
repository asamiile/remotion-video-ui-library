import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/** Props shared by the basic-technique shader backgrounds. */
export const shaderBasicsSchema = z.object({
  /** "transparent" draws only the effect, for layering over footage */
  backgroundColor: zColor(),
  colorA: zColor(),
  colorB: zColor(),
  /** Accent: highlights, glints, cell walls, the sun */
  colorC: zColor(),
  /** Pattern size; larger = more repetitions */
  scale: z.number().min(0.25).max(4),
  intensity: z.number().min(0).max(2),
  /** Full animation cycles per composition; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(6),
  randomSeed: z.number().int().min(0).max(999),
});

export type ShaderBasicsSchemaType = z.infer<typeof shaderBasicsSchema>;

export const shaderBasicsDurationFrames = 600;

/** Defaults shared by every basic-technique pattern. */
export const shaderBasicsBase = {
  scale: 1,
  intensity: 1,
  loopCycles: 1,
  randomSeed: 7,
};
