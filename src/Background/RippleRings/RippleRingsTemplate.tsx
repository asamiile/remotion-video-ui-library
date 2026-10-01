import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import type { ShaderBackgroundSchemaType } from "../../helpers/shader/background/shader-background.schema";
import { rippleRingsGlsl } from "./ripple-rings.glsl";

export const RippleRingsTemplate: React.FC<ShaderBackgroundSchemaType> = (
  props,
) => <ShaderBackgroundLayer {...props} fragmentShader={rippleRingsGlsl} />;
