import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { halftoneDotsGlsl } from "./halftone-dots.glsl";

export const HalftoneDotsTemplate: React.FC<ShaderBackgroundSchemaType> = (
  props,
) => <ShaderBackgroundLayer {...props} fragmentShader={halftoneDotsGlsl} />;
