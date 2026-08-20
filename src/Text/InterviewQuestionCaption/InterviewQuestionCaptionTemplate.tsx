import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { InterviewQuestionCaptionSchemaType } from "./interview-question-caption.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const InterviewQuestionCaptionTemplate: React.FC<
  InterviewQuestionCaptionSchemaType
> = ({
  questionText,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  outlineColor,
  footagePlaceholderColor,
  verticalPositionPercent,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const progress = useMemo(() => {
    if (popInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, popInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.4)),
    });
  }, [activeFrame, popInFrames]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(
          footagePlaceholderColor,
        ),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: `${verticalPositionPercent}%`,
          left: "50%",
          transform: `translate(-50%, -50%) scale(${0.9 + progress * 0.1})`,
          opacity: progress,
          maxWidth: "84%",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            letterSpacing,
            color: textColor,
            textShadow: `-2px -2px 0 ${outlineColor}, 2px -2px 0 ${outlineColor}, -2px 2px 0 ${outlineColor}, 2px 2px 0 ${outlineColor}, 0 0 18px ${outlineColor}88`,
          }}
        >
          {questionText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
