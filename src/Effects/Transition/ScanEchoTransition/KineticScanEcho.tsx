import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

const cubeVertices = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];
const cubeEdges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export const KineticScanEcho: React.FC<ScanEchoGeometryProps> = ({
  settings: p,
  progress,
  frame,
  width,
  height,
}) => {
  const vertical = p.direction === "up" || p.direction === "down",
    reverse = p.direction === "left" || p.direction === "up";
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
        const phase = (progress - echo * p.trailSpacing) * 1.85 - 0.15,
          t = reverse ? 1 - phase : phase;
        const color = colors[echo % 3],
          opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.6);
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
        if (p.mode === "wireframeCube") {
          if (t <= 0) return null;
          const radius = t * Math.min(width, height) * 1.8;
          const yaw = progress * 1.5 + echo * (alternating ? -0.06 : 0.02),
            pitch = 0.38;
          const points = cubeVertices.map(([x, y, z]) => {
            const xx = x * Math.cos(yaw) + z * Math.sin(yaw),
              zz = -x * Math.sin(yaw) + z * Math.cos(yaw);
            const yy = y * Math.cos(pitch) - zz * Math.sin(pitch),
              depth = y * Math.sin(pitch) + zz * Math.cos(pitch);
            const focal = 3 / (3 + depth);
            return [
              width / 2 + (xx * focal * radius) / 2,
              height / 2 + (yy * focal * radius) / 2,
            ];
          });
          return (
            <g key={echo} opacity={opacity}>
              {cubeEdges.map(([a, b], index) => (
                <path
                  key={index}
                  d={`M ${points[a][0]} ${points[a][1]} L ${points[b][0]} ${points[b][1]}`}
                  {...stroke}
                />
              ))}
            </g>
          );
        }
        if (p.mode === "rotatingBlades" || p.mode === "vortexSpokes") {
          const radius = t * Math.hypot(width, height) * 0.65;
          if (radius <= 0) return null;
          return (
            <g key={echo} opacity={opacity}>
              {Array.from({ length: 16 }, (_, blade) => {
                if (broken && blade % 4 === 0) return null;
                const angle =
                  (blade / 16) * Math.PI * 2 +
                  progress * (reverse ? -2 : 2) +
                  (alternating && echo % 2 ? 0.1 : 0);
                const cx = width / 2,
                  cy = height / 2;
                const x1 = cx + Math.cos(angle) * radius * 0.3,
                  y1 = cy + Math.sin(angle) * radius * 0.3;
                const x2 = cx + Math.cos(angle + 0.18) * radius,
                  y2 = cy + Math.sin(angle + 0.18) * radius;
                const path =
                  p.mode === "rotatingBlades"
                    ? `M ${x1} ${y1} L ${x2} ${y2} L ${cx + Math.cos(angle + 0.3) * radius * 0.75} ${cy + Math.sin(angle + 0.3) * radius * 0.75} Z`
                    : `M ${x1} ${y1} Q ${cx + Math.cos(angle + 0.8) * radius * 0.7} ${cy + Math.sin(angle + 0.8) * radius * 0.7} ${x2} ${y2}`;
                return (
                  <path
                    key={blade}
                    d={path}
                    {...stroke}
                    fill={p.mode === "rotatingBlades" ? color : "none"}
                    fillOpacity={0.06}
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
            {p.mode === "sliceFan" ? (
              Array.from({ length: 24 }, (_, ray) => {
                const r = Math.max(0, t) * length * 1.4,
                  angle = (ray / 23 - 0.5) * Math.PI * 0.8;
                const cx = reverse ? length * 0.9 : length * 0.1,
                  cy = breadth / 2;
                const sign = reverse ? -1 : 1;
                return (
                  <path
                    key={ray}
                    d={`M ${cx + Math.cos(angle) * r * 0.65 * sign} ${cy + Math.sin(angle) * r * 0.65} L ${cx + Math.cos(angle) * r * sign} ${cy + Math.sin(angle) * r}`}
                    {...stroke}
                    opacity={alternating && ray % 2 ? 0.25 : 0.8}
                  />
                );
              })
            ) : p.mode === "chromaticHatch" ? (
              Array.from({ length: 32 }, (_, row) => {
                const y = ((row + 0.5) * breadth) / 32,
                  x = t * length;
                const skew = (alternating && row % 2 ? -1 : 1) * breadth * 0.07;
                return (
                  <path
                    key={row}
                    d={`M ${x - length * 0.14} ${y - skew} L ${x + length * 0.14} ${y + skew}`}
                    {...stroke}
                  />
                );
              })
            ) : p.mode === "particleRibbon" ? (
              Array.from({ length: 88 }, (_, particle) => {
                const seed = `${p.seed}-ribbon-${particle}`;
                const y = random(seed) * breadth;
                const scatter =
                  (random(`${seed}-${Math.floor(frame / 3)}`) - 0.5) *
                  unit *
                  p.glitchAmount *
                  8;
                const x =
                  t * length +
                  Math.sin(
                    (y / breadth) * Math.PI * 4 + progress * 5 + echo * 0.1,
                  ) *
                    length *
                    0.06 +
                  scatter;
                const size = unit * (0.5 + random(`${seed}-size`) * 1.5);
                if (broken && particle % 3 === 0) return null;
                return (
                  <rect
                    key={particle}
                    x={x - size / 2}
                    y={y - size / 2}
                    width={size * (alternating && echo % 2 ? 3 : 1)}
                    height={size}
                    rx={dotted ? size / 2 : 0}
                    fill={color}
                  />
                );
              })
            ) : (
              <>
                {(p.mode === "dataHelix" ? [1, -1] : [1]).map((side) => {
                  const path = Array.from({ length: 129 }, (_, point) => {
                    const y = (point / 128) * breadth;
                    const angle =
                      (point / 128) * Math.PI * 5 + progress * 6 + echo * 0.1;
                    const wave =
                      p.mode === "dataHelix"
                        ? Math.sin(angle) * length * 0.07 * side
                        : Math.pow(Math.max(0, Math.sin(angle)), 14) *
                            length *
                            0.14 *
                            (alternating && echo % 2 ? -1 : 1) -
                          length * 0.03;
                    return `${point === 0 ? "M" : "L"} ${t * length + wave} ${y}`;
                  }).join(" ");
                  return <path key={side} d={path} {...stroke} />;
                })}
                {p.mode === "dataHelix" &&
                  Array.from({ length: 30 }, (_, rung) => {
                    const y = ((rung + 0.5) * breadth) / 30;
                    const x =
                      Math.sin(
                        (y / breadth) * Math.PI * 5 + progress * 6 + echo * 0.1,
                      ) *
                      length *
                      0.07;
                    return (
                      <path
                        key={rung}
                        d={`M ${t * length - x} ${y} H ${t * length + x}`}
                        {...stroke}
                        opacity={0.3}
                      />
                    );
                  })}
              </>
            )}
          </g>
        );
      })}
    </g>
  );
};
