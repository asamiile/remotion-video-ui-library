import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { cssColorToVec3, cssColorToVec4 } from "../../helpers/shader/color";
import { PERSON_LOOP, STREET_LOOP } from "../../helpers/shader/glsl/street-scene";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { lidarPointCloudGlsl } from "./lidar-point-cloud.glsl";
import type { LidarPointCloudSchemaType } from "./lidar-point-cloud.schema";

/** Nominal spin rate shown in the HUD (the drawn sweep is slowed down to stay readable). */
const NOMINAL_HZ = 10;
const COLOR_MODES = { distance: 0, height: 1, mono: 2 } as const;

export const LidarPointCloudTemplate: React.FC<LidarPointCloudSchemaType> = ({
  backgroundColor,
  colorMode,
  colorA,
  colorB,
  boxColor,
  beams,
  pointsPerTurn,
  maxRange,
  showBoxes,
  showGroundGrid,
  showHud,
  sweepTurns,
  loopTravels,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const phase = frame / durationInFrames;
  const speedKmh = ((STREET_LOOP * loopTravels) / (durationInFrames / fps)) * 3.6;
  const pointRate = (beams * pointsPerTurn * NOMINAL_HZ) / 1e6;
  const tracked = 3 + Math.floor(random(`lidar-${Math.floor(frame / 10)}`) * 3);

  const text: React.CSSProperties = {
    position: "absolute",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    color: boxColor,
    letterSpacing: 2,
    whiteSpace: "pre",
    textShadow: "0 0 8px rgba(0,0,0,0.8)",
  };

  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={lidarPointCloudGlsl}
        uniforms={{
          uBackground: cssColorToVec4(resolveCompositionBackdropColor(backgroundColor)),
          uColorA: cssColorToVec3(colorA),
          uColorB: cssColorToVec3(colorB),
          uBoxColor: cssColorToVec3(boxColor),
          uColorMode: COLOR_MODES[colorMode],
          uBeams: beams,
          uPointsPerTurn: pointsPerTurn,
          uMaxRange: maxRange,
          uShowBoxes: showBoxes,
          uGrid: showGroundGrid,
          uPhase: phase,
          uSweepTurns: sweepTurns,
          uTravel: phase * STREET_LOOP * loopTravels,
          uWalk: phase * PERSON_LOOP,
        }}
      />
      {showHud ? (
        <>
          <div style={{ ...text, left: 64, top: 56, fontSize: 22, fontWeight: 700 }}>
            {`LIDAR // ${beams} BEAM // ${NOMINAL_HZ} HZ`}
          </div>
          <div style={{ ...text, left: 64, top: 92, fontSize: 15, opacity: 0.8 }}>
            {`POINTS ${pointRate.toFixed(2)}M/s   RANGE ${Math.round(maxRange)}m`}
          </div>
          <div style={{ ...text, right: 64, top: 56, fontSize: 15, textAlign: "right", opacity: 0.85 }}>
            {`EGO ${speedKmh.toFixed(0)} km/h\nTRACKED ${String(tracked).padStart(2, "0")}`}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
