import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { waterRippleOverlayGlsl } from "./water-ripple.glsl";
import {
  waterRippleTransitionAnimationDurationFrames,
  type WaterRippleTransitionSchemaType,
} from "./water-ripple-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const WaterRippleTransitionTemplate: React.FC<
  WaterRippleTransitionSchemaType
> = ({
  backgroundColor,
  waterColor,
  highlightColor,
  frequency,
  amplitude,
  dropCount,
  randomSeed,
}) => {
  const timing = useCenteredTransition(
    waterRippleTransitionAnimationDurationFrames,
  );
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!timing.active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  const { progress } = timing;
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={waterRippleOverlayGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uWaterColor: cssColorToVec3(waterColor),
          uHighlightColor: cssColorToVec3(highlightColor),
          uFrequency: frequency,
          uAmplitude: amplitude,
          uDropCount: dropCount,
          uSeed: randomSeed,
          // The flood front reaches the corners at ~0.82 of its life.
          uFlood: interpolate(progress, [0, 0.5], [0, 1], clamp),
          uFill: interpolate(progress, [0.4, 0.5], [0, 1], clamp),
          uDrain: interpolate(progress, [0.5, 1], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
