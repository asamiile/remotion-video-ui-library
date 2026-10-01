import React from "react";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { gradientGlsl } from "./gradient.glsl";
import {
  GRADIENT_STYLES,
  type GradientSchemaType,
} from "./gradient.schema";

export const GradientTemplate: React.FC<GradientSchemaType> = ({
  style,
  contrast,
  grain,
  vignette,
  ribbon,
  ribbon2,
  ribbon2Color,
  ...basics
}) => (
  <ShaderBackgroundLayer
    {...basics}
    fragmentShader={gradientGlsl}
    extraUniforms={{
      uStyle: GRADIENT_STYLES.indexOf(style),
      uContrast: contrast,
      uGrain: grain,
      uVignette: vignette,
      uRibbon: ribbon,
      uRibbon2: ribbon2,
      uRibbon2Color: cssColorToVec3(ribbon2Color),
    }}
  />
);
