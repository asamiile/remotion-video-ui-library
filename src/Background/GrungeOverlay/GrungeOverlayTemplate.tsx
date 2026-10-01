import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { grungeOverlayGlsl } from "./grunge-overlay.glsl";
import {
  GRUNGE_OVERLAY_STYLES,
  type GrungeOverlaySchemaType,
} from "./grunge-overlay.schema";

/** Transparent grunge texture: only the marks are opaque. */
export const GrungeOverlayTemplate: React.FC<GrungeOverlaySchemaType> = ({
  style,
  color,
  color2,
  density,
  size,
  holdFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Re-roll every holdFrames, wrapping with the composition so it loops.
  const steps = Math.max(1, Math.floor(durationInFrames / holdFrames));
  const jitter = Math.floor(frame / holdFrames) % steps;

  return (
    <ShaderBackgroundLayer
      backgroundColor="transparent"
      colorA={color}
      colorB={color2}
      colorC={color}
      scale={1}
      intensity={1}
      loopCycles={1}
      randomSeed={randomSeed}
      fragmentShader={grungeOverlayGlsl}
      extraUniforms={{
        uStyle: GRUNGE_OVERLAY_STYLES.indexOf(style),
        uDensity: density,
        uSize: size,
        uJitter: jitter,
      }}
    />
  );
};
