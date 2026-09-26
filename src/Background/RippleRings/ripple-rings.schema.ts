import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as rippleRingsSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const rippleRingsDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-RippleRings" ID.
export const rippleRingsPatterns: Record<string, ShaderBasicsSchemaType> = {
  rippleRings: {
    ...shaderBasicsBase,
    backgroundColor: "transparent",
    colorA: "#5fd4ff",
    colorB: "#2a6cff",
    colorC: "#ffffff",
  },
};
