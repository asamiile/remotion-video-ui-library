import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as halftoneDotsSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const halftoneDotsDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-HalftoneDots" ID.
export const halftoneDotsPatterns: Record<string, ShaderBasicsSchemaType> = {
  halftoneDots: {
    ...shaderBasicsBase,
    backgroundColor: "transparent",
    colorA: "#ff4f6d",
    colorB: "#ffd166",
    colorC: "#ffffff",
  },
};
