import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { useCenteredTransition } from "../../../helpers/shader/transition-timing";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { crtPowerOffGlsl } from "./crt-power-off.glsl";
import {
  crtPowerOffTransitionAnimationDurationFrames,
  type CrtPowerOffTransitionSchemaType,
} from "./crt-power-off-transition.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const CrtPowerOffTransitionTemplate: React.FC<
  CrtPowerOffTransitionSchemaType
> = ({ backgroundColor, colorA, colorB, scanlines }) => {
  const { active, progress } = useCenteredTransition(
    crtPowerOffTransitionAnimationDurationFrames,
  );

  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (!active) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }
  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={crtPowerOffGlsl}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uGlowColor: cssColorToVec3(colorA),
          uTubeColor: cssColorToVec3(colorB),
          uScanlines: scanlines,
          // Off during the first half, black at the midpoint, back on after.
          uOff:
            progress <= 0.5
              ? interpolate(progress, [0, 0.46], [0, 1], clamp)
              : interpolate(progress, [0.54, 1], [1, 0], {
                  ...clamp,
                  easing: Easing.out(Easing.back(1.4)),
                }),
        }}
      />
    </AbsoluteFill>
  );
};
