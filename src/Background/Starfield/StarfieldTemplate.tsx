import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { starfieldGlsl } from "./starfield.glsl";

export const StarfieldTemplate: React.FC<ShaderBackgroundSchemaType> = (props) => (
  <ShaderBackgroundLayer {...props} fragmentShader={starfieldGlsl} />
);
