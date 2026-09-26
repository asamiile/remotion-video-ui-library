import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { halftoneDotsGlsl } from "./halftone-dots.glsl";

export const HalftoneDotsTemplate: React.FC<ShaderBasicsSchemaType> = (
  props,
) => <ShaderBasicsLayer {...props} fragmentShader={halftoneDotsGlsl} />;
