import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

export const FragmentScanEcho: React.FC<ScanEchoGeometryProps> = ({
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
  return (
    <g
      style={{
        filter:
          p.trailPattern === "diffuse" ? `blur(${unit * 1.5}px)` : undefined,
      }}
    >
      {Array.from({ length: p.trailCount }, (_, echo) => {
        const phase = (progress - echo * p.trailSpacing) * 1.7 - 0.12;
        const t = reverse ? 1 - phase : phase;
        const color = colors[echo % 3];
        const opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.8);
        const dotted = p.trailPattern === "dotted";
        const broken = p.trailPattern === "broken";
        const alternating = p.trailPattern === "alternating";
        const dash = dotted
          ? `0 ${unit * 5}`
          : broken
            ? `${unit * 8} ${unit * 4}`
            : undefined;
        if (p.mode === "pixelStorm") {
          if (t < 0) return null;
          return (
            <g key={echo} opacity={opacity}>
              {Array.from({ length: 72 }, (_, index) => {
                const seed = `${p.seed}-particle-${index}`;
                const angle = random(seed) * Math.PI * 2;
                const speed = 0.3 + random(`${seed}-speed`) * 0.8;
                const radius = t * Math.hypot(width, height) * speed;
                const drift =
                  (random(`${seed}-${Math.floor(frame / 3)}`) - 0.5) *
                  unit *
                  4 *
                  p.glitchAmount;
                const size = unit * (1 + random(`${seed}-size`) * 3);
                if (broken && index % 3 === 0) return null;
                const x = width / 2 + Math.cos(angle) * radius + drift;
                const y =
                  height / 2 +
                  Math.sin(angle) *
                    radius *
                    (alternating && echo % 2 ? 0.6 : 1);
                return (
                  <rect
                    key={index}
                    x={x - size / 2}
                    y={y - size / 2}
                    width={size * (alternating ? 2 : 1)}
                    height={size}
                    rx={dotted ? size / 2 : 0}
                    fill={color}
                    fillOpacity={echo === 0 ? 0.9 : 0.35}
                    stroke={color}
                    strokeWidth={unit * 0.25}
                  />
                );
              })}
            </g>
          );
        }
        if (p.mode === "fracture") {
          if (t < 0) return null;
          return (
            <g
              key={echo}
              opacity={opacity}
              fill="none"
              stroke={color}
              strokeWidth={unit * (echo === 0 ? 0.8 : 0.35)}
              strokeDasharray={dash}
              strokeLinecap={dotted ? "round" : "butt"}
            >
              {Array.from({ length: 13 }, (_, ray) => {
                const angle =
                  (ray / 13) * Math.PI * 2 +
                  random(`${p.seed}-${ray}`) * 0.2 +
                  (alternating && echo % 2 ? Math.PI / 13 : 0);
                const radius = t * Math.hypot(width, height) * 0.7;
                const points = Array.from({ length: 9 }, (_, segment) => {
                  const r = radius * (0.35 + (segment / 8) * 0.65);
                  const bend =
                    (random(`${p.seed}-${ray}-${segment}`) - 0.5) *
                    (0.15 + p.glitchAmount * 0.2);
                  return `${segment === 0 ? "M" : "L"} ${width / 2 + Math.cos(angle + bend) * r} ${height / 2 + Math.sin(angle + bend) * r}`;
                }).join(" ");
                return <path key={ray} d={points} />;
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
            {Array.from(
              { length: p.mode === "venetian" ? 18 : 10 },
              (_, row) => {
                if (p.mode === "venetian") {
                  const y = (row * breadth) / 18;
                  const h = breadth / 18;
                  const stagger =
                    (random(`${p.seed}-slat-${row}`) - 0.5) * 0.28;
                  const travel = alternating && row % 2 ? 1 - t : t;
                  const x = (travel + stagger) * length;
                  return (
                    <path
                      key={row}
                      d={`M ${x - length * 0.22} ${y + h / 2} H ${x}`}
                      stroke={color}
                      strokeWidth={h * (dotted ? 0.2 : 0.65)}
                      strokeDasharray={dash}
                      strokeLinecap={dotted ? "round" : "butt"}
                    />
                  );
                }
                const path = Array.from({ length: 65 }, (_, point) => {
                  const y = (point / 64) * breadth;
                  const ripple =
                    Math.sin(
                      (point / 64) *
                        Math.PI *
                        (alternating && echo % 2 ? 3 : 4) +
                        row * 0.35 +
                        phase * Math.PI * 4,
                    ) *
                    length *
                    0.08;
                  const carrier =
                    Math.sin((point / 64) * Math.PI * 13 + echo * 0.4) *
                    unit *
                    p.glitchAmount *
                    3;
                  const x =
                    t * length + (row - 5) * unit * 3 + ripple + carrier;
                  return `${point === 0 ? "M" : "L"} ${x} ${y}`;
                }).join(" ");
                return (
                  <path
                    key={row}
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={unit * 0.25}
                    strokeDasharray={dash}
                    strokeLinecap={dotted ? "round" : "butt"}
                    opacity={0.6}
                  />
                );
              },
            )}
          </g>
        );
      })}
    </g>
  );
};
