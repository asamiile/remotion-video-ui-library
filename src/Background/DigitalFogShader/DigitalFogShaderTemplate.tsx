import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { digitalFogShaderFragmentShader } from "./digital-fog-shader.glsl";
import type { DigitalFogShaderSchemaType } from "./digital-fog-shader.schema";

export const DigitalFogShaderTemplate: React.FC<DigitalFogShaderSchemaType> = ({
  fogColor,
  particleColor,
  layerCount,
  particleCount,
  opacity,
  drift,
  loopCycles,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const phase = ((frame / durationInFrames) * loopCycles) % 1;

  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={digitalFogShaderFragmentShader}
        uniforms={{
          uFogColor: cssColorToVec3(fogColor),
          uParticleColor: cssColorToVec3(particleColor),
          uLayerCount: layerCount,
          uParticleCount: particleCount,
          uOpacity: opacity,
          uDrift: drift,
          uPhase: phase,
          uSeed: randomSeed,
        }}
      />
    </AbsoluteFill>
  );
};
