import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  type ShaderBackgroundSchemaType,
} from "../../helpers/shader/background/shader-background.schema";

export { shaderBackgroundSchema as voronoiCellsSchema } from "../../helpers/shader/background/shader-background.schema";

export const voronoiCellsDurationFrames = shaderBackgroundDurationFrames;

export const voronoiCellsPatterns: Record<string, ShaderBackgroundSchemaType> = {
  classic: {
    ...shaderBackgroundBase,
    backgroundColor: "#050a10",
    colorA: "#0f3b57",
    colorB: "#1f7a8c",
    colorC: "#7df9ff",
  },
};
