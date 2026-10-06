import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildGuide } from "./composition-guide-geometry";
import type { CompositionGuideSchemaType } from "./composition-guide.schema";

/** Transparent viewfinder guide: only the lines are drawn. */
export const CompositionGuideTemplate: React.FC<CompositionGuideSchemaType> = (props) => {
  const {
    flipX,
    flipY,
    lineColor,
    lineOpacity,
    lineWidth,
    shadowOpacity,
    shadowColor,
    delayFrames,
    drawFrames,
    staggerFrames,
    outroFrames,
  } = props;
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const strokes = useMemo(() => buildGuide(props, width, height), [props, width, height]);

  const px = height / 1080;
  const outro =
    outroFrames > 0
      ? interpolate(frame, [durationInFrames - outroFrames, durationInFrames - 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const transform = `translate(${flipX ? width : 0},${flipY ? height : 0}) scale(${flipX ? -1 : 1},${flipY ? -1 : 1})`;

  return (
    <AbsoluteFill>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          opacity: lineOpacity * outro,
          filter:
            shadowOpacity > 0
              ? `drop-shadow(0 0 ${3 * px}px color-mix(in srgb, ${shadowColor} ${shadowOpacity * 100}%, transparent))`
              : undefined,
        }}
      >
        <g transform={transform}>
          {strokes.map((s, i) => {
            const start = delayFrames + s.order * staggerFrames;
            const length = s.long ? drawFrames * 2 : drawFrames;
            const drawn = interpolate(frame, [start, start + length], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            });
            return (
              <path
                key={i}
                d={s.d}
                fill="none"
                stroke={lineColor}
                strokeWidth={lineWidth * px}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - drawn}
                opacity={drawn > 0 ? 1 : 0}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
