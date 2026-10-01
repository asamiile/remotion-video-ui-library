import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../transparent-composition-backdrop";
import { cssColorToVec3, cssColorToVec4 } from "../color";
import { ShaderCanvas, type ShaderUniformValues } from "../ShaderCanvas";
import type { ShaderBackgroundSchemaType } from "./shader-background.schema";

/** Random sequences (e.g. speed lines) re-roll every 2 frames. */
const STEP_FRAMES = 2;

/** Renders one basic-technique fragment shader with the shared uniforms. */
export const ShaderBackgroundLayer: React.FC<
  ShaderBackgroundSchemaType & {
    fragmentShader: string;
    /** Effect-specific uniforms on top of the shared ones */
    extraUniforms?: ShaderUniformValues;
  }
> = ({
  fragmentShader,
  extraUniforms,
  backgroundColor,
  colorA,
  colorB,
  colorC,
  scale,
  intensity,
  loopCycles,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = ((frame / durationInFrames) * loopCycles) % 1;
  // Wraps with the composition so the random sequence also loops.
  const steps = Math.max(1, Math.floor(durationInFrames / STEP_FRAMES));
  const step = Math.floor(frame / STEP_FRAMES) % steps;

  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={fragmentShader}
        uniforms={{
          uBackground: cssColorToVec4(
            resolveCompositionBackdropColor(backgroundColor),
          ),
          uColorA: cssColorToVec3(colorA),
          uColorB: cssColorToVec3(colorB),
          uColorC: cssColorToVec3(colorC),
          uPhase: phase,
          uStep: step,
          uScale: scale,
          uIntensity: intensity,
          uSeed: randomSeed,
          ...extraUniforms,
        }}
      />
    </AbsoluteFill>
  );
};
