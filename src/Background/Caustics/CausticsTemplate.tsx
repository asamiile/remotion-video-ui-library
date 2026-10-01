import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { causticsGlsl } from "./caustics.glsl";

export const CausticsTemplate: React.FC<ShaderBackgroundSchemaType> = (props) => (
  <ShaderBackgroundLayer {...props} fragmentShader={causticsGlsl} />
);
