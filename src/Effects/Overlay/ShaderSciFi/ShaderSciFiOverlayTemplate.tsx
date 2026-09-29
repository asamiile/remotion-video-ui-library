import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cssColorToVec3 } from "../../../helpers/shader/color";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { energyContourLinesFragmentShader } from "./energy-contour-lines.glsl";
import { plasmaEdgeArcFragmentShader } from "./plasma-edge-arc.glsl";
import type { ShaderSciFiOverlaySchemaType } from "./shader-sci-fi-overlay.schema";
import { volumetricLightScanFragmentShader } from "./volumetric-light-scan.glsl";

const fragmentShaders: Record<
  ShaderSciFiOverlaySchemaType["effectType"],
  string
> = {
  plasmaEdgeArc: plasmaEdgeArcFragmentShader,
  volumetricLightScan: volumetricLightScanFragmentShader,
  energyContourLines: energyContourLinesFragmentShader,
};

/** Arc flicker steps every 2 frames. */
const FLICKER_FRAMES = 2;

export const ShaderSciFiOverlayTemplate: React.FC<
  ShaderSciFiOverlaySchemaType
> = ({
  effectType,
  primaryColor,
  secondaryColor,
  accentColor,
  opacity,
  intensity,
  density,
  loopCycles,
  safeAreaPercent,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = ((frame / durationInFrames) * loopCycles) % 1;
  // Wraps with the composition so the flicker sequence also loops.
  const flickerSteps = Math.max(
    1,
    Math.floor(durationInFrames / FLICKER_FRAMES),
  );
  const step = Math.floor(frame / FLICKER_FRAMES) % flickerSteps;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <ShaderCanvas
        fragmentShader={fragmentShaders[effectType]}
        uniforms={{
          uPrimary: cssColorToVec3(primaryColor),
          uSecondary: cssColorToVec3(secondaryColor),
          uAccent: cssColorToVec3(accentColor),
          uOpacity: opacity,
          uIntensity: intensity,
          uDensity: density,
          uSafeArea: safeAreaPercent / 100,
          uPhase: phase,
          uStep: step,
          uSeed: randomSeed,
        }}
      />
    </AbsoluteFill>
  );
};
