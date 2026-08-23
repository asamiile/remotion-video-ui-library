import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {RadialAnalysisHUDProps} from "./radial-analysis-hud.schema";
export const RadialAnalysisHUDTemplate: React.FC<RadialAnalysisHUDProps> = ({title, subject, status, primaryColor, secondaryColor, ringCount, gaugeValue, scale, rotationSpeed}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const enter = spring({frame, fps, config: {damping: 18}}); const angle = frame * rotationSpeed * .35;
  const commonText: React.CSSProperties = {position: "absolute", fontFamily: "monospace", letterSpacing: 6, color: primaryColor, textShadow: `0 0 14px ${primaryColor}`, whiteSpace: "nowrap"};
  return <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: interpolate(enter, [0, 1], [0, 1])}}>
    <div style={{position: "relative", width: 720, height: 720, transform: `scale(${scale * enter})`}}>
      <svg width="720" height="720" viewBox="0 0 720 720" style={{filter: `drop-shadow(0 0 9px ${primaryColor})`}}><g transform={`translate(360 360) rotate(${angle})`} fill="none">{Array.from({length: ringCount}, (_, i) => <circle key={i} r={95 + i * 43} stroke={i % 2 ? secondaryColor : primaryColor} strokeWidth={i === 0 ? 3 : 1.5} strokeDasharray={`${18 + i * 9} ${8 + i * 5}`} opacity={.85 - i * .07}/>)}</g><circle cx="360" cy="360" r="56" fill={`${primaryColor}18`} stroke={primaryColor}/><path d="M360 40v50M360 630v50M40 360h50M630 360h50" stroke={secondaryColor} strokeWidth="2"/></svg>
      <div style={{...commonText, top: 328, left: 0, width: "100%", textAlign: "center", fontSize: 28, letterSpacing: 3}}>{subject}</div>
      <div style={{...commonText, top: 72, left: 540, fontSize: 18}}>{(`00${Math.round(gaugeValue)}`).slice(-3)}%</div>
      <div style={{...commonText, top: 610, left: 42, fontSize: 16, color: secondaryColor}}>{status}</div>
    </div><div style={{...commonText, top: 116, fontSize: 24}}>{title}</div>
  </AbsoluteFill>;
};
