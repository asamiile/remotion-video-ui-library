import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { auroraGlsl } from "./aurora.glsl";

export const AuroraTemplate: React.FC<ShaderBackgroundSchemaType> = (props) => (
  <ShaderBackgroundLayer {...props} fragmentShader={auroraGlsl} />
);
