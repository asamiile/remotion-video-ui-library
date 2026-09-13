import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import type {SplitScreenEchoProps} from "./split-screen-echo.schema";
export const SplitScreenEchoTemplate: React.FC<SplitScreenEchoProps> = ({label, panelCount, layout, delayFrames, panelColor, accentColor, backgroundColor, motionAmount}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{backgroundColor, flexDirection: "row", gap: 8, padding: "5% 4%", overflow: "hidden"}}>{Array.from({length: panelCount}, (_, i) => {const local = Math.max(0, frame - i * delayFrames); const shift = Math.sin(local / 18) * motionAmount; const mirrored = layout === "mirror" && i % 2 === 1; const skew = layout === "diagonal" ? -9 : 0; const reveal = interpolate(local, [0, 18], [0, 1], {extrapolateRight: "clamp"}); return <div key={i} style={{position: "relative", flex: 1, overflow: "hidden", background: `linear-gradient(145deg, ${panelColor}, ${backgroundColor})`, border: `1px solid ${accentColor}88`, transform: `skewX(${skew}deg) scaleY(${reveal})`}}>
      <div style={{position: "absolute", width: 260, height: 260, borderRadius: "50%", border: `3px solid ${accentColor}`, left: `calc(50% - 130px + ${shift}px)`, top: 190 + i * 25, transform: `${mirrored ? "scaleX(-1)" : ""}`, boxShadow: `0 0 45px ${accentColor}55`}}><div style={{position: "absolute", left: 94, top: 56, width: 72, height: 72, borderRadius: "50%", backgroundColor: `${accentColor}55`}}/><div style={{position: "absolute", left: 57, top: 140, width: 146, height: 100, borderRadius: "50% 50% 12% 12%", backgroundColor: `${accentColor}22`}}/></div>
      <div style={{position: "absolute", left: 20, bottom: 22, fontFamily: "monospace", color: accentColor, fontSize: 16, letterSpacing: 3}}>{label} / {(`0${i + 1}`).slice(-2)}</div>
    </div>;})}</AbsoluteFill>;
};
