import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cssColorToVec3, cssColorToVec4 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { inkBleedFragmentShader } from "./ink-bleed.glsl";
import {
  inkBleedTransitionAnimationDurationFrames,
  InkBleedTransitionSchemaType,
} from "./ink-bleed-transition.schema";

export const InkBleedTransitionTemplate: React.FC<
  InkBleedTransitionSchemaType
> = ({
  backgroundColor,
  inkColor,
  rimColor,
  rimStrength,
  seedCount,
  spread,
  stagger,
  warp,
  fringe,
  granulation,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const animationStartFrame = Math.floor(
    (durationInFrames - inkBleedTransitionAnimationDurationFrames) / 2,
  );
  const animationFrame = frame - animationStartFrame;
  const backdrop = resolveCompositionBackdropColor(backgroundColor);

  if (
    animationFrame < 0 ||
    animationFrame >= inkBleedTransitionAnimationDurationFrames
  ) {
    return <AbsoluteFill style={{ backgroundColor: backdrop }} />;
  }

  const progress =
    animationFrame / (inkBleedTransitionAnimationDurationFrames - 1);
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;

  // Spread → hold fully covered → bleed open.
  const grow = interpolate(progress, [0, 0.5], [0, 1], clamp);
  // Kept at 1 through the reveal so uncovered corners never pop back in;
  // the holes alone decide what opens.
  const fill = interpolate(progress, [0.42, 0.5], [0, 1], clamp);
  const reveal = interpolate(progress, [0.56, 1], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={inkBleedFragmentShader}
        uniforms={{
          uBackground: cssColorToVec4(backdrop),
          uInkColor: cssColorToVec3(inkColor),
          uRimColor: cssColorToVec3(rimColor),
          uGrow: grow,
          uReveal: reveal,
          uFill: fill,
          uSeedCount: seedCount,
          uSpread: spread,
          uStagger: stagger,
          uSeed: randomSeed,
          uWarp: warp,
          uFringe: fringe,
          uGranulation: granulation,
          uRimStrength: rimStrength,
        }}
      />
    </AbsoluteFill>
  );
};
