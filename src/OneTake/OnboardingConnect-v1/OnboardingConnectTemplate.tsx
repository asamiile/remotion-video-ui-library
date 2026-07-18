import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { OnboardingConnectSchemaV1Type } from "./onboarding-connect-schema";
import { resolvedBackdropPair } from "../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../onetake-flicker";
import {
  APP_BORDER,
  LaptopFrame,
  PHONE_WIDTH,
  PhoneFrame,
  neonBoxShadow,
} from "../onetake-device-chrome";

const PHONE_LEFT = 300;
const PHONE_TOP = 220;
const LAPTOP_LEFT = 1140;
const LAPTOP_TOP = 340;

/** スマホとPC、それぞれのシルエットの間の「Wi-Fiギャップ」座標（キャンバス 1920x1080 基準） */
const GAP_LEFT_X = PHONE_LEFT + PHONE_WIDTH + 40;
const GAP_RIGHT_X = LAPTOP_LEFT - 40;
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
  phaseOffset = 0,
}: {
  frame: number;
  count: number;
  periodFrames: number;
  reverse: boolean;
  color: string;
  size: number;
  phaseOffset?: number;
}): Pulse[] {
  return Array.from({ length: count }, (_, i) => {
    const offset = (periodFrames / count) * i + phaseOffset;
    const t = ((frame + offset) % periodFrames) / periodFrames;
    const x = reverse
      ? GAP_RIGHT_X - t * (GAP_RIGHT_X - GAP_LEFT_X)
      : GAP_LEFT_X + t * (GAP_RIGHT_X - GAP_LEFT_X);
    const edgeFade = Math.sin(t * Math.PI); // 端でフェードイン・アウト
    return { x, opacity: edgeFade, color, size };
  });
}

/** 「アプリの画面」らしさを添えるための最小限のトラック行アクセント（フルUIの再現ではない） */
function PhoneTrackRowAccents({ color }: { color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 38,
        right: 38,
        bottom: 58,
        display: "flex",
        flexDirection: "column",
        gap: 24,
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
              width: 110,
              height: 12,
              borderRadius: 6,
              background: APP_BORDER,
            }}
          />
          <div
            style={{
              width: 52,
              height: 30,
              borderRadius: 15,
              background: armed ? color : APP_BORDER,
              boxShadow: armed ? neonBoxShadow(color, 0.35) : undefined,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * スマホ+PCが常時つながっている状態をループ表示するための演出。
 * アプリ側（expo-video）で`loop=true`再生する前提のため、フェードイン等
 * 「一度きり」の要素は持たせず、frameの周期性だけで成立するようにしている:
 * - 双方向パルスは`pulsePeriodFrames`の剰余で位置を決めるため、尺がその整数倍なら
 *   ループ境界（最終フレーム→先頭フレーム）で見た目が完全に一致する。
 * - フリッカーは`flickerTriggerFrame`前後だけの一時的な演出だが、発火前
 *   （`frame < flickerTriggerFrame`）と発火後十分経過した状態は両方とも
 *   「常時点灯」で同じ見た目になるため、ループ境界をまたいでも破綻しない。
 */
export const OnboardingConnectTemplateV1: React.FC<
  OnboardingConnectSchemaV1Type
> = ({
  phoneColor,
  laptopColor,
  backgroundColor,
  vignetteOpacity,
  pulsePeriodFrames,
  flickerTriggerFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsedSinceFlickerMs =
    frame < flickerTriggerFrame
      ? -1
      : Math.min(
          ((frame - flickerTriggerFrame) / fps) * 1000,
          CTA_FLICKER_CYCLE_MS,
        );
  const flicker = ctaFlickerAt(elapsedSinceFlickerMs);

  const pulses = useMemo(() => {
    const outbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: false,
      color: phoneColor,
      size: 18,
    });
    const inbound = buildPulseTrain({
      frame,
      count: PULSE_COUNT_PER_DIRECTION,
      periodFrames: pulsePeriodFrames,
      reverse: true,
      color: laptopColor,
      size: 18,
      phaseOffset: pulsePeriodFrames / (PULSE_COUNT_PER_DIRECTION * 2),
    });
    return [...outbound, ...inbound];
  }, [frame, pulsePeriodFrames, phoneColor, laptopColor]);

  const deviceGlowStrength = 1 + (flicker.brightness - 1) * 0.5;

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
        <PhoneFrame color={phoneColor} glowStrength={deviceGlowStrength}>
          <PhoneTrackRowAccents color={phoneColor} />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: LAPTOP_LEFT, top: LAPTOP_TOP }}>
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
          opacity: flicker.opacity,
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
