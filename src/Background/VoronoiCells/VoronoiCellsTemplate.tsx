import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { voronoiCellsGlsl } from "./voronoi-cells.glsl";

export const VoronoiCellsTemplate: React.FC<ShaderBasicsSchemaType> = (
  props,
) => <ShaderBasicsLayer {...props} fragmentShader={voronoiCellsGlsl} />;
