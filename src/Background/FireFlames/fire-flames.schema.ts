import {
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as fireFlamesSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const fireFlamesDurationFrames = shaderBasicsDurationFrames;

export const fireFlamesPatterns: Record<string, ShaderBasicsSchemaType> = {
  /** Orange flames along the bottom edge, no backdrop */
  blaze: {
    backgroundColor: "transparent",
    colorA: "#fff3b0",
    colorB: "#ff8c1a",
    colorC: "#b3160b",
    scale: 1,
    intensity: 1,
    loopCycles: 2,
    randomSeed: 6,
  },
  /** Cold blue flames, no backdrop */
  blueSpirit: {
    backgroundColor: "transparent",
    colorA: "#e8fbff",
    colorB: "#39b8ff",
    colorC: "#2a1a8f",
    scale: 1.3,
    intensity: 0.85,
    loopCycles: 2,
    randomSeed: 13,
  },
};
