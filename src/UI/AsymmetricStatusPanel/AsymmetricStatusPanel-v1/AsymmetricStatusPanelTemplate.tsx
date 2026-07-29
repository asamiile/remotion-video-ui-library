import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AsymmetricStatusPanelSchemaV1Type } from "./asymmetric-status-panel.schema";
import "../../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";

const PANEL_CUT_PX = 36;

export const AsymmetricStatusPanelTemplateV1: React.FC<
  AsymmetricStatusPanelSchemaV1Type
> = ({
  characterName,
  subtitleText,
  level,
  nextExpText,
  stats,
  skillColors,
  fontFamily,
  monoFontFamily,
  panelColor,
  accentColor,
  textColor,
  barTrackColor,
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
          easing: Easing.out(Easing.cubic),
        });

  const opacity = interpolate(progress, [0, 0.4, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(progress, [0, 1], [-40, 0]);

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
          transform: `translateX(${translateX}px)`,
          display: "flex",
          alignItems: "stretch",
          width: "70%",
          maxWidth: 1400,
        }}
      >
        {/* Left: name / level / skills */}
        <div
          style={{
            backgroundColor: panelColor,
            clipPath: `polygon(0 0, 100% 0, calc(100% - ${PANEL_CUT_PX}px) 100%, 0 100%)`,
            padding: "28px 56px 28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 360,
          }}
        >
          <div
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 20,
              color: textColor,
              opacity: 0.85,
            }}
          >
            {characterName}
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 40,
              color: textColor,
            }}
          >
            {subtitleText}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              fontFamily: monoFontFamily,
              color: textColor,
            }}
          >
            <span style={{ fontSize: 18, opacity: 0.85 }}>LV</span>
            <span style={{ fontSize: 32, fontWeight: 700 }}>{level}</span>
            <span style={{ fontSize: 14, opacity: 0.7 }}>{nextExpText}</span>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {skillColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: stat bars */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            clipPath: `polygon(${PANEL_CUT_PX}px 0, 100% 0, 100% 100%, 0 100%)`,
            padding: "28px 40px 28px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {stats.map((stat, i) => {
            const barProgress = interpolate(
              progress,
              [0, 1],
              [0, stat.value],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: 16,
                    color: textColor,
                    width: 48,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 14,
                    backgroundColor: barTrackColor,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${barProgress}%`,
                      height: "100%",
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
