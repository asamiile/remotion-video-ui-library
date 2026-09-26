import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { auroraGlsl } from "./aurora.glsl";

export const AuroraTemplate: React.FC<ShaderBasicsSchemaType> = (props) => (
  <ShaderBasicsLayer {...props} fragmentShader={auroraGlsl} />
);
