import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { beatsPerLoop, cyclesPerLoop } from "../../helpers/tempo";
import { laserBeamsGlsl } from "./laser-beams.glsl";
import {
  LASER_BEAMS_STYLES,
  type LaserBeamsSchemaType,
} from "./laser-beams.schema";

const DEG = Math.PI / 180;

/** Tempo-synced club lasers in haze. */
export const LaserBeamsTemplate: React.FC<LaserBeamsSchemaType> = ({
  style,
  colorA,
  colorB,
  colorC,
  beamCount,
  spread,
  sweep,
  sweepBars,
  pulse,
  beamWidth,
  haze,
  centerY,
  intensity,
  bpm,
  bars,
  offsetMs,
  randomSeed,
  backgroundColor,
}) => (
  <ShaderBackgroundLayer
    backgroundColor={backgroundColor}
    colorA={colorA}
    colorB={colorB}
    colorC={colorC}
    scale={1}
    intensity={intensity}
    loopCycles={1}
    randomSeed={randomSeed}
    fragmentShader={laserBeamsGlsl}
    extraUniforms={{
      uStyle: LASER_BEAMS_STYLES.indexOf(style),
      uBeats: beatsPerLoop({ bars }),
      uBeatOffset: (offsetMs / 1000) * (bpm / 60),
      uBeamCount: beamCount,
      uSpread: spread * DEG,
      uSweep: sweep * DEG,
      uSweepCycles: cyclesPerLoop(bars, sweepBars),
      uPulse: pulse,
      uBeamWidth: beamWidth,
      uHaze: haze,
      uCenterY: 1080 * (1 - centerY / 100),
    }}
  />
);
