import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OnboardingOperateSchemaV1Type } from "./onboarding-operate-schema";
import { resolvedBackdropPair } from "../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../onetake-flicker";
import {
  LaptopFrame,
  PhoneFrame,
  neonBoxShadow,
} from "../onetake-device-chrome";

const WAVEFORM_BAR_COUNT = 24;
const WAVEFORM_BAR_GAP = 7;
const WAVEFORM_BAR_WIDTH = 10;
/** タップからPC側の波形が反応し始めるまでの遅延（「即座に反映」感を残すごく短い遅延） */
const RECORD_REACTION_DELAY_FRAMES = 6;

function RecordButton({
  color,
  isActive,
  opacity,
  brightness,
  rippleScale,
  rippleOpacity,
}: {
  color: string;
  isActive: boolean;
  opacity: number;
  brightness: number;
  rippleScale: number;
  rippleOpacity: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 96,
          height: 96,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          opacity: rippleOpacity,
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
        }}
      />
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: color,
          opacity,
          boxShadow: isActive ? neonBoxShadow(color, brightness) : undefined,
        }}
      />
    </div>
  );
}

function WaveformBars({
  color,
  frameSinceRecordStart,
}: {
  color: string;
  frameSinceRecordStart: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: WAVEFORM_BAR_GAP,
      }}
    >
      {Array.from({ length: WAVEFORM_BAR_COUNT }, (_, i) => {
        const localFrame = frameSinceRecordStart - i * 1.5;
        if (localFrame < 0) {
          return (
            <div
              key={i}
              style={{
                width: WAVEFORM_BAR_WIDTH,
                height: 4,
                borderRadius: 2,
                background: color,
                opacity: 0.3,
              }}
            />
          );
        }
        const n = random(
          `onboarding-operate-bar-${i}-${Math.floor(localFrame / 4)}`,
        );
        const height = 12 + n * 54;
        return (
          <div
            key={i}
            style={{
              width: WAVEFORM_BAR_WIDTH,
              height,
              borderRadius: 3,
              background: color,
              boxShadow: neonBoxShadow(color, 0.4),
            }}
          />
        );
      })}
    </div>
  );
}

export const OnboardingOperateTemplateV1: React.FC<
  OnboardingOperateSchemaV1Type
> = ({
  recordColor,
  backgroundColor,
  vignetteOpacity,
  tapFrame,
  fadeInDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isActive = frame >= tapFrame;
  const elapsedSinceTapMs = isActive
    ? Math.min(((frame - tapFrame) / fps) * 1000, CTA_FLICKER_CYCLE_MS)
    : -1;
  const flicker = ctaFlickerAt(elapsedSinceTapMs);

  const rippleScale = interpolate(
    frame,
    [tapFrame, tapFrame + 18],
    [0.3, 2.4],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const rippleOpacity = interpolate(
    frame,
    [tapFrame, tapFrame + 18],
    [0.85, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const frameSinceRecordStart = frame - tapFrame - RECORD_REACTION_DELAY_FRAMES;
  const laptopGlowStrength = isActive ? 1 + 0.5 * flicker.brightness : 1;

  const { backdropColor, vignette } = resolvedBackdropPair(
    backgroundColor,
    vignetteOpacity,
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: backdropColor, opacity: sceneOpacity }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />

      <div style={{ position: "absolute", left: 520, top: 300 }}>
        <PhoneFrame color={recordColor}>
          <RecordButton
            color={recordColor}
            isActive={isActive}
            opacity={flicker.opacity}
            brightness={flicker.brightness}
            rippleScale={rippleScale}
            rippleOpacity={rippleOpacity}
          />
        </PhoneFrame>
      </div>

      <div style={{ position: "absolute", left: 1160, top: 340 }}>
        <LaptopFrame color={recordColor} glowStrength={laptopGlowStrength}>
          <WaveformBars
            color={recordColor}
            frameSinceRecordStart={frameSinceRecordStart}
          />
        </LaptopFrame>
      </div>
    </AbsoluteFill>
  );
};
