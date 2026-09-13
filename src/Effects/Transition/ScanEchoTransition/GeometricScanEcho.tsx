import React from "react";
import { RadarScanEcho } from "./RadarScanEcho";
import { KineticScanEcho } from "./KineticScanEcho";
import { BoundaryScanEcho } from "./BoundaryScanEcho";
import { PanelScanEcho } from "./PanelScanEcho";
import { DepthScanEcho } from "./DepthScanEcho";
import { FragmentScanEcho } from "./FragmentScanEcho";
import { random } from "remotion";
import { ScanEchoTransitionProps } from "./scan-echo-transition.schema";

export type ScanEchoGeometryProps = {
  settings: ScanEchoTransitionProps;
  progress: number;
  frame: number;
  width: number;
  height: number;
};

/** SVG geometry in a normalized scan space, with explicit frame-delayed echoes. */
export const GeometricScanEcho: React.FC<ScanEchoGeometryProps> = ({
  settings: p,
  progress,
  frame,
  width,
  height,
}) => {
  if (
    [
      "radarSweep",
      "polarGrid",
      "segmentedIris",
      "cometArc",
      "starGate",
      "lensSlits",
      "rasterComb",
      "voltageFork",
      "diamondShards",
      "orbitalNodes",
      "spectrumBars",
      "phasePanels",
    ].includes(p.mode)
  )
    return (
      <RadarScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  if (
    [
      "wireframeCube",
      "rotatingBlades",
      "chromaticHatch",
      "dataHelix",
      "oscillograph",
      "vortexSpokes",
      "sliceFan",
      "particleRibbon",
    ].includes(p.mode)
  )
    return (
      <KineticScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  if (
    [
      "herringbone",
      "zipper",
      "circuitMaze",
      "radialBars",
      "eclipse",
      "sineGate",
      "glitchColumns",
      "pulseRails",
    ].includes(p.mode)
  )
    return (
      <BoundaryScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  if (
    [
      "tileSkew",
      "checkerFold",
      "diamondGrid",
      "hexCells",
      "microchip",
      "ribbonLattice",
      "sonarFan",
      "plasmaStrand",
    ].includes(p.mode)
  )
    return (
      <PanelScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  if (
    [
      "tunnel",
      "perspectiveGrid",
      "orbitSlice",
      "prism",
      "contourTerrain",
      "binaryCurtain",
      "brokenLens",
      "interlace",
    ].includes(p.mode)
  )
    return (
      <DepthScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  if (["venetian", "pixelStorm", "fracture", "moire"].includes(p.mode))
    return (
      <FragmentScanEcho
        settings={p}
        progress={progress}
        frame={frame}
        width={width}
        height={height}
      />
    );
  const vertical = p.direction === "up" || p.direction === "down";
  const reverse = p.direction === "left" || p.direction === "up";
  const length = vertical ? height : width;
  const breadth = vertical ? width : height;
  const colors = [p.primaryColor, p.secondaryColor, p.accentColor];
  const diagonal = Math.hypot(width, height);
  const stroke = Math.max(2, diagonal / 260);
  const echoes = Array.from({ length: p.trailCount }, (_, echo) => {
    const phase = (progress - echo * p.trailSpacing) * 1.8 - 0.15;
    const travel = reverse ? 1 - phase : phase;
    const jitter =
      (random(`${p.seed}-${echo}-${Math.floor(frame / 2)}`) - 0.5) *
      stroke *
      3 *
      p.glitchAmount;
    const opacity = Math.pow(1 - echo / (p.trailCount + 1), 1.6);
    const color = colors[echo % 3];
    const broken = p.trailPattern === "broken";
    const alternating = p.trailPattern === "alternating";
    const dotted = p.trailPattern === "dotted";
    const diffuse = p.trailPattern === "diffuse";
    const dash = dotted
      ? `0 ${stroke * 4}`
      : broken
        ? `${stroke * 7} ${stroke * 4} ${stroke} ${stroke * 3}`
        : undefined;
    const lineWidth =
      (echo === 0 ? stroke * 1.6 : stroke * 0.7) * (diffuse ? 3 : 1);
    const position = travel * length + jitter;
    const common = {
      fill: "none",
      stroke: color,
      strokeWidth: lineWidth,
      strokeDasharray: dash,
      strokeLinecap: dotted ? ("round" as const) : ("butt" as const),
      strokeOpacity: diffuse ? 0.45 : 1,
    };
    if (p.mode === "ring") {
      const radius = travel * diagonal * 0.62;
      if (radius <= 0) return null;
      return (
        <g key={echo} opacity={opacity}>
          <ellipse
            cx={width / 2 + jitter}
            cy={height / 2}
            rx={radius}
            ry={radius * (alternating ? 0.55 + (echo % 2) * 0.35 : 1)}
            {...common}
            strokeWidth={lineWidth * 5}
            opacity={0.08}
          />
          <ellipse
            cx={width / 2 + jitter}
            cy={height / 2}
            rx={radius}
            ry={radius * (alternating ? 0.55 + (echo % 2) * 0.35 : 1)}
            {...common}
            strokeDashoffset={frame * (reverse ? -3 : 3) + echo * 19}
          />
          <circle
            cx={width / 2 + radius}
            cy={height / 2}
            r={stroke}
            fill={p.accentColor}
          />
        </g>
      );
    }
    if (p.mode === "cross") {
      const offset = travel * diagonal * 0.5;
      if (offset < 0) return null;
      const spread = alternating && echo % 2 === 1 ? offset * 0.65 : offset;
      return (
        <g key={echo} opacity={opacity} {...common}>
          <path
            d={`M ${width / 2 - offset} 0 V ${height} M ${width / 2 + offset} 0 V ${height} M 0 ${height / 2 - spread} H ${width} M 0 ${height / 2 + spread} H ${width}`}
          />
          <rect
            x={width / 2 - offset}
            y={height / 2 - spread}
            width={offset * 2}
            height={spread * 2}
            opacity={0.12}
            strokeWidth={stroke * 5}
          />
        </g>
      );
    }
    if (p.mode === "hexagon" || p.mode === "iris") {
      const radius = travel * diagonal * 0.7;
      if (radius <= 0) return null;
      const sides = p.mode === "hexagon" ? 6 : 8;
      const spin =
        p.mode === "iris"
          ? progress * Math.PI * (reverse ? -1 : 1) + echo * 0.08
          : Math.PI / 6;
      const points = Array.from({ length: sides }, (_, side) => {
        const angle = (side / sides) * Math.PI * 2 + spin;
        const r = radius * (alternating && side % 2 ? 0.7 : 1);
        return `${width / 2 + Math.cos(angle) * r},${height / 2 + Math.sin(angle) * r}`;
      }).join(" ");
      return (
        <g key={echo} opacity={opacity}>
          <polygon
            points={points}
            {...common}
            strokeWidth={stroke * 8}
            opacity={0.07}
          />
          <polygon points={points} {...common} />
        </g>
      );
    }
    if (p.mode === "arc") {
      const radius = travel * diagonal * 0.65;
      if (radius <= 0) return null;
      const rotation =
        progress * Math.PI * 1.5 + echo * (alternating ? 0.4 : 0.09);
      const cx = width / 2;
      const cy = height / 2;
      const a = rotation;
      const b = rotation + Math.PI * 1.3;
      const arcPath = `M ${cx + Math.cos(a) * radius} ${cy + Math.sin(a) * radius} A ${radius} ${radius} 0 1 1 ${cx + Math.cos(b) * radius} ${cy + Math.sin(b) * radius}`;
      return (
        <g key={echo} opacity={opacity}>
          <path
            d={arcPath}
            {...common}
            strokeWidth={stroke * 8}
            opacity={0.07}
          />
          <path d={arcPath} {...common} />
        </g>
      );
    }
    if (p.mode === "barcode") {
      return (
        <g
          key={echo}
          opacity={opacity}
          transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
        >
          {Array.from({ length: 32 }, (_, bar) => {
            const noise = random(`${p.seed}-barcode-${bar}`);
            const x = position + ((bar - 16) * length) / 75;
            const barWidth = (length / 900) * (1 + Math.floor(noise * 5));
            const y = alternating && bar % 2 ? breadth * 0.18 : 0;
            return (
              <path
                key={bar}
                d={`M ${x} ${y} V ${breadth - y}`}
                {...common}
                strokeWidth={barWidth}
                opacity={0.15 + noise * 0.6}
              />
            );
          })}
        </g>
      );
    }
    if (p.mode === "diamond") {
      const radius = travel * diagonal * 0.7;
      if (radius <= 0) return null;
      const ratio = alternating && echo % 2 ? 0.55 : 1;
      const diamondPath = `M ${width / 2} ${height / 2 - radius * ratio} L ${width / 2 + radius} ${height / 2} L ${width / 2} ${height / 2 + radius * ratio} L ${width / 2 - radius} ${height / 2} Z`;
      return (
        <g key={echo} opacity={opacity}>
          <path
            d={diamondPath}
            {...common}
            strokeWidth={stroke * 8}
            opacity={0.06}
          />
          <path
            d={diamondPath}
            {...common}
            strokeDashoffset={frame * 2 + echo * 13}
          />
        </g>
      );
    }
    if (p.mode === "spiral") {
      const radius = travel * diagonal * 0.6;
      if (radius <= 0) return null;
      const points = Array.from({ length: 97 }, (_, point) => {
        const t = point / 96;
        const angle =
          t * Math.PI * 3 +
          progress * Math.PI * (reverse ? -2 : 2) +
          echo * 0.16;
        const r = radius * t;
        return `${point === 0 ? "M" : "L"} ${width / 2 + Math.cos(angle) * r} ${height / 2 + Math.sin(angle) * r}`;
      }).join(" ");
      return (
        <g key={echo} opacity={opacity} {...common}>
          <path d={points} strokeWidth={stroke * 6} opacity={0.06} />
          <path d={points} />
          {alternating && (
            <path
              d={points}
              transform={`rotate(180 ${width / 2} ${height / 2})`}
              opacity={0.6}
            />
          )}
        </g>
      );
    }
    let path: string;
    if (p.mode === "wave") {
      path = Array.from({ length: 65 }, (_, point) => {
        const t = point / 64;
        const frequency = alternating && echo % 2 ? 3 : 2;
        const wobble =
          Math.sin(
            t * Math.PI * frequency + progress * Math.PI * 4 + echo * 0.2,
          ) *
          length *
          (0.04 + p.glitchAmount * 0.035);
        return `${point === 0 ? "M" : "L"} ${position + wobble} ${t * breadth}`;
      }).join(" ");
    } else if (p.mode === "stair") {
      const steps = 16;
      path = Array.from({ length: steps + 1 }, (_, step) => {
        const offset =
          ((step % 4) - 1.5) *
          length *
          0.04 *
          (alternating && echo % 2 ? -1 : 1);
        return step === 0
          ? `M ${position + offset} 0`
          : `V ${(step * breadth) / steps} H ${position + offset}`;
      }).join(" ");
    } else if (p.mode === "split") {
      const offset = travel * length * 0.7;
      if (offset < 0) return null;
      const skew = alternating ? (echo % 2 === 0 ? 1 : -1) * breadth * 0.08 : 0;
      path = `M ${length / 2 - offset} ${-breadth * 0.2} L ${length / 2 - offset + skew} ${breadth * 1.2} M ${length / 2 + offset} ${-breadth * 0.2} L ${length / 2 + offset - skew} ${breadth * 1.2}`;
    } else if (p.mode === "chevron") {
      const bend =
        length * 0.25 * (reverse ? -1 : 1) * (alternating && echo % 2 ? -1 : 1);
      path = `M ${position - bend} ${-breadth * 0.2} L ${position + bend} ${breadth / 2} L ${position - bend} ${breadth * 1.2}`;
    } else {
      const slope = length * 0.4 * (alternating && echo % 2 ? -1 : 1);
      path = `M ${position - slope} ${-breadth * 0.25} L ${position + slope} ${breadth * 1.25}`;
    }
    return (
      <g
        key={echo}
        opacity={opacity}
        transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}
      >
        <path d={path} {...common} strokeWidth={stroke * 9} opacity={0.07} />
        <path d={path} {...common} />
        {echo === 0 && (
          <path
            d={path}
            {...common}
            stroke={p.accentColor}
            strokeWidth={Math.max(1, stroke * 0.25)}
          />
        )}
      </g>
    );
  });
  if (p.mode !== "cells")
    return (
      <g
        style={{
          filter:
            p.trailPattern === "diffuse"
              ? `blur(${stroke * 1.2}px)`
              : undefined,
        }}
      >
        {echoes}
      </g>
    );
  const columns = 24;
  const rows = 14;
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  return (
    <>
      {Array.from({ length: columns * rows }, (_, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const axis = vertical ? row / (rows - 1) : col / (columns - 1);
        const ordered = reverse ? 1 - axis : axis;
        const noise = random(`${p.seed}-cell-${index}`);
        const distance =
          progress * 1.7 -
          0.2 -
          ordered +
          (noise - 0.5) * 0.25 * p.glitchAmount;
        const echoWidth = p.trailSpacing * p.trailCount;
        if (distance < 0 || distance > echoWidth) return null;
        const echo = Math.min(
          p.trailCount - 1,
          Math.floor(distance / p.trailSpacing),
        );
        if (p.trailPattern === "broken" && noise < 0.3) return null;
        const inset =
          p.trailPattern === "alternating" && (col + row) % 2 ? 0.22 : 0.06;
        const opacity = Math.pow(1 - distance / echoWidth, 1.3);
        return (
          <g
            key={index}
            opacity={opacity}
            style={{
              filter:
                p.trailPattern === "diffuse"
                  ? `blur(${stroke * 1.2}px)`
                  : undefined,
            }}
          >
            <rect
              x={(col + inset) * cellWidth}
              y={(row + inset) * cellHeight}
              width={cellWidth * (1 - inset * 2)}
              height={cellHeight * (1 - inset * 2)}
              fill={colors[echo % 3]}
              fillOpacity={echo === 0 ? 0.8 : 0.18}
              stroke={colors[echo % 3]}
              rx={
                p.trailPattern === "dotted"
                  ? Math.min(cellWidth, cellHeight) * 0.45
                  : 0
              }
              strokeDasharray={
                p.trailPattern === "dotted" ? `${stroke} ${stroke}` : undefined
              }
              strokeWidth={stroke * 0.3}
            />
            {noise > 0.7 && (
              <path
                d={`M ${(col + 0.3) * cellWidth} ${(row + 0.5) * cellHeight} h ${cellWidth * 0.4} m ${-cellWidth * 0.2} ${-cellHeight * 0.2} v ${cellHeight * 0.4}`}
                stroke={p.accentColor}
                strokeWidth={stroke * 0.2}
              />
            )}
          </g>
        );
      })}
    </>
  );
};
