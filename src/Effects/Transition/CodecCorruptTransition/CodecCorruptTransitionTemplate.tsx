import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { codecCorruptGlsl } from "./codec-corrupt.glsl";
import {
  codecCorruptTransitionAnimationDurationFrames,
  type CodecCorruptTransitionSchemaType,
} from "./codec-corrupt-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CodecCorruptTransitionTemplate: React.FC<
  CodecCorruptTransitionSchemaType
> = ({ backgroundColor, colorA, colorB, colorC, blockSize, randomSeed }) => {
  const { active, progress, animationTime } = useCenteredTransition(
    codecCorruptTransitionAnimationDurationFrames,
  );
  const { fps } = useVideoConfig();
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={codecCorruptGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uColorA: cssColorToVec3(colorA),
          uColorB: cssColorToVec3(colorB),
          uColorC: cssColorToVec3(colorC),
          uProgress: progress,
          uFill: interpolate(progress, [0.44, 0.5], [0, 1], clamp),
          uStep: Math.floor((animationTime * fps) / 2),
          uBlockSize: blockSize,
          uSeed: randomSeed,
        }}
      />
    </AbsoluteFill>
  );
};
