import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { OnboardingConnectSchemaV1Type } from "./onboarding-connect-schema";
import { resolvedBackdropPair } from "../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../onetake-flicker";
import {
  APP_BORDER,
  LaptopFrame,
  PhoneFrame,
  neonBoxShadow,
} from "../onetake-device-chrome";

/** スマホとPC、それぞれのシルエットの間の「Wi-Fiギャップ」座標（キャンバス 1920x1080 基準） */
const GAP_LEFT_X = 780;
const GAP_RIGHT_X = 1140;
const GAP_Y = 540;
/** 片方向あたりのパルス数（スマホ→PC、PC→スマホをそれぞれ独立に走らせる） */
const PULSE_COUNT_PER_DIRECTION = 2;

type Pulse = { x: number; opacity: number; color: string; size: number };

/** 指定方向に走るパルス列を1本分生成するヘルパー（往復どちらにも使う） */
function buildPulseTrain({
  frame,
  count,
  periodFrames,
  reverse,
  color,
  size,
  opacityMul,
  phaseOffset = 0,
}: {
  frame: number;
  count: number;
  periodFrames: number;
  reverse: boolean;
  color: string;
  size: number;
  opacityMul: number;
  phaseOffset?: number;
}): Pulse[] {
  return Array.from({ length: count }, (_, i) => {
    const offset = (periodFrames / count) * i + phaseOffset;
    const t = ((frame + offset) % periodFrames) / periodFrames;
    const x = reverse
      ? GAP_RIGHT_X - t * (GAP_RIGHT_X - GAP_LEFT_X)
      : GAP_LEFT_X + t * (GAP_RIGHT_X - GAP_LEFT_X);
    const edgeFade = Math.sin(t * Math.PI); // 端でフェードイン・アウト
    return { x, opacity: edgeFade * opacityMul, color, size };
  });
}

/** 「アプリの画面」らしさを添えるための最小限のトラック行アクセント（フルUIの再現ではない） */
function PhoneTrackRowAccents({ color }: { color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 26,
        right: 26,
        bottom: 40,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {[true, false].map((armed, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: 76,
              height: 8,
              borderRadius: 4,
              background: APP_BORDER,
            }}
          />
          <div
            style={{
              width: 36,
              height: 21,
              borderRadius: 11,
              background: armed ? color : APP_BORDER,
              boxShadow: armed ? neonBoxShadow(color, 0.35) : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export const OnboardingConnectTemplateV1: React.FC<
  OnboardingConnectSchemaV1Type
> = ({
  phoneColor,
  laptopColor,
  backgroundColor,
  vignetteOpacity,
  pulsePhaseFrames,
  pulsePeriodFrames,
  fadeInDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, fadeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // パルス（接続前）→ 常時点灯ライン（接続後）への切り替わりを10フレームでクロスフェード
  const pulseOpacityMul = interpolate(
    frame,
    [pulsePhaseFrames - 10, pulsePhaseFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const elapsedSinceResolveMs =
    frame < pulsePhaseFrames
      ? -1
      : Math.min(
          ((frame - pulsePhaseFrames) / fps) * 1000,
          CTA_FLICKER_CYCLE_MS,
        );
  const flicker = ctaFlickerAt(elapsedSinceResolveMs);
  const lineOpacityMul = 1 - pulseOpacityMul;
  const lineOpacity = lineOpacityMul * flicker.opacity;

  // フリッカーが収まりきってから、常時同期パルスをフェードインさせる
  // （点灯演出の途中に重ねると視覚的にうるさくなるため）
  const ambientPulseMul =
    frame < pulsePhaseFrames
      ? 0
      : interpolate(
          elapsedSinceResolveMs,
          [CTA_FLICKER_CYCLE_MS - 200, CTA_FLICKER_CYCLE_MS],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

  // 双方向であることを表現: スマホ→PC（cyan）とPC→スマホ（violet）のパルスを
  // すれ違わせる。接続後も、ラインに沿ってパルスを流し続け「今も同期し続けて
  // いる」ことを示す（接続完了＝通信が止まる、ではないことが伝わるように）。
  const pulses = useMemo(() => {
    const outbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: false,
      color: phoneColor,
      size: 24,
      opacityMul: pulseOpacityMul,
    });
    const inbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: true,
      color: laptopColor,
      size: 24,
      opacityMul: pulseOpacityMul,
      phaseOffset: pulsePeriodFrames / (PULSE_COUNT_PER_DIRECTION * 2),
    });
    const ambientOutbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: false,
      color: phoneColor,
      size: 18,
      opacityMul: ambientPulseMul,
    });
    const ambientInbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: true,
      color: laptopColor,
      size: 18,
      opacityMul: ambientPulseMul,
      phaseOffset: pulsePeriodFrames / (PULSE_COUNT_PER_DIRECTION * 2),
    });
    return [...outbound, ...inbound, ...ambientOutbound, ...ambientInbound];
  }, [frame, pulseOpacityMul, ambientPulseMul, pulsePeriodFrames, phoneColor, laptopColor]);

  // 接続後はデバイス自体のグローも一段強くする（点灯フリッカーに合わせて底上げ）
  const deviceGlowStrength = 1 + lineOpacityMul * 0.6 * flicker.brightness;

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
        <PhoneFrame color={phoneColor} glowStrength={deviceGlowStrength}>
          <PhoneTrackRowAccents color={phoneColor} />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 1160, top: 340 }}>
        <LaptopFrame color={laptopColor} glowStrength={deviceGlowStrength} />
      </div>

      {pulses.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - p.size / 2,
            top: GAP_Y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            background: p.color,
            opacity: p.opacity,
            boxShadow: neonBoxShadow(p.color, 0.8),
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: GAP_LEFT_X,
          top: GAP_Y - 4,
          width: GAP_RIGHT_X - GAP_LEFT_X,
          height: 8,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${phoneColor}, ${laptopColor})`,
          opacity: lineOpacity,
          filter: `brightness(${flicker.brightness})`,
          boxShadow: [
            neonBoxShadow(phoneColor, flicker.brightness * 0.6),
            neonBoxShadow(laptopColor, flicker.brightness * 0.6),
          ].join(", "),
        }}
      />
    </AbsoluteFill>
  );
};
