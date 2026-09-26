import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import type { ShaderBasicsSchemaType } from "../../helpers/shader/basics/shader-basics.schema";
import { synthGridGlsl } from "./synth-grid.glsl";

export const SynthGridTemplate: React.FC<ShaderBasicsSchemaType> = (props) => (
  <ShaderBasicsLayer {...props} fragmentShader={synthGridGlsl} />
);
