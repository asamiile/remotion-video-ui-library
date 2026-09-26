import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as synthGridSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const synthGridDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-SynthGrid" ID.
export const synthGridPatterns: Record<string, ShaderBasicsSchemaType> = {
  synthGrid: {
    ...shaderBasicsBase,
    backgroundColor: "#0a0418",
    colorA: "#ff2bd6",
    colorB: "#ffb347",
    colorC: "#ff4f8b",
  },
};
