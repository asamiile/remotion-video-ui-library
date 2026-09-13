import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

export const BoundaryScanEcho: React.FC<ScanEchoGeometryProps> = ({
  settings: p,
  progress,
  frame,
  width,
  height,
}) => {
  const vertical = p.direction === "up" || p.direction === "down";
  const reverse = p.direction === "left" || p.direction === "up";
  const length = vertical ? height : width,
    breadth = vertical ? width : height;
  const unit = Math.hypot(width, height) / 400;
  const colors = [p.primaryColor, p.secondaryColor, p.accentColor];
  const dotted = p.trailPattern === "dotted",
    broken = p.trailPattern === "broken",
    alternating = p.trailPattern === "alternating",
    diffuse = p.trailPattern === "diffuse";
  return (
    <g style={{ filter: diffuse ? `blur(${unit * 1.2}px)` : undefined }}>
      {Array.from({ length: p.trailCount }, (_, echo) => {
        const phase = (progress - echo * p.trailSpacing) * 1.8 - 0.15;
        const t = reverse ? 1 - phase : phase;
        const color = colors[echo % 3];
        const opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.7);
        const jitter =
          (random(`${p.seed}-${echo}-${Math.floor(frame / 3)}`) - 0.5) *
          unit *
          p.glitchAmount *
          4;
        const stroke = {
          fill: "none",
          stroke: color,
          strokeWidth: unit * (diffuse ? 2 : echo === 0 ? 1 : 0.5),
          strokeDasharray: dotted
            ? `0 ${unit * 4}`
            : broken
              ? `${unit * 8} ${unit * 4}`
              : undefined,
          strokeLinecap: dotted ? ("round" as const) : ("butt" as const),
        };
        if (p.mode === "radialBars") {
          const radius = t * Math.hypot(width, height) * 0.6;
          if (radius < 0) return null;
          return (
            <g key={echo} opacity={opacity}>
              {Array.from({ length: 40 }, (_, bar) => {
                if (broken && bar % 4 === 0) return null;
                const angle =
                  (bar / 40) * Math.PI * 2 +
                  (alternating && echo % 2 ? Math.PI / 40 : 0);
                const size = unit * (4 + random(`${p.seed}-bar-${bar}`) * 14);
                return (
                  <path
                    key={bar}
                    d={`M ${width / 2 + Math.cos(angle) * radius} ${height / 2 + Math.sin(angle) * radius} L ${width / 2 + Math.cos(angle) * (radius + size)} ${height / 2 + Math.sin(angle) * (radius + size)}`}
                    {...stroke}
                    strokeWidth={unit * (bar % 5 === 0 ? 2 : 0.7)}
                  />
                );
              })}
            </g>
          );
        }
        if (p.mode === "eclipse") {
          const radius = t * Math.hypot(width, height) * 0.6;
          if (radius <= 0) return null;
          const cx = width / 2,
            cy = height / 2;
          const inner = radius * (alternating && echo % 2 ? 0.35 : 0.72);
          const path = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius} A ${inner} ${radius} 0 0 0 ${cx} ${cy - radius} Z`;
          return (
            <g
              key={echo}
              opacity={opacity}
              transform={`rotate(${progress * 180 + echo * 5} ${cx} ${cy})`}
            >
              <path d={path} {...stroke} fill={color} fillOpacity={0.08} />
            </g>
          );
        }
        return (
          <g
            key={echo}
            opacity={opacity}
            transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
          >
            {p.mode === "zipper" || p.mode === "sineGate"
              ? [1, -1].map((side) => {
                  const offset = t * length * 0.65;
                  if (offset < 0) return null;
                  const path = Array.from({ length: 97 }, (_, point) => {
                    const y = (point / 96) * breadth;
                    const tooth =
                      p.mode === "zipper"
                        ? ((Math.floor(point / 2) + (side === 1 ? 1 : 0)) % 2
                            ? 1
                            : -1) *
                          length *
                          0.018
                        : Math.sin(
                            (point / 96) * Math.PI * 6 +
                              progress * 6 +
                              echo * 0.08,
                          ) *
                          length *
                          0.025;
                    const x =
                      length / 2 +
                      side * offset +
                      tooth * (alternating && echo % 2 ? -1 : 1) +
                      jitter;
                    return `${point === 0 ? "M" : "L"} ${x} ${y}`;
                  }).join(" ");
                  return <path key={side} d={path} {...stroke} />;
                })
              : p.mode === "herringbone"
                ? Array.from({ length: 18 }, (_, row) => {
                    const y = ((row + 0.5) * breadth) / 18;
                    const x = t * length + (row % 2 ? 1 : -1) * length * 0.025;
                    const bend =
                      (alternating && echo % 2 ? -1 : 1) * length * 0.07;
                    return (
                      <path
                        key={row}
                        d={`M ${x - bend} ${y - breadth / 40} L ${x} ${y} L ${x - bend} ${y + breadth / 40}`}
                        {...stroke}
                      />
                    );
                  })
                : p.mode === "circuitMaze"
                  ? Array.from({ length: 14 }, (_, row) => {
                      const noise = random(`${p.seed}-route-${row}`);
                      if (broken && noise < 0.25) return null;
                      const y = ((row + 0.5) * breadth) / 14;
                      const x = (t + (noise - 0.5) * 0.18) * length;
                      const rise =
                        (breadth / 40) * (alternating && row % 2 ? -1 : 1);
                      return (
                        <g key={row}>
                          <path
                            d={`M ${x - length * 0.17} ${y - rise} H ${x - length * 0.12} V ${y} H ${x - length * 0.04} V ${y + rise} H ${x + length * 0.08}`}
                            {...stroke}
                          />
                          <rect
                            x={x + length * 0.08 - unit}
                            y={y + rise - unit}
                            width={unit * 2}
                            height={unit * 2}
                            fill={p.accentColor}
                            rx={dotted ? unit : 0}
                          />
                        </g>
                      );
                    })
                  : p.mode === "glitchColumns"
                    ? Array.from({ length: 28 }, (_, row) => {
                        const noise = random(`${p.seed}-column-${row}`);
                        if (broken && noise < 0.25) return null;
                        const y = ((row + 0.5) * breadth) / 28;
                        const x = (t + (noise - 0.5) * 0.4) * length + jitter;
                        const segment = length * (0.02 + noise * 0.13);
                        return (
                          <rect
                            key={row}
                            x={x}
                            y={y - breadth / 90}
                            width={segment}
                            height={breadth / 45}
                            fill={color}
                            fillOpacity={alternating && row % 2 ? 0.2 : 0.65}
                            rx={dotted ? breadth / 90 : 0}
                          />
                        );
                      })
                    : Array.from({ length: 9 }, (_, row) => {
                        const y = ((row + 0.5) * breadth) / 9;
                        const x =
                          t * length +
                          Math.sin(progress * 6 + row) * length * 0.04;
                        const offset =
                          unit * 4 * (alternating && echo % 2 ? 1.5 : 1);
                        return (
                          <g key={row}>
                            <path
                              d={`M ${x - length * 0.16} ${y - offset} H ${x + length * 0.16} M ${x - length * 0.16} ${y + offset} H ${x + length * 0.16}`}
                              {...stroke}
                            />
                            <path
                              d={`M ${x - unit * 3} ${y} L ${x} ${y - unit * 3} L ${x + unit * 3} ${y} L ${x} ${y + unit * 3} Z`}
                              {...stroke}
                              fill={color}
                              fillOpacity={0.15}
                            />
                          </g>
                        );
                      })}
          </g>
        );
      })}
    </g>
  );
};
