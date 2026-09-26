import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { starfieldGlsl } from "./starfield.glsl";

export const StarfieldTemplate: React.FC<ShaderBasicsSchemaType> = (props) => (
  <ShaderBasicsLayer {...props} fragmentShader={starfieldGlsl} />
);
