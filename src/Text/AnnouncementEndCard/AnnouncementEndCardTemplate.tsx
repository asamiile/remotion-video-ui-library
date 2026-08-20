import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AnnouncementEndCardSchemaType } from "./announcement-end-card.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const AnnouncementEndCardTemplate: React.FC<
  AnnouncementEndCardSchemaType
> = ({
  titleText,
  catchphraseText,
  releaseDateText,
  ratingLabelText,
  fontFamily,
  titleFontSize,
  catchphraseFontSize,
  releaseDateFontSize,
  textColor,
  subTextColor,
  ratingBadgeColor,
  ratingTextColor,
  backgroundColor,
  fadeInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const opacity = useMemo(() => {
    if (fadeInFrames <= 0) {
      return activeFrame >= 0 ? 1 : 0;
    }
    return interpolate(activeFrame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInFrames]);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: titleFontSize,
            color: textColor,
            textAlign: "center",
          }}
        >
          {titleText}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: catchphraseFontSize,
            color: subTextColor,
            textAlign: "center",
          }}
        >
          {catchphraseText}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 12,
          }}
        >
          <div
            style={{
              fontFamily,
              fontSize: releaseDateFontSize,
              color: textColor,
              letterSpacing: "0.06em",
            }}
          >
            {releaseDateText}
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 4,
              backgroundColor: ratingBadgeColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily,
              fontWeight: 700,
              fontSize: 18,
              color: ratingTextColor,
            }}
          >
            {ratingLabelText}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
