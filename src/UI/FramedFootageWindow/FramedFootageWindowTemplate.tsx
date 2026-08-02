import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FramedFootageWindowSchemaType } from "./framed-footage-window.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const FramedFootageWindowTemplate: React.FC<
  FramedFootageWindowSchemaType
> = ({
  fontFamily,
  backgroundColor,
  decorationColor,
  decorationOpacity,
  placeholderFillColor,
  placeholderLabelText,
  placeholderLabelColor,
  windowWidthPercent,
  windowHeightPercent,
  frameColor,
  frameThicknessPx,
  cornerOrnamentEnabled,
  cornerOrnamentColor,
  cornerOrnamentSizePx,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const activeFrame = frame - delayFrames;

  const popIn = useMemo(() => {
    if (popInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, popInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }, [activeFrame, popInFrames]);

  const cx = width / 2;
  const cy = height / 2;

  const diagramCircles = [0.18, 0.3, 0.4].map((r) => Math.min(width, height) * r);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <g opacity={decorationOpacity}>
          {diagramCircles.map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={decorationColor as string}
              strokeWidth={1}
            />
          ))}
          <line x1={0} y1={cy} x2={width} y2={cy} stroke={decorationColor as string} strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={height} stroke={decorationColor as string} strokeWidth={1} />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${windowWidthPercent * popIn}%`,
          height: `${windowHeightPercent * popIn}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: placeholderFillColor,
          border: `${frameThicknessPx}px solid ${frameColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 28,
            letterSpacing: "0.2em",
            color: placeholderLabelColor as string,
            opacity: popIn,
          }}
        >
          {placeholderLabelText}
        </div>

        {cornerOrnamentEnabled &&
          [
            { top: 0, left: 0 },
            { top: 0, right: 0 },
            { bottom: 0, left: 0 },
            { bottom: 0, right: 0 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: cornerOrnamentSizePx,
                height: cornerOrnamentSizePx,
                backgroundColor: cornerOrnamentColor as string,
                opacity: popIn * 0.9,
                ...pos,
              }}
            />
          ))}
      </div>
    </AbsoluteFill>
  );
};
