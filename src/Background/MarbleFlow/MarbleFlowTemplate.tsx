import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { marbleFlowGlsl } from "./marble-flow.glsl";
import { MARBLE_FLOW_MODES, type MarbleFlowSchemaType } from "./marble-flow.schema";

export const MarbleFlowTemplate: React.FC<MarbleFlowSchemaType> = ({
  flowMode,
  warp,
  veinDensity,
  clarity,
  ripple,
  rippleSources,
  rippleSpeed,
  ...basics
}) => (
  <ShaderBackgroundLayer
    {...basics}
    fragmentShader={marbleFlowGlsl}
    extraUniforms={{
      uFlowMode: MARBLE_FLOW_MODES.indexOf(flowMode),
      uWarp: warp,
      uVeinDensity: veinDensity,
      uClarity: clarity,
      uRipple: ripple,
      uRippleSources: rippleSources,
      uRippleSpeed: rippleSpeed,
    }}
  />
);
