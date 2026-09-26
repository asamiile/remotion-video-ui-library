import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import type {SignalSliceTransitionProps} from "./signal-slice-transition.schema";
export const SignalSliceTransitionTemplate: React.FC<SignalSliceTransitionProps> = ({sliceColorA, sliceColorB, sliceCount, direction, travelPx, jitterPx, blackoutFrames, randomSeed}) => {
  const frame = useCurrentFrame(); const {durationInFrames} = useVideoConfig(); const progress = interpolate(frame, [0, durationInFrames * 0.18, durationInFrames * 0.68, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const blackout = Math.abs(frame - durationInFrames / 2) < blackoutFrames / 2;
  return <AbsoluteFill style={{overflow: "hidden", backgroundColor: blackout ? "#000" : "transparent"}}>{Array.from({length: sliceCount}, (_, i) => {const h = 1080 / sliceCount + 2; const polarity = i % 2 ? -1 : 1; const noise = (random(`${randomSeed}-${i}`) - 0.5) * jitterPx; const x = polarity * (1 - progress) * travelPx + noise * progress; return <div key={i} style={{position: "absolute", left: -120, top: i * 1080 / sliceCount, width: 2160, height: h, background: `linear-gradient(90deg, transparent, ${i % 2 ? sliceColorA : sliceColorB}bb, transparent)`, opacity: progress * 0.82, transform: `translateX(${x}px) skewX(${direction === "diagonal" ? -18 : 0}deg)`, mixBlendMode: "screen"}}/>;})}</AbsoluteFill>;
};
