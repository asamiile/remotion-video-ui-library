import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { dryBrushOverlayGlsl } from "./dry-brush.glsl";
import {
  dryBrushTransitionAnimationDurationFrames,
  type DryBrushTransitionSchemaType,
} from "./dry-brush-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const DryBrushTransitionTemplate: React.FC<
  DryBrushTransitionSchemaType
> = ({ backgroundColor, paintColor, strokeCount, dryness, randomSeed }) => {
  const timing = useCenteredTransition(
    dryBrushTransitionAnimationDurationFrames,
  );
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!timing.active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  const { progress } = timing;
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={dryBrushOverlayGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uPaintColor: cssColorToVec3(paintColor),
          uStrokeCount: strokeCount,
          uDryness: dryness,
          uSeed: randomSeed,
          // Paint in → sealed at the midpoint → wiped off.
          uPaint: interpolate(progress, [0, 0.46], [0, 1], clamp),
          uFill: interpolate(progress, [0.4, 0.48], [0, 1], clamp),
          uErase: interpolate(progress, [0.54, 1], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
