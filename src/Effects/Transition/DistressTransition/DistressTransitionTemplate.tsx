import React, { useId } from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { DistressTransitionProps } from "./distress-transition.schema";

/** Place the footage cut at the composition midpoint; the matte hides both cut frames. */
export const DistressTransitionTemplate: React.FC<DistressTransitionProps> = (
  p,
) => {
  const frame = useCurrentFrame();
  const { width: w, height: h, durationInFrames } = useVideoConfig();
  const id = useId().replace(/:/g, "");
  const middle = Math.floor(p.durationFrames / 2);
  const local = frame - (Math.floor(durationInFrames / 2) - middle);
  if (local <= 0 || local >= p.durationFrames - 1) return null;
  const t = local / (p.durationFrames - 1);
  const power = Math.sin(Math.PI * t);
  const tick = Math.floor(local / p.noiseHoldFrames);
  const r = (key: string) => random(`${p.seed}-${key}`);
  const matte = interpolate(
    local,
    [0, middle - 5, middle - 1, middle, middle + 4, p.durationFrames - 1],
    [0, 0, 1, 1, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const count = (n: number) =>
    Array.from({ length: Math.ceil(n * p.density) }, (_, i) => i);
  const head = (-0.55 + t * 2.1) * w;
  let shapes: React.ReactNode;
  switch (p.mode) {
    case "dryBrush":
      shapes = count(86).map((i) => {
        const y = r(`brush-y-${i}`) * h;
        const length = w * (0.2 + r(`brush-length-${i}`) * 0.55) * power;
        const x = head - length * r(`brush-x-${i}`);
        const thick = (2 + r(`brush-thickness-${i}`) * 22) * power;
        const nib = length * (0.04 + p.roughness * r(`nib-${i}`) * 0.25);
        return (
          <path
            key={i}
            d={`M${x},${y} l${length - nib},${-thick * 0.45} ${nib},${thick * 0.2} ${-nib * 0.4},${thick * 0.25} ${nib * 0.7},${thick * 0.6} ${-length},${thick * 0.2} Z`}
          />
        );
      });
      break;
    case "tonerScrape":
      shapes = count(180).map((i) => {
        const x = r(`toner-x-${i}`) * w;
        const y = r(`toner-y-${i}`) * h;
        const reveal = Math.max(0, power - Math.abs(x / w - 0.5) * 0.75);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={(8 + r(`toner-w-${i}`) * 160) * reveal}
            height={(2 + r(`toner-h-${i}`) * 58) * reveal}
            transform={`skewX(${-18 * p.roughness})`}
          />
        );
      });
      break;
    case "crtSnow":
      shapes = <rect width={w} height={h} />;
      break;
    case "trackingRoll":
      shapes = count(9).map((i) => {
        const y =
          ((i / Math.ceil(9 * p.density) + t * 1.8) % 1) * (h + 220) - 110;
        return (
          <rect
            key={i}
            x={-w * 0.1}
            y={y}
            width={w * 1.2}
            height={(14 + r(`roll-${i}`) * 90) * power}
          />
        );
      });
      break;
    case "signalTear":
      shapes = count(23).map((i) => {
        const y = (i / Math.ceil(23 * p.density)) * h;
        const shift =
          (r(`tear-${i}-${Math.floor(tick / 2)}`) - 0.5) *
          w *
          0.45 *
          p.roughness;
        return (
          <rect
            key={i}
            x={w * 0.5 + shift - w * power * 0.65}
            y={y}
            width={w * power * 1.3}
            height={
              (h / Math.ceil(23 * p.density)) * (0.15 + r(`tear-h-${i}`) * 0.6)
            }
          />
        );
      });
      break;
    case "dustBurn": {
      const radius = Math.hypot(w, h) * 0.62 * t;
      shapes = (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={(() => {
              const outer = radius + (16 + power * h * 0.28) / 2;
              const inner = Math.max(0.1, radius - (16 + power * h * 0.28) / 2);
              return `M${w / 2 - outer},${h / 2}a${outer},${outer} 0 1 0 ${outer * 2},0a${outer},${outer} 0 1 0 ${-outer * 2},0 M${w / 2 - inner},${h / 2}a${inner},${inner} 0 1 0 ${inner * 2},0a${inner},${inner} 0 1 0 ${-inner * 2},0`;
            })()}
          />
          {count(130).map((i) => {
            const angle = r(`dust-a-${i}`) * Math.PI * 2;
            const distance = radius * (0.65 + r(`dust-r-${i}`) * 0.5);
            const size = (1 + r(`dust-s-${i}`) * 13) * power;
            return (
              <circle
                key={i}
                cx={w / 2 + Math.cos(angle) * distance}
                cy={h / 2 + Math.sin(angle) * distance}
                r={size}
              />
            );
          })}
        </>
      );
      break;
    }
  }
  const mirror =
    p.direction === "left" ? `translate(${w} 0) scale(-1 1)` : undefined;
  // Batched pixel paths retain their grain without browser-dependent SVG filters.
  const cell = p.grainSize * 2.5;
  const grainPaths = ["", "", ""];
  for (let y = 0; y < 96; y++) {
    for (let x = 0; x < 128; x++) {
      const value = r(`grain-${tick}-${x}-${y}`);
      if (value < 0.35 + p.roughness * 0.15) continue;
      const color = value < 0.65 ? 0 : value < 0.84 ? 1 : 2;
      grainPaths[color] += `M${x},${y}h1v1h-1z`;
    }
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <pattern
            id={`${id}-grain`}
            width={128 * cell}
            height={96 * cell}
            patternUnits="userSpaceOnUse"
          >
            <rect width={128 * cell} height={96 * cell} fill={p.coverColor} />
            <g transform={`scale(${cell})`} shapeRendering="crispEdges">
              {grainPaths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill={[p.secondaryColor, p.primaryColor, p.accentColor][i]}
                />
              ))}
            </g>
          </pattern>
          <clipPath id={`${id}-cut`} transform={mirror}>
            {shapes}
          </clipPath>
        </defs>
        <rect width={w} height={h} fill={p.coverColor} opacity={matte} />
        <g opacity={Math.pow(power, 1.5)}>
          <g
            transform={mirror}
            fill={p.primaryColor}
            opacity={p.mode === "crtSnow" ? 0.08 : 0.38}
          >
            {shapes}
          </g>
          <g clipPath={`url(#${id}-cut)`}>
            <rect width={w} height={h} fill={`url(#${id}-grain)`} />
            {count(36).map((i) => (
              <rect
                key={i}
                x={0}
                y={r(`scratch-y-${i}`) * h}
                width={w}
                height={1 + r(`scratch-h-${i}`) * 2}
                fill={p.coverColor}
                opacity={p.roughness * 0.85}
              />
            ))}
          </g>
          {(p.mode === "trackingRoll" ||
            p.mode === "signalTear" ||
            p.mode === "crtSnow") &&
            count(12).map((i) => (
              <rect
                key={i}
                x={(r(`channel-${i}-${tick}`) - 0.5) * w * 0.3}
                y={r(`channel-y-${i}`) * h}
                width={w * (0.1 + r(`channel-w-${i}`) * 0.7)}
                height={2 + r(`channel-h-${i}`) * 5}
                fill={i % 2 ? p.secondaryColor : p.primaryColor}
                opacity={power * 0.75}
              />
            ))}
          {p.mode === "dustBurn" && (
            <circle
              cx={w / 2}
              cy={h / 2}
              r={Math.hypot(w, h) * 0.62 * t}
              stroke={p.secondaryColor}
              strokeWidth={3 + power * 8}
              fill="none"
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
