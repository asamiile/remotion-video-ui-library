import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as rippleRingsSchema } from "../../helpers/shader/background/shader-background.schema";

export const rippleRingsDurationFrames = shaderBackgroundDurationFrames;

export const rippleRingsPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "transparent",
    colorA: "#5fd4ff",
    colorB: "#2a6cff",
    colorC: "#ffffff",
  },
};
