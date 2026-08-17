import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { OnboardingConnectTemplate } from "../OnboardingConnect/OnboardingConnectTemplate";
import { OnboardingOperateTemplate } from "../OnboardingOperate/OnboardingOperateTemplate";
import { neonBoxShadow } from "../../onetake-device-chrome";
import { OnboardingTestSchemaType } from "./onboarding-test.schema";
import { resolveCompositionBackdropColor } from "../../../../helpers/transparent-composition-backdrop";

const SCENE_DURATION_FRAMES = 240;
const CONNECT_END = SCENE_DURATION_FRAMES;
const SUCCESS_END = SCENE_DURATION_FRAMES * 2;

function TestStatus({
  phoneColor,
  successColor,
}: Pick<OnboardingTestSchemaType, "phoneColor" | "successColor">) {
  const frame = useCurrentFrame();
  const isConnecting = frame < CONNECT_END;
  const isConnected = frame >= CONNECT_END && frame < SUCCESS_END;
  const label = isConnecting
    ? "SEARCHING FOR DEVICE"
    : isConnected
      ? "CONNECTION ESTABLISHED"
      : "LIVE CONTROL TEST";
  const activeColor = isConnected ? successColor : phoneColor;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 64,
        translate: "-50% 0",
        minWidth: 600,
        padding: "18px 34px",
        border: `2px solid ${activeColor}`,
        borderRadius: 8,
        background: "rgba(6,8,16,0.82)",
        boxShadow: neonBoxShadow(activeColor, 0.3),
        color: activeColor,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: 4,
      }}
    >
      {label}
    </div>
  );
}

function ConnectedPulse({ color }: { color: string }) {
  const frame = useCurrentFrame();
  // Match the dotted-line rhythm while keeping the status continuously legible.
  const flickerDuration = 9;
  const flickerFrame = frame % flickerDuration;
  const flickerOpacity = interpolate(
    flickerFrame,
    [0, flickerDuration / 2, flickerDuration],
    [1, 1, 0.72],
  );
  const glowStrength = interpolate(
    flickerFrame,
    [0, flickerDuration / 2, flickerDuration],
    [0.9, 0.9, 0.68],
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: resolveCompositionBackdropColor(
          `rgba(6, 8, 16, ${interpolate(frame, [0, 10], [0, 0.2], { extrapolateRight: "clamp" })})`,
        ),
      }}
    >
      <div
        style={{
          padding: "28px 52px",
          border: `4px solid ${color}`,
          borderRadius: 12,
          background: "rgba(6,8,16,0.9)",
          boxShadow: neonBoxShadow(color, glowStrength),
          color,
          fontFamily: "Arial, sans-serif",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: 7,
          opacity:
            interpolate(frame, [0, 10], [0, 1], {
              extrapolateRight: "clamp",
            }) * flickerOpacity,
          scale:
            interpolate(frame, [0, 12], [0.94, 1], {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }) +
            Math.sin(frame / 12) * 0.008,
        }}
      >
        CONNECTED
      </div>
    </div>
  );
}

export const OnboardingTestTemplate: React.FC<OnboardingTestSchemaType> = (
  props,
) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(
          props.backgroundColor,
        ),
      }}
    >
      <Sequence name="Connection test" durationInFrames={CONNECT_END}>
        <OnboardingConnectTemplate
          phoneColor={props.phoneColor}
          laptopColor={props.laptopColor}
          backgroundColor={props.backgroundColor}
          vignetteOpacity={props.vignetteOpacity}
          pulsePeriodFrames={45}
          flickerTriggerFrame={6}
        />
      </Sequence>

      <Sequence
        name="Connection confirmed"
        from={CONNECT_END}
        durationInFrames={SUCCESS_END - CONNECT_END}
      >
        <OnboardingConnectTemplate
          phoneColor={props.phoneColor}
          laptopColor={props.laptopColor}
          backgroundColor={props.backgroundColor}
          vignetteOpacity={props.vignetteOpacity}
          pulsePeriodFrames={45}
          flickerTriggerFrame={10000}
        />
        <ConnectedPulse color={props.successColor} />
      </Sequence>

      <Sequence
        name="Operation test"
        from={SUCCESS_END}
        durationInFrames={SCENE_DURATION_FRAMES}
      >
        <OnboardingOperateTemplate
          recordColor={props.recordColor}
          backgroundColor={props.backgroundColor}
          vignetteOpacity={props.vignetteOpacity}
          tapFrame={20}
          resetStartFrame={65}
        />
      </Sequence>

      <TestStatus
        phoneColor={props.phoneColor}
        successColor={props.successColor}
      />
    </AbsoluteFill>
  );
};
