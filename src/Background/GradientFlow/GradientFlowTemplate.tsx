import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { gradientFlowGlsl } from "./gradient-flow.glsl";

export const GradientFlowTemplate: React.FC<ShaderBasicsSchemaType> = (
  props,
) => <ShaderBasicsLayer {...props} fragmentShader={gradientFlowGlsl} />;
