import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import type {HolographicDepthGridProps} from "./holographic-depth-grid.schema";

export const HolographicDepthGridTemplate: React.FC<HolographicDepthGridProps> = ({backgroundColor, gridColor, accentColor, horizonPercent, lineCount, rayCount, speed, orbSize, glowIntensity}) => {
  const frame = useCurrentFrame();
  const phase = (frame * speed) % 30 / 30;
  const rotation = frame * speed * 0.18;
  return <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${horizonPercent}%, ${gridColor}22, transparent 35%), ${backgroundColor}`, overflow: "hidden"}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <g opacity={0.7} stroke={gridColor} fill="none" style={{filter: `drop-shadow(0 0 ${10 * glowIntensity}px ${gridColor})`}}>
        {Array.from({length: rayCount}, (_, i) => {const x = interpolate(i, [0, rayCount - 1], [-900, 2820]); return <line key={i} x1="960" y1={horizonPercent * 10.8} x2={x} y2="1080" strokeWidth="2"/>;})}
        {Array.from({length: lineCount}, (_, i) => {const t = (i + phase) / lineCount; const eased = t * t; const y = horizonPercent * 10.8 + eased * (1080 - horizonPercent * 10.8); return <line key={i} x1="0" y1={y} x2="1920" y2={y} strokeWidth={1 + eased * 3} opacity={0.25 + eased * 0.7}/>;})}
      </g>
      {orbSize > 0 ? <g transform={`translate(960 ${horizonPercent * 10.8}) rotate(${rotation})`} fill="none" stroke={accentColor} style={{filter: `drop-shadow(0 0 ${16 * glowIntensity}px ${accentColor})`}}>
        <circle r={orbSize / 2} strokeWidth="2"/><ellipse rx={orbSize / 2} ry={orbSize / 7}/><ellipse rx={orbSize / 2} ry={orbSize / 7} transform="rotate(60)"/><ellipse rx={orbSize / 2} ry={orbSize / 7} transform="rotate(120)"/><circle r={orbSize / 3} strokeDasharray="8 14"/>
      </g> : null}
    </svg>
  </AbsoluteFill>;
};
