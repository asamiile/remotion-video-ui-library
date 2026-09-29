import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { kaleidoscopeGlsl } from "./kaleidoscope.glsl";

export const KaleidoscopeTemplate: React.FC<ShaderBasicsSchemaType> = (
  props,
) => <ShaderBasicsLayer {...props} fragmentShader={kaleidoscopeGlsl} />;
