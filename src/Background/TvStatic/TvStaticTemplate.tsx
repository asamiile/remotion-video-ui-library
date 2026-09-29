import React from "react";
import { ShaderBasicsLayer } from "../../helpers/shader/basics/ShaderBasicsLayer";
import { tvStaticGlsl } from "./tv-static.glsl";
import type { TvStaticSchemaType } from "./tv-static.schema";

export const TvStaticTemplate: React.FC<TvStaticSchemaType> = ({
  curvature,
  phosphorMask,
  scanlines,
  trackingBand,
  signalBursts,
  verticalRoll,
  ...basics
}) => (
  <ShaderBasicsLayer
    {...basics}
    fragmentShader={tvStaticGlsl}
    extraUniforms={{
      uCurvature: curvature,
      uPhosphorMask: phosphorMask,
      uScanlines: scanlines,
      uTrackingBand: trackingBand,
      uSignalBursts: signalBursts,
      uVerticalRoll: verticalRoll,
    }}
  />
);
