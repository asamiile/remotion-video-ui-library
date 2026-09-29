import {
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as causticsSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const causticsDurationFrames = shaderBasicsDurationFrames;

export const causticsPatterns: Record<string, ShaderBasicsSchemaType> = {
  /** Sunlight dancing on a pool floor */
  pool: {
    backgroundColor: "#0a4a6b",
    colorA: "#d8fbff",
    colorB: "#0b5f85",
    colorC: "#6fe3ff",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 4,
  },
  /** Only the light, for layering over footage */
  lightTransparent: {
    backgroundColor: "transparent",
    colorA: "#e6fdff",
    colorB: "#0b5f85",
    colorC: "#6fe3ff",
    scale: 1.2,
    intensity: 0.8,
    loopCycles: 1,
    randomSeed: 11,
  },
};
