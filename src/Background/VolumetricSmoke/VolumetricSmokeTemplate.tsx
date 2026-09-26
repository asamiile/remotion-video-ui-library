import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { VolumetricSmokeSchemaType } from "./volumetric-smoke.schema";
import { VolumetricSmokeLayer } from "./VolumetricSmokeLayer";

export const VolumetricSmokeTemplate: React.FC<VolumetricSmokeSchemaType> = ({
  backgroundColor,
  coverage,
  loopCycles,
  driftDistance,
  ...look
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Circular paths through noise space return to the start on the last frame,
  // so the composition loops seamlessly.
  const angle = (frame / durationInFrames) * Math.PI * 2 * loopCycles;
  const flow = [
    Math.cos(angle) * driftDistance,
    Math.sin(angle) * driftDistance * 0.35,
    Math.sin(angle) * driftDistance,
  ] as const;
  const evolve = [
    Math.cos(angle + 1.3) * 0.8,
    Math.sin(angle + 1.3) * 0.8,
    0,
  ] as const;

  return (
    <AbsoluteFill>
      <VolumetricSmokeLayer
        {...look}
        backgroundColor={resolveCompositionBackdropColor(backgroundColor)}
        coverage={coverage}
        radialBias={0}
        fill={0}
        flow={flow}
        evolve={evolve}
      />
    </AbsoluteFill>
  );
};
