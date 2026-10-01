import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { kaleidoscopeGlsl } from "./kaleidoscope.glsl";

export const KaleidoscopeTemplate: React.FC<ShaderBackgroundSchemaType> = (
  props,
) => <ShaderBackgroundLayer {...props} fragmentShader={kaleidoscopeGlsl} />;
