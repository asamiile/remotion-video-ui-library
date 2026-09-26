import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { VolumetricSmokeLayer } from "../../../Background/VolumetricSmoke/VolumetricSmokeLayer";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import {
  volumetricSmokeTransitionAnimationDurationFrames,
  VolumetricSmokeTransitionSchemaType,
} from "./volumetric-smoke-transition.schema";

export const VolumetricSmokeTransitionTemplate: React.FC<
  VolumetricSmokeTransitionSchemaType
> = ({ backgroundColor, origin, travelDistance, ...look }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationStartFrame = Math.floor(
    (durationInFrames - volumetricSmokeTransitionAnimationDurationFrames) / 2,
  );
  const animationFrame = frame - animationStartFrame;
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (
    animationFrame < 0 ||
    animationFrame >= volumetricSmokeTransitionAnimationDurationFrames
  ) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }

  const progress =
    animationFrame / (volumetricSmokeTransitionAnimationDurationFrames - 1);
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;

  // Billow in → hold fully covered around the midpoint → clear.
  const coverage =
    progress < 0.5
      ? interpolate(progress, [0, 0.44], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(progress, [0.56, 1], [1, 0], {
          ...clamp,
          easing: Easing.in(Easing.cubic),
        });
  const fill = interpolate(coverage, [0.9, 1], [0, 1], clamp);
  const radialBias = (origin === "center" ? 1.4 : -1.4) * (1 - coverage);
  const travel = Easing.inOut(Easing.sin)(progress) * travelDistance;

  return (
    <AbsoluteFill>
      <VolumetricSmokeLayer
        {...look}
        backgroundColor={backdrop}
        coverage={coverage}
        radialBias={radialBias}
        fill={fill}
        flow={[0, travel * 0.25, -travel]}
        evolve={[travel * 0.4, 0, travel * 0.3]}
      />
    </AbsoluteFill>
  );
};
