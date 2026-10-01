import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
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
  <ShaderBackgroundLayer
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
