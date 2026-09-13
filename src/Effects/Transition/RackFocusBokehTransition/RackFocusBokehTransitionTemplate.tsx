import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { RackFocusBokehTransitionSchemaType } from "./rack-focus-bokeh-transition.schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

export const RackFocusBokehTransitionTemplate: React.FC<
  RackFocusBokehTransitionSchemaType
> = ({
  backgroundColor,
  bokehColors,
  bokehCount,
  bokehMinSizePx,
  bokehMaxSizePx,
  blurMaxPx,
  rampFrames,
  holdFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const blurProgress = interpolate(
    frame,
    [0, rampFrames, rampFrames + holdFrames, rampFrames * 2 + holdFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  const bokehDots = useMemo(
    () =>
      Array.from({ length: bokehCount }).map((_, i) => {
        const leftPx = random(`${randomSeed}-x-${i}`) * width;
        const topPx = random(`${randomSeed}-y-${i}`) * height;
        const sizePx =
          bokehMinSizePx +
          random(`${randomSeed}-s-${i}`) * (bokehMaxSizePx - bokehMinSizePx);
        const color =
          bokehColors[
            Math.floor(random(`${randomSeed}-c-${i}`) * bokehColors.length)
          ];
        return { leftPx, topPx, sizePx, color };
      }),
    [bokehCount, bokehMinSizePx, bokehMaxSizePx, bokehColors, randomSeed, width, height],
  );

  // The blurred layer is padded well past the frame on all sides and clipped
  // by the outer, unblurred AbsoluteFill. Applying `filter: blur()` directly
  // to a viewport-filling element samples transparent page background past
  // its own edge, leaving a faint light border — padding it out avoids that.
  const overscanPx = blurMaxPx * 3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -overscanPx,
          filter: `blur(${blurProgress * blurMaxPx}px)`,
        }}
      >
        <AbsoluteFill
          style={{
            backgroundColor: resolveCompositionBackdropColor(backgroundColor),
          }}
        />
        {bokehDots.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: overscanPx + b.leftPx,
              top: overscanPx + b.topPx,
              width: b.sizePx,
              height: b.sizePx,
              borderRadius: "50%",
              backgroundColor: b.color,
              opacity: 0.5 * blurProgress,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
