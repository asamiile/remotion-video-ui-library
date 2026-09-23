import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FeatherWipeCreditSchemaType } from "./feather-wipe-credit.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const FeatherWipeCreditTemplate: React.FC<
  FeatherWipeCreditSchemaType
> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  textColor,
  backgroundColor,
  featherWidthPercent,
  edgeGlowColor,
  edgeGlowWidthPx,
  liftPx,
  wipeDurationFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;

  const wipeProgress = interpolate(activeFrame, [0, wipeDurationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  /** Travels from just before the text to just past it, so the mask both starts fully
   * hidden and ends fully revealed instead of leaving a permanently-fading tail. */
  const boundaryPercent = interpolate(
    activeFrame,
    [0, wipeDurationFrames],
    [-featherWidthPercent, 100 + featherWidthPercent],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const maskImage = `linear-gradient(90deg, white 0%, white ${
    boundaryPercent - featherWidthPercent
  }%, transparent ${boundaryPercent + featherWidthPercent}%, transparent 100%)`;

  const glowOpacity = interpolate(wipeProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize,
            letterSpacing,
            color: textColor,
            whiteSpace: "pre",
            maskImage,
            WebkitMaskImage: maskImage,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          {chars.map((ch, i) => {
            const charPos = n <= 1 ? 0 : i / (n - 1);
            const dist = boundaryPercent / 100 - charPos;
            const liftProgress = interpolate(
              dist,
              [-featherWidthPercent / 100, featherWidthPercent / 100],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const offsetY = liftPx * (1 - liftProgress);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `translateY(${offsetY}px)`,
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </div>

        {glowOpacity > 0.02 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${boundaryPercent}%`,
              width: edgeGlowWidthPx,
              transform: "translateX(-50%)",
              background: edgeGlowColor as string,
              boxShadow: `0 0 12px ${edgeGlowColor}`,
              opacity: glowOpacity,
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
