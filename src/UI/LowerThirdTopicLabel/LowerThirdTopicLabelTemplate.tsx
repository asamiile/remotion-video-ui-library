import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LowerThirdTopicLabelSchemaType } from "./lower-third-topic-label.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const LowerThirdTopicLabelTemplate: React.FC<
  LowerThirdTopicLabelSchemaType
> = ({
  labelText,
  captionText,
  fontFamily,
  labelFontSize,
  captionFontSize,
  labelBgColor,
  labelTextColor,
  captionBarColor,
  captionTextColor,
  backgroundColor,
  slideInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const progress = useMemo(() => {
    if (slideInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, slideInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, slideInFrames]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          padding: "6px 18px",
          borderRadius: 999,
          backgroundColor: labelBgColor,
          opacity: progress,
          transform: `translateX(${(1 - progress) * -20}px)`,
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: labelFontSize,
            letterSpacing: "0.08em",
            color: labelTextColor,
          }}
        >
          {labelText}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "20px 5%",
          backgroundColor: captionBarColor as string,
          opacity: progress,
          transform: `translateY(${(1 - progress) * 20}px)`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: captionFontSize,
            color: captionTextColor,
            lineHeight: 1.4,
          }}
        >
          {captionText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
