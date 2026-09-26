import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

export const PanelScanEcho: React.FC<ScanEchoGeometryProps> = ({
  settings: p,
  progress,
  frame,
  width,
  height,
}) => {
  const vertical = p.direction === "up" || p.direction === "down";
  const reverse = p.direction === "left" || p.direction === "up";
  const length = vertical ? height : width;
  const breadth = vertical ? width : height;
  const unit = Math.hypot(width, height) / 400;
  const colors = [p.primaryColor, p.secondaryColor, p.accentColor];
  const dotted = p.trailPattern === "dotted";
  const broken = p.trailPattern === "broken";
  const alternating = p.trailPattern === "alternating";
  const diffuse = p.trailPattern === "diffuse";
  return (
    <g style={{ filter: diffuse ? `blur(${unit * 1.2}px)` : undefined }}>
      {Array.from({ length: p.trailCount }, (_, echo) => {
        const phase = (progress - echo * p.trailSpacing) * 1.85 - 0.15;
        const t = reverse ? 1 - phase : phase;
        const color = colors[echo % 3];
        const opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.7);
        const style = {
          fill: "none",
          stroke: color,
          strokeWidth: unit * (diffuse ? 2 : 0.5),
          strokeDasharray: dotted
            ? `0 ${unit * 4}`
            : broken
              ? `${unit * 6} ${unit * 3}`
              : undefined,
          strokeLinecap: dotted ? ("round" as const) : ("butt" as const),
        };
        if (p.mode === "sonarFan") {
          const radius = t * Math.hypot(width, height) * 0.65;
          if (radius <= 0) return null;
          const start =
            progress * Math.PI * 2 + echo * (alternating ? -0.18 : 0.08);
          const end = start + Math.PI * 0.48;
          const cx = width / 2,
            cy = height / 2;
          const path = `M ${cx} ${cy} L ${cx + Math.cos(start) * radius} ${cy + Math.sin(start) * radius} A ${radius} ${radius} 0 0 1 ${cx + Math.cos(end) * radius} ${cy + Math.sin(end) * radius} Z`;
          return (
            <g key={echo} opacity={opacity}>
              <path d={path} {...style} fill={color} fillOpacity={0.025} />
            </g>
          );
        }
        if (p.mode === "ribbonLattice" || p.mode === "plasmaStrand") {
          return (
            <g
              key={echo}
              opacity={opacity}
              transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
            >
              {Array.from(
                { length: p.mode === "ribbonLattice" ? 4 : 3 },
                (_, strand) => {
                  const points = Array.from({ length: 81 }, (_, index) => {
                    const y = (index / 80) * breadth;
                    const angle =
                      (index / 80) *
                        Math.PI *
                        (p.mode === "ribbonLattice" ? 3 : 5) +
                      (strand * Math.PI) / 2 +
                      progress * Math.PI * 3;
                    const amplitude =
                      length * (p.mode === "ribbonLattice" ? 0.09 : 0.035);
                    const carrier =
                      p.mode === "plasmaStrand"
                        ? Math.sin((index / 80) * Math.PI * 19 + frame * 0.12) *
                          unit *
                          (1 + p.glitchAmount * 3)
                        : 0;
                    const x =
                      t * length +
                      Math.sin(angle + echo * (alternating ? 0.5 : 0.08)) *
                        amplitude +
                      carrier;
                    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
                  }).join(" ");
                  return (
                    <g key={strand}>
                      <path
                        d={points}
                        {...style}
                        strokeWidth={unit * 5}
                        opacity={0.06}
                      />
                      <path d={points} {...style} />
                    </g>
                  );
                },
              )}
            </g>
          );
        }
        const cols = 18,
          rows = 10,
          cw = length / cols,
          ch = breadth / rows;
        return (
          <g
            key={echo}
            opacity={opacity}
            transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
          >
            {Array.from({ length: cols * rows }, (_, index) => {
              const col = index % cols,
                row = Math.floor(index / cols);
              const seed = `${p.seed}-panel-${index}`;
              const noise = random(seed);
              const distance = Math.abs(
                (col + 0.5) / cols - t + (noise - 0.5) * p.glitchAmount * 0.06,
              );
              if (distance > 0.14 || (broken && noise < 0.28)) return null;
              const weight = 1 - distance / 0.14;
              const cx = (col + 0.5) * cw,
                cy = (row + 0.5) * ch;
              const half = cw * 0.4 * weight;
              if (p.mode === "microchip") {
                const route =
                  (alternating && (row + echo) % 2 ? -1 : 1) * ch * 0.3;
                return (
                  <g key={index} opacity={weight}>
                    <rect
                      x={cx - half / 2}
                      y={cy - ch * 0.13}
                      width={half}
                      height={ch * 0.26}
                      {...style}
                      fill={color}
                      fillOpacity={0.15}
                      rx={dotted ? unit * 2 : 0}
                    />
                    <path
                      d={`M ${cx + half / 2} ${cy} H ${cx + cw * 0.3} V ${cy + route} H ${cx + cw * 0.45} M ${cx - half / 2} ${cy} H ${cx - cw * 0.3} V ${cy - route} H ${cx - cw * 0.45}`}
                      {...style}
                    />
                    <circle
                      cx={cx + cw * 0.45}
                      cy={cy + route}
                      r={unit * 0.65}
                      fill={p.accentColor}
                    />
                  </g>
                );
              }
              if (p.mode === "checkerFold") {
                const fold =
                  alternating && (row + col) % 2 ? 1 - weight * 0.7 : weight;
                return (
                  <rect
                    key={index}
                    x={cx - cw * 0.42 * fold}
                    y={cy - ch * 0.42}
                    width={cw * 0.84 * fold}
                    height={ch * 0.84}
                    {...style}
                    fill={color}
                    fillOpacity={(row + col) % 2 ? 0.04 : 0.32}
                    rx={dotted ? unit * 3 : 0}
                  />
                );
              }
              const vertices = p.mode === "hexCells" ? 6 : 4;
              let points: string;
              if (p.mode === "tileSkew") {
                const skew =
                  (alternating && echo % 2 ? -1 : 1) * cw * 0.22 * weight;
                points = `${cx - half + skew},${cy - ch * 0.4} ${cx + half + skew},${cy - ch * 0.4} ${cx + half - skew},${cy + ch * 0.4} ${cx - half - skew},${cy + ch * 0.4}`;
              } else {
                points = Array.from({ length: vertices }, (_, vertex) => {
                  const angle =
                    (vertex / vertices) * Math.PI * 2 +
                    (p.mode === "hexCells" ? Math.PI / 6 : 0);
                  return `${cx + Math.cos(angle) * half},${cy + Math.sin(angle) * ch * 0.45 * weight}`;
                }).join(" ");
              }
              return (
                <polygon
                  key={index}
                  points={points}
                  {...style}
                  fill={color}
                  fillOpacity={p.mode === "tileSkew" ? 0.12 : 0.04}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
};
