import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { TypewriterTextSchemaType } from "./typewriter-text.schema";
import "../../helpers/jetbrains-mono";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const TypewriterTextTemplate: React.FC<TypewriterTextSchemaType> = (
  props,
) => {
  const frame = useCurrentFrame();
  const {
    text,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    textColor,
    cursorColor,
    typingStartFrame,
    typingDurationFrames,
    cursorChar,
    cursorGapEm,
    cursorHeightEm,
    cursorWidthEm,
    cursorVerticalAlignEm,
    cursorBlinkPeriodFrames,
    showCursorAfterComplete,
    fadeInDuration,
    delayFrames,
    paddingLeftPercent,
    paddingBottomPercent,
    backgroundColor,
  } = props;

  const activeFrame = frame - delayFrames;

  const mountFade = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInDuration]);

  const len = text.length;
  const charProgress = interpolate(
    activeFrame,
    [typingStartFrame, typingStartFrame + typingDurationFrames],
    [0, len],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const visibleCount = len === 0 ? 0 : Math.min(len, Math.floor(charProgress));
  const visibleText = text.slice(0, visibleCount);
  const typingDone = visibleCount >= len;

  const cursorVisible =
    (showCursorAfterComplete || !typingDone) &&
    (cursorBlinkPeriodFrames <= 0 ||
      Math.floor(activeFrame % cursorBlinkPeriodFrames) <
        cursorBlinkPeriodFrames / 2);

  const wrapStyle: React.CSSProperties = {
    position: "absolute",
    left: `${paddingLeftPercent}%`,
    bottom: `${paddingBottomPercent}%`,
    opacity: mountFade,
    maxWidth: `${100 - paddingLeftPercent - 2}%`,
  };

  const monoStyle: React.CSSProperties = {
    margin: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    color: textColor,
    whiteSpace: "nowrap",
    lineHeight: 1.45,
    textAlign: "left",
  };

  const cursorBarStyle: React.CSSProperties = {
    display: "inline-block",
    width: `calc(max(2px, ${cursorWidthEm}em) + 2px)`,
    height: `calc(${cursorHeightEm}em - 2px)`,
    marginLeft: `${cursorGapEm}em`,
    backgroundColor: cursorColor,
    borderRadius: 2,
    verticalAlign: `${cursorVerticalAlignEm}em`,
    userSelect: "none",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <div style={wrapStyle}>
        <p style={monoStyle}>
          <span>{visibleText}</span>
          {cursorVisible ? (
            <span
              role="img"
              aria-label={cursorChar}
              style={cursorBarStyle}
            />
          ) : null}
        </p>
      </div>
    </AbsoluteFill>
  );
};
