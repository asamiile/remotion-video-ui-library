import React from "react";
import { random } from "remotion";

export const TAU = Math.PI * 2;

/** Seeded random in [0, 1) scoped to one geometric layout. */
export const makeRand =
  (seed: number, scope: string) =>
  (key: string | number): number =>
    random(`geometric-${seed}-${scope}-${key}`);

export const pick = <T,>(items: readonly T[], r: number): T =>
  items[Math.min(items.length - 1, Math.floor(r * items.length))];

/** Smooth 0-1 ease used for stepped motion. */
export const easeInOut = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/**
 * Seeded point outside the open center: rejects candidates whose normalized
 * position (-1..1 on both axes) falls inside a rounded box of size openCenter.
 */
export const pointOutsideCenter = (
  rand: (key: string) => number,
  key: string,
  width: number,
  height: number,
  openCenter: number,
  margin = 0,
  /** 1 = uniform; < 1 pushes points toward the edges */
  edgeBias = 1,
): { x: number; y: number } => {
  const bias = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), edgeBias);
  for (let attempt = 0; attempt < 24; attempt++) {
    const nx = bias(rand(`${key}-x${attempt}`) * 2 - 1);
    const ny = bias(rand(`${key}-y${attempt}`) * 2 - 1);
    const inside = Math.max(Math.abs(nx) * 0.9, Math.abs(ny)) < openCenter;
    if (!inside || attempt === 23) {
      return {
        x: ((nx + 1) / 2) * (width + margin * 2) - margin,
        y: ((ny + 1) / 2) * (height + margin * 2) - margin,
      };
    }
  }
  return { x: 0, y: 0 };
};

/** Diagonal hatch fill; reference it with fill={`url(#${id})`}. */
export const HatchPattern: React.FC<{
  id: string;
  color: string;
  spacing?: number;
  lineWidth?: number;
  angle?: number;
}> = ({ id, color, spacing = 14, lineWidth = 3, angle = 45 }) => (
  <pattern
    id={id}
    patternUnits="userSpaceOnUse"
    width={spacing}
    height={spacing}
    patternTransform={`rotate(${angle})`}
  >
    <rect width={lineWidth} height={spacing} fill={color} />
  </pattern>
);

/** Rounded arc of a circle; `start` and `sweep` are fractions of a turn. */
export const Arc: React.FC<{
  cx: number;
  cy: number;
  r: number;
  start: number;
  sweep: number;
  color: string;
  width: number;
  dash?: string;
}> = ({ cx, cy, r, start, sweep, color, width, dash }) => {
  const s = Math.max(0.002, Math.min(0.999, sweep));
  const a0 = start * TAU;
  const a1 = (start + s) * TAU;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  return (
    <path
      d={`M${x0} ${y0} A${r} ${r} 0 ${s > 0.5 ? 1 : 0} 1 ${x1} ${y1}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap={dash ? "butt" : "round"}
      strokeDasharray={dash}
    />
  );
};

export const Plus: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  width?: number;
  rotate?: number;
  opacity?: number;
}> = ({ x, y, size, color, width = 3, rotate = 0, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
    <path
      d={`M${-size / 2} 0H${size / 2}M0 ${-size / 2}V${size / 2}`}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  </g>
);

/** Small rows x cols grid of dots. */
export const DotGrid: React.FC<{
  x: number;
  y: number;
  cols: number;
  rows: number;
  gap: number;
  radius: number;
  color: string;
  opacity?: number;
}> = ({ x, y, cols, rows, gap, radius, color, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: cols * rows }, (_, i) => (
      <circle
        key={i}
        cx={x + (i % cols) * gap}
        cy={y + Math.floor(i / cols) * gap}
        r={radius}
        fill={color}
      />
    ))}
  </g>
);

/** Row of small triangles with a highlight travelling along it. */
export const Chevrons: React.FC<{
  x: number;
  y: number;
  count: number;
  size: number;
  color: string;
  phase: number;
  rotate?: number;
}> = ({ x, y, count, size, color, phase, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    {Array.from({ length: count }, (_, i) => {
      const lit = 0.5 + 0.5 * Math.cos(TAU * (phase - i / count));
      return (
        <path
          key={i}
          d={`M${i * size * 1.6} ${-size / 2}L${i * size * 1.6 + size} 0L${i * size * 1.6} ${size / 2}Z`}
          fill={color}
          opacity={0.25 + 0.75 * lit * lit}
        />
      );
    })}
  </g>
);

/**
 * One tile shape centred on (0, 0), drawn inside a size x size cell.
 * kind: 0 circle, 1 half circle, 2 quarter circle, 3 triangle, 4 ring,
 * 5 square, 6 two half circles (pill), 7 diagonal hatch.
 */
export const TileShape: React.FC<{
  kind: number;
  size: number;
  color: string;
  stroke: number;
  hatchId: string;
}> = ({ kind, size, color, stroke, hatchId }) => {
  const h = size / 2;
  switch (kind) {
    case 0:
      return <circle r={h * 0.82} fill={color} />;
    case 1:
      return <path d={`M${-h} ${h}A${h} ${h} 0 0 1 ${h} ${h}Z`} fill={color} transform={`translate(0 ${-h / 2})`} />;
    case 2:
      return <path d={`M${-h} ${-h}H${h}A${size} ${size} 0 0 1 ${-h} ${h}Z`} fill={color} />;
    case 3:
      return <path d={`M${-h} ${-h}L${h} ${h}H${-h}Z`} fill={color} />;
    case 4:
      return <circle r={h * 0.7} fill="none" stroke={color} strokeWidth={Math.max(stroke, size * 0.14)} />;
    case 5:
      return <rect x={-h * 0.55} y={-h * 0.55} width={h * 1.1} height={h * 1.1} fill={color} />;
    case 6:
      return (
        <g fill={color}>
          <path d={`M${-h} 0A${h / 2} ${h / 2} 0 0 1 0 0Z`} transform={`translate(0 ${-h * 0.05})`} />
          <path d={`M0 0A${h / 2} ${h / 2} 0 0 0 ${h} 0Z`} transform={`translate(0 ${h * 0.05})`} />
        </g>
      );
    default:
      return <rect x={-h} y={-h} width={size} height={size} fill={`url(#${hatchId})`} />;
  }
};

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** Ease-out with a small overshoot, for shapes popping in. */
export const easeOutBack = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  const c = 1.6;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Scales children in around (x, y) while `amount` goes 0 → 1 (reveal intro). */
export const Pop: React.FC<{
  amount: number;
  x: number;
  y: number;
  children: React.ReactNode;
}> = ({ amount, x, y, children }) => {
  if (amount >= 1) return <>{children}</>;
  if (amount <= 0) return null;
  const s = easeOutBack(amount);
  return (
    <g
      opacity={Math.min(1, amount * 3)}
      transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}
    >
      {children}
    </g>
  );
};

/** Horizontal squiggle of `waves` sine periods; `phase` (0-1) shifts it seamlessly. */
export const Squiggle: React.FC<{
  length: number;
  amplitude: number;
  waves: number;
  phase: number;
  color: string;
  width: number;
}> = ({ length, amplitude, waves, phase, color, width }) => {
  const steps = Math.max(16, waves * 12);
  const d = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * length - length / 2;
    const y = Math.sin((i / steps) * waves * TAU + phase * TAU) * amplitude;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join("");
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
};

/** Zigzag line with `teeth` points, centered on (0, 0). */
export const Zigzag: React.FC<{
  length: number;
  height: number;
  teeth: number;
  color: string;
  width: number;
}> = ({ length, height, teeth, color, width }) => {
  const d = Array.from({ length: teeth * 2 + 1 }, (_, i) => {
    const x = (i / (teeth * 2)) * length - length / 2;
    const y = i % 2 === 0 ? height / 2 : -height / 2;
    return `${i === 0 ? "M" : "L"}${x} ${y}`;
  }).join("");
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
};
