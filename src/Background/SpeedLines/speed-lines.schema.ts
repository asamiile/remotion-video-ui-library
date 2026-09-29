import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as speedLinesSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const speedLinesDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-SpeedLines" ID.
export const speedLinesPatterns: Record<string, ShaderBasicsSchemaType> = {
  speedLines: {
    ...shaderBasicsBase,
    backgroundColor: "transparent",
    colorA: "#ffffff",
    colorB: "#cfe8ff",
    colorC: "#ffffff",
    intensity: 0.9,
  },
};
