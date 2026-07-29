import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { EmblemMontageBlurSchemaType } from "./emblem-montage-blur.schema";

/** A simple 5-point star, as a clip-path polygon (percentages of its own box) */
const STAR_CLIP_PATH =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

export const EmblemMontageBlurTemplateV1: React.FC<
  EmblemMontageBlurSchemaType
> = ({
  emblemCount,
  colors,
  sizeMinPx,
  sizeMaxPx,
  blurMinPx,
  blurMaxPx,
  fadeInFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();

  const fade =
    fadeInFrames <= 0
      ? 1
      : interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        });

  const emblems = useMemo(
    () =>
      Array.from({ length: emblemCount }).map((_, i) => {
        const leftPercent = 10 + random(`${randomSeed}-x-${i}`) * 80;
        const topPercent = 10 + random(`${randomSeed}-y-${i}`) * 80;
        const sizePx =
          sizeMinPx + random(`${randomSeed}-s-${i}`) * (sizeMaxPx - sizeMinPx);
        const blurPx =
          blurMinPx + random(`${randomSeed}-b-${i}`) * (blurMaxPx - blurMinPx);
        const color =
          colors[Math.floor(random(`${randomSeed}-c-${i}`) * colors.length)];
        const isStar = i % 2 === 1;
        const ringWidthPx = Math.max(2, sizePx * 0.06);
        const opacity = 0.5 + random(`${randomSeed}-o-${i}`) * 0.5;
        return {
          leftPercent,
          topPercent,
          sizePx,
          blurPx,
          color,
          isStar,
          ringWidthPx,
          opacity,
        };
      }),
    [emblemCount, colors, sizeMinPx, sizeMaxPx, blurMinPx, blurMaxPx, randomSeed],
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {emblems.map((e, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${e.leftPercent}%`,
            top: `${e.topPercent}%`,
            width: e.sizePx,
            height: e.sizePx,
            transform: "translate(-50%, -50%)",
            filter: `blur(${e.blurPx}px)`,
            opacity: e.opacity * fade,
            ...(e.isStar
              ? { backgroundColor: e.color, clipPath: STAR_CLIP_PATH }
              : {
                  borderRadius: "50%",
                  border: `${e.ringWidthPx}px solid ${e.color}`,
                }),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
