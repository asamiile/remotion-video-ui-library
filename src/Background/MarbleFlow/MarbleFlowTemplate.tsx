import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { marbleFlowGlsl } from "./marble-flow.glsl";

export const MarbleFlowTemplate: React.FC<ShaderBasicsSchemaType> = (props) => (
  <ShaderBasicsLayer {...props} fragmentShader={marbleFlowGlsl} />
);
