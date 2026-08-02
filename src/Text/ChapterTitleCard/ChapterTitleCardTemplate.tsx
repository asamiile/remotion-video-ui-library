import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ChapterTitleCardSchemaType } from "./chapter-title-card.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const ChapterTitleCardTemplate: React.FC<
  ChapterTitleCardSchemaType
> = ({
  numberText,
  headingText,
  subtitleText,
  bandColor,
  headingColor,
  numberColor,
  subtitleColor,
  backgroundColor,
  fontFamily,
  numberFontFamily,
  fontSize,
  numberFontSize,
  subtitleFontSize,
  bandHeightPercent,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const popIn = useMemo(() => {
    if (popInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, popInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.6)),
    });
  }, [activeFrame, popInFrames]);

  const fade = interpolate(activeFrame, [0, Math.max(popInFrames, 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: `${bandHeightPercent}%`,
          transform: `translateY(-50%) scaleX(${popIn})`,
          transformOrigin: "left center",
          backgroundColor: bandColor,
          display: "flex",
          alignItems: "center",
          paddingLeft: "6%",
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            lineHeight: 1,
            color: headingColor,
            opacity: fade,
            whiteSpace: "nowrap",
          }}
        >
          {headingText}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: `calc(50% - ${bandHeightPercent / 2}% - ${numberFontSize * 0.55}px)`,
          left: "6%",
          fontFamily: numberFontFamily,
          fontWeight: 700,
          fontSize: numberFontSize,
          lineHeight: 1,
          color: numberColor,
          opacity: fade,
          transform: `translateY(${(1 - popIn) * 14}px)`,
        }}
      >
        {numberText}
      </div>

      <div
        style={{
          position: "absolute",
          top: `calc(50% + ${bandHeightPercent / 2}% + 20px)`,
          left: "6%",
          right: "6%",
          fontFamily,
          fontSize: subtitleFontSize,
          color: subtitleColor,
          opacity: fade,
        }}
      >
        {subtitleText}
      </div>
    </AbsoluteFill>
  );
};
