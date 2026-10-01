import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { fireFlamesGlsl } from "./fire-flames.glsl";

export const FireFlamesTemplate: React.FC<ShaderBackgroundSchemaType> = (props) => (
  <ShaderBackgroundLayer {...props} fragmentShader={fireFlamesGlsl} />
);
