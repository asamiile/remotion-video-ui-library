import {
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as nebulaSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const nebulaDurationFrames = shaderBasicsDurationFrames;

export const nebulaPatterns: Record<string, ShaderBasicsSchemaType> = {
  /** Magenta and violet gas with a warm core */
  crimson: {
    backgroundColor: "#04030a",
    colorA: "#ff3d6e",
    colorB: "#5b2bd6",
    colorC: "#ffd9a8",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 7,
  },
  /** Blue and teal gas with a white core */
  azure: {
    backgroundColor: "#02060d",
    colorA: "#2fa8ff",
    colorB: "#20d6b5",
    colorC: "#e8f6ff",
    scale: 1.2,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 33,
  },
};
