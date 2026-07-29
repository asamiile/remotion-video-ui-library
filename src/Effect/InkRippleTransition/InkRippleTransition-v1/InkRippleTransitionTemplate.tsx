import React, { useId } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { InkRippleTransitionSchemaV1Type } from "./ink-ripple-transition.schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

export const InkRippleTransitionTemplateV1: React.FC<
  InkRippleTransitionSchemaV1Type
> = ({
  backgroundColor,
  ringColor,
  ringCount,
  ringStaggerFrames,
  ringDurationFrames,
  maxRadiusPercent,
  strokeWidthPx,
  roughness,
}) => {
  const frame = useCurrentFrame();
  const filterId = useId().replace(/:/g, "");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.02}
              numOctaves={2}
              seed={5}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {Array.from({ length: ringCount }).map((_, i) => {
          const startFrame = i * ringStaggerFrames;
          const localFrame = frame - startFrame;
          const progress = interpolate(
            localFrame,
            [0, ringDurationFrames],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            },
          );
          if (localFrame < 0) {
            return null;
          }
          const radiusPercent = maxRadiusPercent * progress;
          const opacity = interpolate(progress, [0, 0.15, 1], [0, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <circle
              key={i}
              cx="50%"
              cy="50%"
              r={`${radiusPercent}%`}
              fill="none"
              stroke={ringColor}
              strokeWidth={strokeWidthPx}
              opacity={opacity}
              filter={`url(#${filterId})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
