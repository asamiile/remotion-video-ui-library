import React from "react";
import { AbsoluteFill } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { suminagashiOverlayGlsl } from "./suminagashi.glsl";
import {
  suminagashiTransitionAnimationDurationFrames,
  type SuminagashiTransitionSchemaType,
} from "./suminagashi-transition.schema";

const useMarblingUniforms = (props: {
  ringFrequency: number;
  swirl: number;
  dropCount: number;
  randomSeed: number;
}) => {
  const timing = useCenteredTransition(
    suminagashiTransitionAnimationDurationFrames,
  );
  return {
    timing,
    uniforms: {
      uProgress: timing.progress,
      uPeak: timing.peak,
      uAnimTime: timing.animationTime,
      uRingFrequency: props.ringFrequency,
      uSwirl: props.swirl,
      uDropCount: props.dropCount,
      uSeed: props.randomSeed,
    },
  };
};

export const SuminagashiTransitionTemplate: React.FC<
  SuminagashiTransitionSchemaType
> = ({ backgroundColor, inkColor, ink2Color, ...marbling }) => {
  const { timing, uniforms } = useMarblingUniforms(marbling);
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!timing.active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={suminagashiOverlayGlsl}
        uniforms={{
          ...uniforms,
          uBackground: cssColorToVec4(backdrop),
          uInkColor: cssColorToVec3(inkColor),
          uInk2Color: cssColorToVec3(ink2Color),
        }}
      />
    </AbsoluteFill>
  );
};
