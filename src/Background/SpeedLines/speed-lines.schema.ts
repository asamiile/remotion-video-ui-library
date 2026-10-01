import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as speedLinesSchema } from "../../helpers/shader/background/shader-background.schema";

export const speedLinesDurationFrames = shaderBackgroundDurationFrames;

export const speedLinesPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "transparent",
    colorA: "#ffffff",
    colorB: "#cfe8ff",
    colorC: "#ffffff",
    intensity: 0.9,
  },
};
