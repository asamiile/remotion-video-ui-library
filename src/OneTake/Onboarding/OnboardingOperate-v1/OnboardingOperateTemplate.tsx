import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OnboardingOperateSchemaV1Type } from "./onboarding-operate-schema";
import { resolvedBackdropPair } from "../../../helpers/transparent-composition-backdrop";
import { LaptopFrame, PhoneFrame, neonBoxShadow } from "../../onetake-device-chrome";

const PHONE_LEFT = 300;
const PHONE_TOP = 220;
const LAPTOP_LEFT = 1140;
const LAPTOP_TOP = 340;

const WAVEFORM_BAR_COUNT = 24;
const WAVEFORM_BAR_GAP = 10;
const WAVEFORM_BAR_WIDTH = 14;
const WAVEFORM_BAR_MAX_HEIGHT = 240;
const WAVEFORM_FLAT_HEIGHT = 6;
const WAVEFORM_FLAT_OPACITY = 0.3;
/** タップからPC側の波形が反応し始めるまでの遅延（「即座に反映」感を残すごく短い遅延） */
const RECORD_REACTION_DELAY_FRAMES = 6;
/** タップからボタンの発光・波形が最大の勢いに達するまでのフレーム数 */
const RAMP_UP_FRAMES = 16;

function RecordButton({
  color,
  glowStrength,
  rippleScale,
  rippleOpacity,
}: {
  color: string;
  glowStrength: number;
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
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: color,
          boxShadow: glowStrength > 0.01 ? neonBoxShadow(color, glowStrength) : undefined,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          border: `6px solid ${color}`,
          opacity: rippleOpacity,
          boxShadow: rippleOpacity > 0.01 ? neonBoxShadow(color, rippleOpacity) : undefined,
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
        }}
      />
    </div>
  );
}

function WaveformBars({
  color,
  frame,
  recordStartFrame,
  activity,
}: {
  color: string;
  frame: number;
  recordStartFrame: number;
  activity: number;
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
        const localFrame = frame - recordStartFrame - i * 1.5;
        if (localFrame < 0) {
          return (
            <div
              key={i}
              style={{
                width: WAVEFORM_BAR_WIDTH,
                height: WAVEFORM_FLAT_HEIGHT,
                borderRadius: 3,
                background: color,
                opacity: WAVEFORM_FLAT_OPACITY,
              }}
            />
          );
        }
        const n = random(`onboarding-operate-bar-${i}-${Math.floor(localFrame / 4)}`);
        const targetHeight = 16 + n * WAVEFORM_BAR_MAX_HEIGHT;
        const height =
          WAVEFORM_FLAT_HEIGHT + (targetHeight - WAVEFORM_FLAT_HEIGHT) * activity;
        const opacity =
          WAVEFORM_FLAT_OPACITY + (1 - WAVEFORM_FLAT_OPACITY) * activity;
        return (
          <div
            key={i}
            style={{
              width: WAVEFORM_BAR_WIDTH,
              height,
              borderRadius: 3,
              background: color,
              opacity,
              boxShadow: neonBoxShadow(color, 0.4 * activity),
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * タップ→録音開始→録音終了（待機に戻る）を1サイクルとしてループ表示する演出。
 * アプリ側（expo-video）で`loop=true`再生する前提のため、`resetStartFrame`から
 * 最終フレームにかけてボタンの発光・波形の勢いを`activity`で0まで減衰させ、
 * 先頭フレーム（タップ前の待機状態）とループ境界で一致するようにしている。
 */
export const OnboardingOperateTemplateV1: React.FC<
  OnboardingOperateSchemaV1Type
> = ({ recordColor, backgroundColor, vignetteOpacity, tapFrame, resetStartFrame }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const activity = interpolate(
    frame,
    [tapFrame, tapFrame + RAMP_UP_FRAMES, resetStartFrame, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rippleScale = interpolate(frame, [tapFrame, tapFrame + 18], [0.3, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rippleOpacity = interpolate(frame, [tapFrame, tapFrame + 18], [0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const recordStartFrame = tapFrame + RECORD_REACTION_DELAY_FRAMES;
  const laptopGlowStrength = 1 + 0.5 * activity;

  const { backdropColor, vignette } = resolvedBackdropPair(
    backgroundColor,
    vignetteOpacity,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: backdropColor }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />

      <div style={{ position: "absolute", left: PHONE_LEFT, top: PHONE_TOP }}>
        <PhoneFrame color={recordColor}>
          <RecordButton
            color={recordColor}
            glowStrength={activity}
            rippleScale={rippleScale}
            rippleOpacity={rippleOpacity}
          />
        </PhoneFrame>
      </div>

      <div style={{ position: "absolute", left: LAPTOP_LEFT, top: LAPTOP_TOP }}>
        <LaptopFrame color={recordColor} glowStrength={laptopGlowStrength}>
          <WaveformBars
            color={recordColor}
            frame={frame}
            recordStartFrame={recordStartFrame}
            activity={activity}
          />
        </LaptopFrame>
      </div>
    </AbsoluteFill>
  );
};
