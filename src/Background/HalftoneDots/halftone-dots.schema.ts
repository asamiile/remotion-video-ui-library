import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as halftoneDotsSchema } from "../../helpers/shader/background/shader-background.schema";

export const halftoneDotsDurationFrames = shaderBackgroundDurationFrames;

export const halftoneDotsPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "transparent",
    colorA: "#ff4f6d",
    colorB: "#ffd166",
    colorC: "#ffffff",
  },
};
