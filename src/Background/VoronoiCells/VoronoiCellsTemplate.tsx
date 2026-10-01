import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { voronoiCellsGlsl } from "./voronoi-cells.glsl";

export const VoronoiCellsTemplate: React.FC<ShaderBackgroundSchemaType> = (
  props,
) => <ShaderBackgroundLayer {...props} fragmentShader={voronoiCellsGlsl} />;
