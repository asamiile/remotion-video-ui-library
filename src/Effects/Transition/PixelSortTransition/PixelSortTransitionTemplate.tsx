import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { pixelSortGlsl } from "./pixel-sort.glsl";
import {
  pixelSortTransitionAnimationDurationFrames,
  type PixelSortTransitionSchemaType,
} from "./pixel-sort-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const PixelSortTransitionTemplate: React.FC<
  PixelSortTransitionSchemaType
> = ({ backgroundColor, colorA, colorB, colorC, columnWidth, randomSeed }) => {
  const { active, progress } = useCenteredTransition(
    pixelSortTransitionAnimationDurationFrames,
  );

  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={pixelSortGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uColorA: cssColorToVec3(colorA),
          uColorB: cssColorToVec3(colorB),
          uColorC: cssColorToVec3(colorC),
          uProgress: progress,
          uFill: interpolate(progress, [0.44, 0.5], [0, 1], clamp),
          uColumnWidth: columnWidth,
          uSeed: randomSeed,
        }}
      />
    </AbsoluteFill>
  );
};
