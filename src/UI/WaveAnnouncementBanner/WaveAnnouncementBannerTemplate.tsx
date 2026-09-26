import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WaveAnnouncementBannerSchemaType } from "./wave-announcement-banner.schema";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const SAMPLE_POINTS = 40;

export const WaveAnnouncementBannerTemplate: React.FC<
  WaveAnnouncementBannerSchemaType
> = ({
  bannerText,
  bannerColor,
  textColor,
  waveAmplitudePx,
  waveFrequency,
  bandThicknessPx,
  rotationDeg,
  fontFamily,
  fontSize,
  backgroundColor,
  popInFrames,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
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

  const bannerWidth = width * 1.4;
  const centerY = bandThicknessPx / 2 + waveAmplitudePx;
  const svgHeight = bandThicknessPx + waveAmplitudePx * 2;

  const pathD = useMemo(() => {
    const topPoints: string[] = [];
    const bottomPoints: string[] = [];
    for (let i = 0; i <= SAMPLE_POINTS; i++) {
      const x = (i / SAMPLE_POINTS) * bannerWidth;
      const phase = (i / SAMPLE_POINTS) * Math.PI * 2 * waveFrequency;
      const offset = Math.sin(phase) * waveAmplitudePx;
      topPoints.push(`${x},${centerY - bandThicknessPx / 2 + offset}`);
      bottomPoints.push(`${x},${centerY + bandThicknessPx / 2 + offset}`);
    }
    return `M ${topPoints.join(" L ")} L ${bottomPoints.reverse().join(" L ")} Z`;
  }, [bannerWidth, waveFrequency, waveAmplitudePx, centerY, bandThicknessPx]);

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
          left: "50%",
          transform: `translate(-50%, -50%) rotate(${rotationDeg}deg) scaleX(${popIn})`,
        }}
      >
        <svg width={bannerWidth} height={svgHeight} style={{ overflow: "visible" }}>
          <path d={pathD} fill={bannerColor as string} />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily,
            fontWeight: 700,
            fontSize,
            color: textColor,
            whiteSpace: "nowrap",
            opacity: popIn,
          }}
        >
          {bannerText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
