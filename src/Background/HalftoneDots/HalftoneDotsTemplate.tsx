import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { halftoneDotsGlsl } from "./halftone-dots.glsl";
import {
  HALFTONE_FIELDS,
  HALFTONE_SHAPES,
  halftonePalettes,
  type HalftoneDotsSchemaType,
} from "./halftone-dots.schema";

export const HalftoneDotsTemplate: React.FC<HalftoneDotsSchemaType> = ({
  field = "sweep",
  shape = "dot",
  palette = "custom",
  ...props
}) => (
  <ShaderBackgroundLayer
    {...props}
    {...(palette === "custom" ? {} : halftonePalettes[palette])}
    fragmentShader={halftoneDotsGlsl}
    extraUniforms={{
      uField: HALFTONE_FIELDS.indexOf(field),
      uShape: HALFTONE_SHAPES.indexOf(shape),
    }}
  />
);
