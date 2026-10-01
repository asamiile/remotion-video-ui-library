import React from "react";
import { AbsoluteFill } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { grungeTransitionGlsl } from "./grunge-transition.glsl";
import {
  GRUNGE_TRANSITION_MODES,
  grungeTransitionAnimationDurationFrames,
  type GrungeTransitionSchemaType,
} from "./grunge-transition.schema";

export const GrungeTransitionTemplate: React.FC<GrungeTransitionSchemaType> = ({
  backgroundColor,
  mode,
  colorA,
  colorB,
  colorC,
  randomSeed,
}) => {
  const timing = useCenteredTransition(grungeTransitionAnimationDurationFrames);
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!timing.active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={grungeTransitionGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uColorA: cssColorToVec3(colorA),
          uColorB: cssColorToVec3(colorB),
          uColorC: cssColorToVec3(colorC),
          uMode: GRUNGE_TRANSITION_MODES.indexOf(mode),
          uProgress: timing.progress,
          uSeed: randomSeed,
        }}
      />
    </AbsoluteFill>
  );
};
