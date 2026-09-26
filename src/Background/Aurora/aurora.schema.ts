import {
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as auroraSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const auroraDurationFrames = shaderBasicsDurationFrames;

export const auroraPatterns: Record<string, ShaderBasicsSchemaType> = {
  /** Green curtains fading to violet over a night sky */
  boreal: {
    backgroundColor: "#030713",
    colorA: "#35ff9a",
    colorB: "#8a4dff",
    colorC: "#1b6b8f",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 5,
  },
  /** Red-to-amber curtains with no backdrop */
  crimsonTransparent: {
    backgroundColor: "transparent",
    colorA: "#ff3b6b",
    colorB: "#ffb347",
    colorC: "#7a1c3a",
    scale: 1.2,
    intensity: 0.9,
    loopCycles: 1,
    randomSeed: 19,
  },
};
