import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as synthGridSchema } from "../../helpers/shader/background/shader-background.schema";

export const synthGridDurationFrames = shaderBackgroundDurationFrames;

export const synthGridPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "#0a0418",
    colorA: "#ff2bd6",
    colorB: "#ffb347",
    colorC: "#ff4f8b",
  },
};
