import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { beatsPerLoop, cyclesPerLoop } from "../../helpers/tempo";
import { hazeBloomLeakGlsl } from "./haze-bloom-leak.glsl";
import {
  HAZE_BLOOM_LEAK_STYLES,
  type HazeBloomLeakSchemaType,
} from "./haze-bloom-leak.schema";

/** Tempo-synced light leaks breathing in from the frame edges. */
export const HazeBloomLeakTemplate: React.FC<HazeBloomLeakSchemaType> = ({
  style,
  colorA,
  colorB,
  colorC,
  intensity,
  spread,
  breathBars,
  kick,
  grain,
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
    scale={spread}
    intensity={intensity}
    loopCycles={1}
    randomSeed={randomSeed}
    fragmentShader={hazeBloomLeakGlsl}
    extraUniforms={{
      uStyle: HAZE_BLOOM_LEAK_STYLES.indexOf(style),
      uBeats: beatsPerLoop({ bars }),
      uBeatOffset: (offsetMs / 1000) * (bpm / 60),
      uBreathCycles: cyclesPerLoop(bars, breathBars),
      uKick: kick,
      uGrain: grain,
    }}
  />
);
