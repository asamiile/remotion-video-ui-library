import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { TornNoteCaptionSchemaType } from "./torn-note-caption.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const TornNoteCaptionTemplate: React.FC<
  TornNoteCaptionSchemaType
> = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  paperColor,
  textColor,
  backgroundColor,
  rotationDeg,
  paddingPx,
  tornCornerPx,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const progress =
    popInFrames <= 0
      ? activeFrame >= 0
        ? 1
        : 0
      : interpolate(activeFrame, [0, popInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.back(1.8)),
        });

  const scale = 0.9 + 0.1 * progress;
  const opacity = interpolate(progress, [0, 0.4, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const c = tornCornerPx;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `rotate(${rotationDeg}deg) scale(${scale})`,
          backgroundColor: paperColor,
          padding: paddingPx,
          maxWidth: "70%",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          clipPath: `polygon(
            0 0,
            calc(100% - ${c}px) 0,
            100% ${c}px,
            100% 100%,
            ${c}px 100%,
            0 calc(100% - ${c}px)
          )`,
        }}
      >
        <p
          style={{
            margin: 0,
            padding: 0,
            fontFamily,
            fontWeight: fontWeight as string,
            fontSize,
            letterSpacing,
            lineHeight,
            color: textColor,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};
