import React from "react";
import { random } from "remotion";
import type { ScanEchoGeometryProps } from "./GeometricScanEcho";

export const RadarScanEcho: React.FC<ScanEchoGeometryProps> = ({
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
  const diagonal = Math.hypot(width, height),
    unit = diagonal / 400;
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
          opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.7);
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
        const radius = t * diagonal * 0.65;
        const cx = width / 2,
          cy = height / 2;
        const point = (angle: number, r = radius) =>
          `${cx + Math.cos(angle) * r} ${cy + Math.sin(angle) * r}`;
        const spin =
          progress * Math.PI * 2 * (reverse ? -1 : 1) +
          echo * (alternating ? -0.08 : 0.04);
        if (
          [
            "radarSweep",
            "polarGrid",
            "segmentedIris",
            "cometArc",
            "starGate",
            "lensSlits",
            "orbitalNodes",
          ].includes(p.mode)
        ) {
          if (radius <= 0) return null;
          return (
            <g key={echo} opacity={opacity}>
              {p.mode === "radarSweep" ? (
                <>
                  <path
                    d={`M ${cx} ${cy} L ${point(spin)} A ${radius} ${radius} 0 0 1 ${point(spin + 0.9)} Z`}
                    {...stroke}
                    fill={color}
                    fillOpacity={0.025}
                  />
                  {Array.from({ length: 9 }, (_, tick) => {
                    const a = spin + tick * 0.1;
                    return (
                      <path
                        key={tick}
                        d={`M ${point(a, radius * 0.9)} L ${point(a)}`}
                        {...stroke}
                        opacity={0.5}
                      />
                    );
                  })}
                </>
              ) : p.mode === "polarGrid" ? (
                <>
                  <circle cx={cx} cy={cy} r={radius} {...stroke} />
                  {Array.from({ length: 12 }, (_, ray) => {
                    const a =
                      (ray / 12) * Math.PI * 2 +
                      (alternating && echo % 2 ? Math.PI / 12 : 0);
                    return (
                      <path
                        key={ray}
                        d={`M ${point(a, radius * 0.6)} L ${point(a)}`}
                        {...stroke}
                        opacity={0.45}
                      />
                    );
                  })}
                </>
              ) : p.mode === "segmentedIris" ? (
                Array.from({ length: 16 }, (_, segment) => {
                  if (broken && segment % 3 === 0) return null;
                  const a = (segment / 16) * Math.PI * 2 + spin * 0.15,
                    b = a + 0.28;
                  return (
                    <path
                      key={segment}
                      d={`M ${point(a)} L ${point(b)} L ${point(b - 0.04, radius * 0.78)} L ${point(a + 0.04, radius * 0.78)} Z`}
                      {...stroke}
                      fill={color}
                      fillOpacity={0.09}
                    />
                  );
                })
              ) : p.mode === "cometArc" ? (
                <>
                  <path
                    d={`M ${point(spin - 1.6)} A ${radius} ${radius} 0 0 1 ${point(spin)}`}
                    {...stroke}
                  />
                  {Array.from({ length: 12 }, (_, dot) => {
                    const a = spin - dot * 0.08;
                    return (
                      <circle
                        key={dot}
                        cx={cx + Math.cos(a) * radius}
                        cy={cy + Math.sin(a) * radius}
                        r={unit * (1 - dot / 13)}
                        fill={color}
                        opacity={1 - dot / 13}
                      />
                    );
                  })}
                </>
              ) : p.mode === "starGate" ? (
                <path
                  d={
                    Array.from({ length: 11 }, (_, vertex) => {
                      const a =
                        (vertex / 10) * Math.PI * 2 - Math.PI / 2 + spin * 0.12;
                      return `${vertex === 0 ? "M" : "L"} ${point(a, radius * (vertex % 2 ? 0.6 : 1))}`;
                    }).join(" ") + " Z"
                  }
                  {...stroke}
                />
              ) : p.mode === "lensSlits" ? (
                Array.from({ length: 4 }, (_, slit) => {
                  const squeeze = 0.18 + slit * 0.13;
                  return (
                    <ellipse
                      key={slit}
                      cx={cx}
                      cy={cy}
                      rx={radius}
                      ry={radius * squeeze}
                      {...stroke}
                      transform={`rotate(${spin * 12 + (alternating && echo % 2 ? 45 : 0)} ${cx} ${cy})`}
                      opacity={0.75 - slit * 0.12}
                    />
                  );
                })
              ) : (
                <>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    {...stroke}
                    opacity={0.2}
                  />
                  {Array.from({ length: 18 }, (_, node) => {
                    if (broken && node % 4 === 0) return null;
                    const a = (node / 18) * Math.PI * 2 + spin * 0.25;
                    const x = cx + Math.cos(a) * radius,
                      y = cy + Math.sin(a) * radius;
                    return (
                      <g key={node}>
                        <circle
                          cx={x}
                          cy={y}
                          r={unit * 1.7}
                          {...stroke}
                          fill={color}
                          fillOpacity={0.15}
                        />
                        {node % 3 === 0 && (
                          <path
                            d={`M ${x} ${y} L ${point(a + 0.6, radius * 0.7)}`}
                            {...stroke}
                            opacity={0.35}
                          />
                        )}
                      </g>
                    );
                  })}
                </>
              )}
            </g>
          );
        }
        const jitter =
          (random(`${p.seed}-${echo}-${Math.floor(frame / 3)}`) - 0.5) *
          unit *
          p.glitchAmount *
          4;
        return (
          <g
            key={echo}
            opacity={opacity}
            transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
          >
            {p.mode === "diamondShards"
              ? Array.from({ length: 64 }, (_, shard) => {
                  const noise = random(`${p.seed}-shard-${shard}`);
                  if (broken && noise < 0.25) return null;
                  const x = (t + (noise - 0.5) * 0.3) * length + jitter,
                    y = random(`${p.seed}-y-${shard}`) * breadth;
                  const size = unit * (1 + noise * 4);
                  return (
                    <path
                      key={shard}
                      d={`M ${x - size} ${y} L ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} Z`}
                      {...stroke}
                      fill={color}
                      fillOpacity={alternating && shard % 2 ? 0.05 : 0.35}
                    />
                  );
                })
              : p.mode === "spectrumBars"
                ? Array.from({ length: 30 }, (_, bar) => {
                    const x = t * length + ((bar - 15) * length) / 120,
                      y = breadth / 2;
                    const magnitude =
                      (0.12 + random(`${p.seed}-spectrum-${bar}`) * 0.35) *
                      breadth;
                    return (
                      <path
                        key={bar}
                        d={`M ${x} ${y - magnitude} V ${y + magnitude}`}
                        {...stroke}
                        strokeWidth={
                          unit * (alternating && bar % 2 ? 0.6 : 1.4)
                        }
                      />
                    );
                  })
                : Array.from(
                    { length: p.mode === "rasterComb" ? 32 : 12 },
                    (_, row) => {
                      const count = p.mode === "rasterComb" ? 32 : 12,
                        y = ((row + 0.5) * breadth) / count;
                      const x = t * length + jitter;
                      const side = alternating && row % 2 ? -1 : 1;
                      const path =
                        p.mode === "rasterComb"
                          ? `M ${x - length * 0.1} ${y} H ${x} V ${y + (breadth / count) * 0.5} H ${x + length * 0.07}`
                          : p.mode === "voltageFork"
                            ? `M ${x - length * 0.16} ${y} H ${x - length * 0.05} L ${x + length * 0.08} ${y - (breadth / count) * 0.3} M ${x - length * 0.05} ${y} L ${x + length * 0.08} ${y + (breadth / count) * 0.3}`
                            : `M ${x - length * 0.06} ${y - (breadth / count) * 0.35} L ${x + length * 0.08 * side} ${y - (breadth / count) * 0.2} L ${x + length * 0.06} ${y + (breadth / count) * 0.35} L ${x - length * 0.08 * side} ${y + (breadth / count) * 0.2} Z`;
                      return (
                        <path
                          key={row}
                          d={path}
                          {...stroke}
                          fill={p.mode === "phasePanels" ? color : "none"}
                          fillOpacity={0.08}
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
