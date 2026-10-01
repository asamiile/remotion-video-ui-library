import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { nebulaGlsl } from "./nebula.glsl";

export const NebulaTemplate: React.FC<ShaderBackgroundSchemaType> = (props) => (
  <ShaderBackgroundLayer {...props} fragmentShader={nebulaGlsl} />
);
