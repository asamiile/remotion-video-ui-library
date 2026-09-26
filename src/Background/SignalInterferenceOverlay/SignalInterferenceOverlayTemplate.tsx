import React from "react";
import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import type {SignalInterferenceOverlayProps} from "./signal-interference-overlay.schema";
export const SignalInterferenceOverlayTemplate: React.FC<SignalInterferenceOverlayProps> = ({lineColor, redChannel, cyanChannel, scanlineOpacity, blockCount, maxOffset, intensity, randomSeed}) => {
  const frame = useCurrentFrame(); const generation = Math.floor(frame / 3);
  return <AbsoluteFill style={{overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, opacity: scanlineOpacity, backgroundImage: `repeating-linear-gradient(0deg, ${lineColor} 0 1px, transparent 1px 5px)`}}/>
    {Array.from({length: blockCount}, (_, i) => {const key = `${randomSeed}-${generation}-${i}`; const y = random(`${key}-y`) * 1080; const h = 2 + random(`${key}-h`) * 38; const x = (random(`${key}-x`) - 0.5) * maxOffset; const color = i % 2 ? cyanChannel : redChannel; return <div key={i} style={{position: "absolute", left: `${random(`${key}-l`) * 72}%`, top: y, width: `${8 + random(`${key}-w`) * 38}%`, height: h, transform: `translateX(${x}px)`, backgroundColor: color, opacity: intensity * (0.12 + random(`${key}-o`) * 0.35), mixBlendMode: "screen"}}/>;})}
  </AbsoluteFill>;
};
