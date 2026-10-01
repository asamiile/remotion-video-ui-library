import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { halftoneOverlayGlsl } from "./halftone-overlay.glsl";
import {
  HALFTONE_OVERLAY_SHAPES,
  type HalftoneOverlaySchemaType,
} from "./halftone-overlay.schema";

/** Transparent halftone texture: only the ink marks are opaque. */
export const HalftoneOverlayTemplate: React.FC<HalftoneOverlaySchemaType> = ({
  color,
  shape,
  cellPx,
  angle,
  coverage,
  variation,
  edgeFade,
  driftCells,
  randomSeed,
}) => (
  <ShaderBackgroundLayer
    backgroundColor="transparent"
    colorA={color}
    colorB={color}
    colorC={color}
    scale={1}
    intensity={1}
    loopCycles={1}
    randomSeed={randomSeed}
    fragmentShader={halftoneOverlayGlsl}
    extraUniforms={{
      uCellPx: cellPx,
      uAngle: angle,
      uCoverage: coverage,
      uVariation: variation,
      uEdgeFade: edgeFade,
      uDriftCells: driftCells,
      uShape: HALFTONE_OVERLAY_SHAPES.indexOf(shape),
    }}
  />
);
