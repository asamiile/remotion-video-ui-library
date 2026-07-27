import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BattleCalloutBannerSchemaV1Type } from "./battle-callout-banner-schema";
import "../../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

export const BattleCalloutBannerTemplateV1: React.FC<
  BattleCalloutBannerSchemaV1Type
> = ({
  text,
  fontFamily,
  fontSize,
  letterSpacing,
  bannerColor,
  textColor,
  borderColor,
  borderWidthPx,
  cornerCutPx,
  avatarEnabled,
  avatarInitial,
  avatarColor,
  avatarSizePx,
  backgroundColor,
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
          easing: Easing.out(Easing.back(1.6)),
        });

  const scale = 0.85 + 0.15 * progress;
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const c = cornerCutPx;
  const clipPath = `polygon(${c}px 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%, 0 ${c}px)`;

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
          position: "relative",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            backgroundColor: bannerColor,
            border: `${borderWidthPx}px solid ${borderColor}`,
            clipPath,
            padding: "24px 56px",
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize,
              letterSpacing,
              color: textColor,
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </div>

        {avatarEnabled ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: `translate(50%, -50%)`,
              width: avatarSizePx,
              height: avatarSizePx,
              borderRadius: "50%",
              backgroundColor: avatarColor,
              border: `${borderWidthPx}px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontWeight: 700,
              fontSize: avatarSizePx * 0.42,
              color: textColor,
            }}
          >
            {avatarInitial}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
