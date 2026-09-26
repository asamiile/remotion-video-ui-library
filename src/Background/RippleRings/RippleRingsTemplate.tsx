import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { rippleRingsGlsl } from "./ripple-rings.glsl";

export const RippleRingsTemplate: React.FC<ShaderBasicsSchemaType> = (
  props,
) => <ShaderBasicsLayer {...props} fragmentShader={rippleRingsGlsl} />;
