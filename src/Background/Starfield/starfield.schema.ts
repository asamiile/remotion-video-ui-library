import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as starfieldSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const starfieldDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-Starfield" ID.
export const starfieldPatterns: Record<string, ShaderBasicsSchemaType> = {
  starfield: {
    ...shaderBasicsBase,
    backgroundColor: "transparent",
    colorA: "#ffffff",
    colorB: "#9ecbff",
    colorC: "#ffe29a",
  },
};
