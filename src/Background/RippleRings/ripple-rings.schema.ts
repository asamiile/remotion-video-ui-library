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
  coral: { ...shaderBackgroundBase, backgroundColor: "transparent", colorA: "#F98362", colorB: "#F98362", colorC: "#ffffff" },
  sky: { ...shaderBackgroundBase, backgroundColor: "transparent", colorA: "#61CCF9", colorB: "#61CCF9", colorC: "#ffffff" },
  white: { ...shaderBackgroundBase, backgroundColor: "transparent", colorA: "#ffffff", colorB: "#ffffff", colorC: "#ffffff" },
};
