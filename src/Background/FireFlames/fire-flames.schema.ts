import {
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as fireFlamesSchema } from "../../helpers/shader/background/shader-background.schema";

export const fireFlamesDurationFrames = shaderBackgroundDurationFrames;

export const fireFlamesPatterns: Record<string, ShaderBackgroundSchemaType> = {
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
