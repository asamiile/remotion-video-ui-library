import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SlideInCaptionSchemaV1Type } from "./slide-in-caption.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const SlideInCaptionTemplateV1: React.FC<SlideInCaptionSchemaV1Type> = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textColor,
  backgroundColor,
  accentGlowColor,
  sweepWidthPercent,
  sweepBlurPx,
  sweepOpacity,
  sweepAngleDeg,
  paddingLeftPercent,
  paddingBottomPercent,
  delayFrames,
  slideInDurationFrames,
}) => {
  const frame = useCurrentFrame();

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  const scanProgress = useMemo(() => {
    const t = Math.max(0, frame - delayFrames);
    return interpolate(t, [0, slideInDurationFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }, [frame, delayFrames, slideInDurationFrames]);

  const visibleCount = useMemo(() => {
    if (n === 0) {
      return 0;
    }
    return Math.min(n, Math.ceil(scanProgress * n - 1e-9));
  }, [n, scanProgress]);

  /** Only keep the light strong while the scan is moving (fade out at both ends) */
  const sweepLayerOpacity = useMemo(
    () =>
      interpolate(scanProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }) * sweepOpacity,
    [scanProgress, sweepOpacity],
  );

  const paragraphStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    color: textColor,
    whiteSpace: "nowrap",
  };

  /** Same line-box height as the body text (px) - used as the height of the light band */
  const sweepHeightPx = fontSize * lineHeight;

  const sweepGradient = useMemo(
    () =>
      `linear-gradient(90deg,
        transparent 0%,
        transparent 18%,
        ${accentGlowColor}00 32%,
        ${accentGlowColor} 50%,
        ${accentGlowColor}00 68%,
        transparent 82%,
        transparent 100%)`,
    [accentGlowColor],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <p style={paragraphStyle}>
            {chars.map((ch, i) => (
              <span
                key={i}
                style={{
                  opacity: i < visibleCount ? 1 : 0,
                }}
              >
                {ch}
              </span>
            ))}
          </p>

          {n > 0 && sweepLayerOpacity > 0.02 && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${scanProgress * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${sweepAngleDeg}deg)`,
                  width: `${sweepWidthPercent}%`,
                  height: sweepHeightPx,
                  backgroundImage: sweepGradient,
                  backgroundSize: "100% 100%",
                  filter: `blur(${sweepBlurPx}px)`,
                  opacity: sweepLayerOpacity,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
