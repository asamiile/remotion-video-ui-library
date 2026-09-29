import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as gradientFlowSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const gradientFlowDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-GradientFlow" ID.
export const gradientFlowPatterns: Record<string, ShaderBasicsSchemaType> = {
  gradientFlow: {
    ...shaderBasicsBase,
    backgroundColor: "#000000",
    colorA: "#1b1f5e",
    colorB: "#6a2c91",
    colorC: "#ff7a59",
  },
};
