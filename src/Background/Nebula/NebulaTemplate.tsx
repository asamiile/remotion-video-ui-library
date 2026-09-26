import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { nebulaGlsl } from "./nebula.glsl";

export const NebulaTemplate: React.FC<ShaderBasicsSchemaType> = (props) => (
  <ShaderBasicsLayer {...props} fragmentShader={nebulaGlsl} />
);
