import {
  shaderBasicsBase,
  shaderBasicsDurationFrames,
  type ShaderBasicsSchemaType,
} from "../../helpers/shader/basics/shader-basics.schema";

export { shaderBasicsSchema as voronoiCellsSchema } from "../../helpers/shader/basics/shader-basics.schema";

export const voronoiCellsDurationFrames = shaderBasicsDurationFrames;

// The pattern key keeps the original "Background-ShaderBasics-VoronoiCells" ID.
export const voronoiCellsPatterns: Record<string, ShaderBasicsSchemaType> = {
  voronoiCells: {
    ...shaderBasicsBase,
    backgroundColor: "#050a10",
    colorA: "#0f3b57",
    colorB: "#1f7a8c",
    colorC: "#7df9ff",
  },
};
