import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { DuotoneGradeOverlaySchemaV1Type } from "./duotone-grade-overlay.schema";

export const DuotoneGradeOverlayTemplateV1: React.FC<
  DuotoneGradeOverlaySchemaV1Type
> = ({
  channelAColor,
  channelBColor,
  channelShiftPx,
  channelOpacity,
  washColor,
  washOpacity,
  trackingNoiseEnabled,
  trackingNoiseOpacity,
  trackingBandHeightPx,
}) => {
  const frame = useCurrentFrame();
  const noiseBucket = Math.floor(frame / 3);
  const topFlicker = 0.5 + 0.5 * random(`tracking-top-${noiseBucket}`);
  const bottomFlicker = 0.5 + 0.5 * random(`tracking-bottom-${noiseBucket}`);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundColor: channelAColor,
          opacity: channelOpacity,
          mixBlendMode: "screen",
          transform: `translateX(-${channelShiftPx}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: channelBColor,
          opacity: channelOpacity,
          mixBlendMode: "screen",
          transform: `translateX(${channelShiftPx}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: washColor,
          opacity: washOpacity,
          mixBlendMode: "multiply",
        }}
      />

      {trackingNoiseEnabled ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: trackingBandHeightPx,
              opacity: trackingNoiseOpacity * topFlicker,
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 2px, transparent 2px, transparent 5px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: trackingBandHeightPx,
              opacity: trackingNoiseOpacity * bottomFlicker,
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) 2px, transparent 2px, transparent 5px)",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
