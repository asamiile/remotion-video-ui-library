import React from "react";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { gradientFlowGlsl } from "./gradient-flow.glsl";
import {
  GRADIENT_FLOW_STYLES,
  type GradientFlowSchemaType,
} from "./gradient-flow.schema";

export const GradientFlowTemplate: React.FC<GradientFlowSchemaType> = ({
  style,
  contrast,
  grain,
  vignette,
  ribbon,
  specks,
  speckColor,
  ...basics
}) => (
  <ShaderBackgroundLayer
    {...basics}
    fragmentShader={gradientFlowGlsl}
    extraUniforms={{
      uStyle: GRADIENT_FLOW_STYLES.indexOf(style),
      uContrast: contrast,
      uGrain: grain,
      uVignette: vignette,
      uRibbon: ribbon,
      uSpecks: specks,
      uSpeckColor: cssColorToVec3(speckColor),
    }}
  />
);
