import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { tornPaperOverlayGlsl } from "./torn-paper.glsl";
import {
  tornPaperTransitionAnimationDurationFrames,
  type TornPaperTransitionSchemaType,
} from "./torn-paper-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const TornPaperTransitionTemplate: React.FC<
  TornPaperTransitionSchemaType
> = ({ backgroundColor, paperColor, fiberColor, grimeColor, grime, randomSeed }) => {
  const timing = useCenteredTransition(tornPaperTransitionAnimationDurationFrames);
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!timing.active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  const { progress } = timing;
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={tornPaperOverlayGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uPaperColor: cssColorToVec3(paperColor),
          uFiberColor: cssColorToVec3(fiberColor),
          uGrimeColor: cssColorToVec3(grimeColor),
          uGrime: grime,
          uSeed: randomSeed,
          // Slide in → sealed through the midpoint → rip apart.
          uSlide: interpolate(progress, [0, 0.45], [0, 1], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          }),
          uSplit: interpolate(progress, [0.55, 1], [0, 1], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
