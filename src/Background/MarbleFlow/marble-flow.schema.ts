import {
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as marbleFlowSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const marbleFlowDurationFrames = shaderBasicsDurationFrames;

export const marbleFlowPatterns: Record<string, ShaderBasicsSchemaType> = {
  /** Deep sea blues with pearl swirls */
  ocean: {
    backgroundColor: "#000000",
    colorA: "#06263d",
    colorB: "#2ec4d6",
    colorC: "#f4f1e8",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 2,
  },
  /** Plum, coral and gold */
  sunset: {
    backgroundColor: "#000000",
    colorA: "#2b0a3d",
    colorB: "#ff7849",
    colorC: "#ffd166",
    scale: 1.2,
    intensity: 0.8,
    loopCycles: 1,
    randomSeed: 27,
  },
};
