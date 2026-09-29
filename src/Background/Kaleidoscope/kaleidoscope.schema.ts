import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as kaleidoscopeSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const kaleidoscopeDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-Kaleidoscope" ID.
export const kaleidoscopePatterns: Record<string, ShaderBasicsSchemaType> = {
  kaleidoscope: {
    ...shaderBasicsBase,
    backgroundColor: "#07060f",
    colorA: "#00d1b2",
    colorB: "#3a0ca3",
    colorC: "#f9f871",
  },
};
