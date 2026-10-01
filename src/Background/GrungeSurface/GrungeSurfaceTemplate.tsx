import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { grungeSurfaceGlsl } from "./grunge-surface.glsl";
import {
  GRUNGE_SURFACE_STYLES,
  type GrungeSurfaceSchemaType,
} from "./grunge-surface.schema";

export const GrungeSurfaceTemplate: React.FC<GrungeSurfaceSchemaType> = ({
  style,
  ...basics
}) => (
  <ShaderBackgroundLayer
    {...basics}
    fragmentShader={grungeSurfaceGlsl}
    extraUniforms={{ uStyle: GRUNGE_SURFACE_STYLES.indexOf(style) }}
  />
);
