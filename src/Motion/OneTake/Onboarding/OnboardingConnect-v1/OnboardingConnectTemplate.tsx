import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { OnboardingConnectSchemaV1Type } from "./onboarding-connect-schema";
import { resolvedBackdropPair } from "../../../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../../onetake-flicker";
import {
  APP_BORDER,
  LaptopFrame,
  PHONE_WIDTH,
  PhoneFrame,
  neonBoxShadow,
} from "../../onetake-device-chrome";

const PHONE_LEFT = 300;
const PHONE_TOP = 220;
const LAPTOP_LEFT = 1140;
const LAPTOP_TOP = 340;

/** "Wi-Fi gap" coordinates between the phone and laptop silhouettes (based on a 1920x1080 canvas) */
const GAP_LEFT_X = PHONE_LEFT + PHONE_WIDTH + 40;
const GAP_RIGHT_X = LAPTOP_LEFT - 40;
const GAP_Y = 540;
/** Number of pulses per direction (phone→PC and PC→phone run independently) */
const PULSE_COUNT_PER_DIRECTION = 2;

type Pulse = { x: number; opacity: number; color: string; size: number };

/** Helper that generates one pulse train traveling in the given direction (used for both directions) */
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
    const edgeFade = Math.sin(t * Math.PI); // fade in/out at each end
    return { x, opacity: edgeFade, color, size };
  });
}

/** Minimal track-row accents to sell the "app screen" look (not a full UI reproduction) */
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
 * Loops a "phone + PC always connected" state. Assumes the app plays this
 * with `loop=true` (expo-video), so there are no "one-shot" elements like a
 * fade-in — everything relies purely on frame periodicity:
 * - The bidirectional pulses derive their position from frame modulo
 *   `pulsePeriodFrames`, so as long as the duration is an integer multiple of
 *   that, the look matches exactly at the loop boundary (last frame → first
 *   frame).
 * - The flicker is a one-off effect around `flickerTriggerFrame`, but since
 *   both the state before it (`frame < flickerTriggerFrame`) and the state
 *   well after it look like "always lit", crossing the loop boundary doesn't
 *   break anything.
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
