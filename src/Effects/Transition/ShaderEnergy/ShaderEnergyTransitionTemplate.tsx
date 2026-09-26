import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cssColorToVec3 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { plasmaVeilFragmentShader } from "./plasma-veil.glsl";
import { quantumDustTunnelFragmentShader } from "./quantum-dust-tunnel.glsl";
import type { ShaderEnergyTransitionSchemaType } from "./shader-energy-transition.schema";

export const ShaderEnergyTransitionTemplate: React.FC<
  ShaderEnergyTransitionSchemaType
> = ({
  effectType,
  primaryColor,
  secondaryColor,
  accentColor,
  intensity,
  density,
  randomSeed,
  durationFrames: animationDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const animationStartFrame = Math.floor(
    (durationInFrames - animationDurationFrames) / 2,
  );
  const animationFrame = frame - animationStartFrame;

  if (animationFrame < 0 || animationFrame >= animationDurationFrames) {
    return null;
  }

  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const progress = interpolate(
    animationFrame,
    [0, animationDurationFrames - 1],
    [0, 1],
    { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) },
  );
  // 0 → 1 at the midpoint (the cut) → 0
  const peak = 1 - Math.abs(progress * 2 - 1);

  const colors = {
    uPrimary: cssColorToVec3(primaryColor),
    uSecondary: cssColorToVec3(secondaryColor),
    uAccent: cssColorToVec3(accentColor),
    uIntensity: intensity,
    uDensity: density,
    uSeed: randomSeed,
    uAnimTime: animationFrame / fps,
  };

  return (
    <AbsoluteFill>
      {effectType === "plasmaVeil" ? (
        <ShaderCanvas
          fragmentShader={plasmaVeilFragmentShader}
          uniforms={{
            ...colors,
            uPeak: peak,
          }}
        />
      ) : (
        <ShaderCanvas
          fragmentShader={quantumDustTunnelFragmentShader}
          uniforms={{
            ...colors,
            // Accelerates into the core, coasts out.
            uTravel: Math.pow(progress, 1.6) * 3.2,
            uEnvelope: Math.pow(Math.sin(progress * Math.PI), 0.6),
            // Reaches full coverage just before the midpoint and holds it.
            uFlash: interpolate(peak, [0.6, 0.92], [0, 1], {
              ...clamp,
              easing: Easing.in(Easing.cubic),
            }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
