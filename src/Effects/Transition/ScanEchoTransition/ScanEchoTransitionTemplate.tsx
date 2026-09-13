import React from "react";
import { ScanEchoCutCover } from "./ScanEchoCutCover";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GeometricScanEcho } from "./GeometricScanEcho";
import { ScanEchoTransitionProps } from "./scan-echo-transition.schema";

/** Transparent editing bumper; place the footage cut at the composition midpoint. */
export const ScanEchoTransitionTemplate: React.FC<ScanEchoTransitionProps> = (
  props,
) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const cutFrame = Math.floor(props.durationFrames / 2);
  const start = Math.floor(durationInFrames / 2) - cutFrame;
  const local = frame - start;
  const progress = local / (props.durationFrames - 1);
  if (local <= 0 || local >= props.durationFrames - 1) return null;
  const envelope = Math.pow(Math.sin(Math.PI * progress), 1.2);
  const vertical = props.direction === "up" || props.direction === "down";
  const reverse = props.direction === "left" || props.direction === "up";
  const length = vertical ? height : width;
  const breadth = vertical ? width : height;
  const strips =
    props.mode === "raster"
      ? 36
      : props.mode === "tear"
        ? 22
        : props.mode === "shutter"
          ? 12
          : 1;
  const colors = [props.primaryColor, props.secondaryColor, props.accentColor];
  // Full opaque coverage on both central frames makes a straight cut invisible.
  const cover = interpolate(
    local,
    [
      0,
      (props.durationFrames - 1) * 0.32,
      cutFrame - 1,
      cutFrame,
      (props.durationFrames - 1) * 0.68,
      props.durationFrames - 1,
    ],
    [0, 0, 1, 1, 0, 0],
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <ScanEchoCutCover settings={props} opacity={cover} frame={local} />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", opacity: envelope }}
      >
        {!["sweep", "raster", "shutter", "tear"].includes(props.mode) ? (
          <GeometricScanEcho
            settings={props}
            progress={progress}
            frame={local}
            width={width}
            height={height}
          />
        ) : (
          <g transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}>
            {Array.from({ length: strips }, (_, row) => {
              const y = (row * breadth) / strips;
              const h = breadth / strips;
              const rowSeed = `${props.seed}-${row}`;
              const jitter =
                (random(`${rowSeed}-${Math.floor(local / 2)}`) - 0.5) *
                length *
                0.12 *
                props.glitchAmount;
              const stagger = strips === 1 ? 0 : (random(rowSeed) - 0.5) * 0.26;
              const alternate = props.mode === "shutter" && row % 2 === 1;
              const flipped = reverse !== alternate;
              return Array.from({ length: props.trailCount }, (_, echo) => {
                const delay = echo * props.trailSpacing;
                const phase = (progress - delay + stagger) * 1.9 - 0.25;
                const center =
                  (flipped ? 1 - phase : phase) * length +
                  jitter * (strips === 1 ? 0.15 : 1);
                const thickness =
                  props.mode === "tear"
                    ? length * (0.035 + random(`${rowSeed}-size`) * 0.16)
                    : length * (echo === 0 ? 0.022 : 0.009);
                const color = colors[echo % colors.length];
                const broken = props.trailPattern === "broken";
                const dotted = props.trailPattern === "dotted";
                const diffuse = props.trailPattern === "diffuse";
                const opacity = Math.pow(
                  1 - echo / (props.trailCount + 1),
                  1.7,
                );
                const offset =
                  props.trailPattern === "alternating"
                    ? Math.sin(row + echo * 1.8) * length * 0.025
                    : 0;
                return (
                  <g
                    key={`${row}-${echo}`}
                    opacity={opacity}
                    style={{
                      filter: diffuse ? `blur(${length / 200}px)` : undefined,
                    }}
                  >
                    <rect
                      x={center + offset - thickness * 2}
                      y={y}
                      width={thickness * 4}
                      height={h}
                      fill={color}
                      opacity={0.07}
                    />
                    {dotted ? (
                      <path
                        d={`M ${center + offset + thickness / 2} ${y} V ${y + h}`}
                        stroke={color}
                        strokeWidth={Math.min(thickness, length / 100)}
                        strokeDasharray={`0 ${length / 55}`}
                        strokeLinecap="round"
                      />
                    ) : (
                      <rect
                        x={center + offset}
                        y={y + (broken ? h * 0.12 : 0)}
                        width={thickness}
                        height={
                          h *
                          (broken
                            ? 0.58 + random(`${rowSeed}-${echo}`) * 0.3
                            : 1)
                        }
                        fill={color}
                        opacity={diffuse ? 0.5 : 1}
                      />
                    )}
                    {echo === 0 && !dotted && (
                      <rect
                        x={center + offset}
                        y={y}
                        width={Math.max(1, length / 960)}
                        height={h}
                        fill={props.accentColor}
                      />
                    )}
                  </g>
                );
              });
            })}
          </g>
        )}
        {Array.from({ length: 54 }, (_, i) => (
          <rect
            key={i}
            x={0}
            y={(i * height) / 54}
            width={width}
            height={height / 1080}
            fill={props.primaryColor}
            opacity={cover * 0.22}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
