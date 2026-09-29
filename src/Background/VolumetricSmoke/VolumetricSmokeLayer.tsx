import React from "react";
import { cssColorToVec3, cssColorToVec4 } from "../../helpers/shader/color";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { volumetricSmokeFragmentShader } from "./volumetric-smoke.glsl";

export type VolumetricSmokeLook = {
  smokeColor: string;
  shadowColor: string;
  glowColor: string;
  glowStrength: number;
  density: number;
  noiseScale: number;
  raySteps: number;
  stepJitter: number;
  resolutionScale: number;
};

type Vec3 = readonly [number, number, number];

/** Shared by the Background loop and the Transition; animation state comes from the caller. */
export const VolumetricSmokeLayer: React.FC<
  VolumetricSmokeLook & {
    /** CSS color, or "transparent" */
    backgroundColor: string;
    coverage: number;
    /** > 0 gathers smoke in the center, < 0 at the frame edges */
    radialBias: number;
    /** 0-1; 1 forces a fully opaque frame */
    fill: number;
    flow: Vec3;
    evolve: Vec3;
  }
> = ({
  backgroundColor,
  smokeColor,
  shadowColor,
  glowColor,
  glowStrength,
  density,
  noiseScale,
  raySteps,
  stepJitter,
  resolutionScale,
  coverage,
  radialBias,
  fill,
  flow,
  evolve,
}) => {
  return (
    <ShaderCanvas
      fragmentShader={volumetricSmokeFragmentShader}
      resolutionScale={resolutionScale}
      uniforms={{
        uBackground: cssColorToVec4(backgroundColor),
        uSmokeColor: cssColorToVec3(smokeColor),
        uShadowColor: cssColorToVec3(shadowColor),
        uGlowColor: cssColorToVec3(glowColor),
        uGlowStrength: glowStrength,
        uDensity: density,
        uCoverage: coverage,
        uRadialBias: radialBias,
        uNoiseScale: noiseScale,
        uSteps: raySteps,
        uStepJitter: stepJitter,
        uOctaves: 6,
        uFill: fill,
        uFlow: flow,
        uEvolve: evolve,
        uLightDir: [-0.4, 0.7, -0.5],
      }}
    />
  );
};
