import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

export const DepthScanEcho: React.FC<ScanEchoGeometryProps> = ({
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
  const dash = dotted
    ? `0 ${unit * 5}`
    : broken
      ? `${unit * 10} ${unit * 5} ${unit} ${unit * 3}`
      : undefined;
  return (
    <g style={{ filter: diffuse ? `blur(${unit * 1.4}px)` : undefined }}>
      {Array.from({ length: p.trailCount }, (_, echo) => {
        const phase = (progress - echo * p.trailSpacing) * 1.85 - 0.15;
        const t = reverse ? 1 - phase : phase;
        const color = colors[echo % 3];
        const opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.6);
        const jitter =
          (random(`${p.seed}-${echo}-${Math.floor(frame / 3)}`) - 0.5) *
          unit *
          3 *
          p.glitchAmount;
        const stroke = {
          fill: "none",
          stroke: color,
          strokeWidth: unit * (diffuse ? 2.4 : echo === 0 ? 1 : 0.5),
          strokeDasharray: dash,
          strokeLinecap: dotted ? ("round" as const) : ("butt" as const),
        };
        if (p.mode === "tunnel") {
          if (t <= 0) return null;
          const scale = t * t * 2.8;
          const w = width * scale;
          const h = height * scale;
          const cx = width / 2 + jitter;
          const cy = height / 2;
          const skew = alternating && echo % 2 ? w * 0.1 : 0;
          const path = `M ${cx - w / 2 + skew} ${cy - h / 2} L ${cx + w / 2 - skew} ${cy - h / 2} L ${cx + w / 2 + skew} ${cy + h / 2} L ${cx - w / 2 - skew} ${cy + h / 2} Z`;
          return (
            <g key={echo} opacity={opacity}>
              <path
                d={path}
                {...stroke}
                strokeWidth={unit * 7}
                opacity={0.06}
              />
              <path d={path} {...stroke} />
              {echo === 0 && (
                <path
                  d={`M ${cx - w / 2 + skew} ${cy - h / 2} L 0 0 M ${cx + w / 2 - skew} ${cy - h / 2} L ${width} 0 M ${cx + w / 2 + skew} ${cy + h / 2} L ${width} ${height} M ${cx - w / 2 - skew} ${cy + h / 2} L 0 ${height}`}
                  {...stroke}
                  opacity={0.3}
                />
              )}
            </g>
          );
        }
        if (p.mode === "perspectiveGrid") {
          if (t < 0) return null;
          const spread = t * t * breadth * 1.5;
          const horizon = breadth * 0.35;
          const y = horizon + spread;
          const left = length / 2 - spread * 1.5;
          const right = length / 2 + spread * 1.5;
          return (
            <g
              key={echo}
              opacity={opacity}
              transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
            >
              <path
                d={`M ${left} ${y} H ${right} M ${left} ${horizon - spread * 0.45} H ${right}`}
                {...stroke}
              />
              {Array.from({ length: 11 }, (_, col) => (
                <path
                  key={col}
                  d={`M ${length / 2} ${horizon} L ${length / 2 + (col - 5) * spread * 0.3} ${y}`}
                  {...stroke}
                  opacity={0.2}
                />
              ))}
              {alternating && (
                <path
                  d={`M ${left} ${y} L ${right} ${horizon - spread * 0.45}`}
                  {...stroke}
                  opacity={0.4}
                />
              )}
            </g>
          );
        }
        if (p.mode === "orbitSlice") {
          const radius = t * Math.hypot(width, height) * 0.65;
          if (radius <= 0) return null;
          const rotation = progress * 100 + echo * (alternating ? -12 : 4);
          return (
            <g
              key={echo}
              opacity={opacity}
              transform={`rotate(${rotation} ${width / 2} ${height / 2})`}
            >
              <ellipse
                cx={width / 2 + jitter}
                cy={height / 2}
                rx={radius}
                ry={radius * 0.4}
                {...stroke}
              />
              <path
                d={`M ${width / 2 - radius} ${height / 2} L ${width / 2 - radius * 0.65} ${height / 2 - radius * 0.25} M ${width / 2 + radius} ${height / 2} L ${width / 2 + radius * 0.65} ${height / 2 + radius * 0.25}`}
                {...stroke}
                stroke={p.accentColor}
              />
            </g>
          );
        }
        if (p.mode === "brokenLens") {
          const radius = t * Math.hypot(width, height) * 0.65;
          if (radius <= 0) return null;
          return (
            <g key={echo} opacity={opacity}>
              {Array.from({ length: 12 }, (_, sector) => {
                if (broken && sector % 3 === 0) return null;
                const angle =
                  (sector / 12) * Math.PI * 2 +
                  (alternating && echo % 2 ? 0.12 : 0);
                const gap =
                  0.04 + random(`${p.seed}-${sector}`) * 0.1 * p.glitchAmount;
                const a = angle + gap;
                const b = angle + Math.PI / 6 - gap;
                const inner = radius * 0.83;
                const cx = width / 2 + Math.cos(angle) * jitter;
                const cy = height / 2 + Math.sin(angle) * jitter;
                const path = `M ${cx + Math.cos(a) * radius} ${cy + Math.sin(a) * radius} A ${radius} ${radius} 0 0 1 ${cx + Math.cos(b) * radius} ${cy + Math.sin(b) * radius} L ${cx + Math.cos(b) * inner} ${cy + Math.sin(b) * inner} A ${inner} ${inner} 0 0 0 ${cx + Math.cos(a) * inner} ${cy + Math.sin(a) * inner} Z`;
                return (
                  <path
                    key={sector}
                    d={path}
                    {...stroke}
                    fill={color}
                    fillOpacity={echo === 0 ? 0.12 : 0.03}
                  />
                );
              })}
            </g>
          );
        }
        return (
          <g
            key={echo}
            opacity={opacity}
            transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
          >
            {p.mode === "prism" ? (
              <>
                <path
                  d={`M ${t * length - length * 0.25} ${-breadth * 0.2} L ${t * length + length * 0.2} ${breadth / 2} L ${t * length - length * 0.25} ${breadth * 1.2} Z`}
                  {...stroke}
                  fill={color}
                  fillOpacity={0.06}
                />
                <path
                  d={`M ${t * length - length * 0.25} ${-breadth * 0.2} L ${t * length - length * 0.05} ${breadth / 2} L ${t * length - length * 0.25} ${breadth * 1.2} M ${t * length - length * 0.05} ${breadth / 2} H ${t * length + length * 0.2}`}
                  {...stroke}
                  opacity={alternating && echo % 2 ? 0.8 : 0.35}
                />
              </>
            ) : p.mode === "contourTerrain" ? (
              <path
                d={Array.from({ length: 97 }, (_, point) => {
                  const y = (point / 96) * breadth;
                  const terrain =
                    Math.sin((point / 96) * Math.PI * 4 + echo * 0.15) *
                      length *
                      0.055 +
                    Math.cos((point / 96) * Math.PI * 9) * length * 0.025;
                  const x =
                    t * length +
                    terrain * (alternating && echo % 2 ? -1 : 1) +
                    jitter;
                  return `${point === 0 ? "M" : "L"} ${x} ${y}`;
                }).join(" ")}
                {...stroke}
              />
            ) : p.mode === "binaryCurtain" ? (
              Array.from({ length: 30 }, (_, col) => {
                const noise = random(`${p.seed}-${col}`);
                if (broken && noise < 0.25) return null;
                const x = (t + (noise - 0.5) * 0.35) * length;
                const y = ((col + 0.5) * breadth) / 30;
                const segment = length * (0.025 + noise * 0.07);
                return (
                  <g key={col}>
                    <rect
                      x={x}
                      y={y - breadth / 130}
                      width={segment}
                      height={breadth / 65}
                      rx={dotted ? breadth / 130 : 0}
                      fill={color}
                      fillOpacity={0.55}
                    />
                    <path
                      d={`M ${x - segment * 2} ${y} H ${x - segment * 0.4}`}
                      {...stroke}
                      opacity={alternating && col % 2 ? 0.15 : 0.65}
                    />
                  </g>
                );
              })
            ) : (
              Array.from({ length: 20 }, (_, row) => {
                const y = ((row + 0.5) * breadth) / 20;
                const x = (row % 2 ? 1 - t : t) * length;
                const skew = alternating && echo % 2 ? breadth / 40 : 0;
                return (
                  <path
                    key={row}
                    d={`M ${x - length * 0.12} ${y - skew} L ${x + length * 0.12} ${y + skew} M ${x} ${y - breadth / 45} V ${y + breadth / 45}`}
                    {...stroke}
                  />
                );
              })
            )}
          </g>
        );
      })}
    </g>
  );
};
