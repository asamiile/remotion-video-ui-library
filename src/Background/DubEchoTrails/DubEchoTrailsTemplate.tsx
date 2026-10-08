import React from "react";
import { ShaderBackgroundLayer } from "../../helpers/shader/background/ShaderBackgroundLayer";
import { beatsPerLoop } from "../../helpers/tempo";
import { dubEchoTrailsGlsl } from "./dub-echo-trails.glsl";
import {
  DUB_ECHO_TRAILS_STYLES,
  type DubEchoTrailsSchemaType,
} from "./dub-echo-trails.schema";

/** Transparent tempo-synced marks repeating like a dub delay. */
export const DubEchoTrailsTemplate: React.FC<DubEchoTrailsSchemaType> = ({
  style,
  colorA,
  colorB,
  colorC,
  hitEveryBeats,
  delayBeats,
  feedback,
  echoes,
  spread,
  lineWidth,
  size,
  accentEvery,
  bpm,
  bars,
  offsetMs,
  randomSeed,
  backgroundColor,
}) => {
  const beats = beatsPerLoop({ bars });
  const hits = Math.max(1, Math.round(beats / hitEveryBeats));
  return (
    <ShaderBackgroundLayer
      backgroundColor={backgroundColor}
      colorA={colorA}
      colorB={colorB}
      colorC={colorC}
      scale={1}
      intensity={1}
      loopCycles={1}
      randomSeed={randomSeed}
      fragmentShader={dubEchoTrailsGlsl}
      extraUniforms={{
        uStyle: DUB_ECHO_TRAILS_STYLES.indexOf(style),
        uBeats: beats,
        uBeatOffset: (offsetMs / 1000) * (bpm / 60),
        uHits: hits,
        uHitEvery: beats / hits,
        uDelay: delayBeats,
        uFeedback: feedback,
        uEchoes: echoes,
        uSpread: spread,
        uLineWidth: lineWidth,
        uSize: size,
        uAccentEvery: accentEvery,
      }}
    />
  );
};
