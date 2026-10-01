import {
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as auroraSchema } from "../../helpers/shader/background/shader-background.schema";

export const auroraDurationFrames = shaderBackgroundDurationFrames;

export const auroraPatterns: Record<string, ShaderBackgroundSchemaType> = {
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
