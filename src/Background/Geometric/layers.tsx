import React, { useMemo } from "react";
import type { GeometricSchemaType } from "./geometric.schema";
import {
  Arc,
  Chevrons,
  DotGrid,
  HatchPattern,
  Plus,
  Pop,
  Squiggle,
  TAU,
  TileShape,
  Zigzag,
  easeInOut,
  easeOutCubic,
  makeRand,
  pick,
  pointOutsideCenter,
} from "./shapes";

export type LayerProps = GeometricSchemaType & {
  width: number;
  height: number;
  /** 0 → loopCycles over the composition */
  phase: number;
  /** Unique, url-safe prefix for SVG defs ids */
  idPrefix: string;
  /**
   * Reveal intro: amount (0 hidden → 1 shown) for a shape whose place in the
   * build order is `order` (0 first → 1 last). Always 1 when intro is "loop".
   */
  revealAt: (order: number) => number;
};

const blink = (t: number, k: number, ph: number) =>
  0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * k + ph));

/**
 * One "move out, hold, move back" event per period: 0 at rest, 1 at full
 * extent. Periodic in phase, so repeated events loop seamlessly.
 */
const eventAmount = (phase: number, k: number, off: number) => {
  const u = (((phase * k + off) % 1) + 1) % 1;
  if (u < 0.12) return easeInOut(u / 0.12);
  if (u < 0.3) return 1;
  if (u < 0.42) return 1 - easeInOut((u - 0.3) / 0.12);
  return 0;
};

/** Eased quarter turns: `k` steps per cycle, so k * 90° per cycle loops cleanly. */
const quarterTurns = (phase: number, k: number, off: number) => {
  const q = phase * k + off;
  return (Math.floor(q) + easeInOut((q - Math.floor(q) - 0.75) / 0.25)) * 90;
};

type BlockAnim = "slide" | "wipe" | "grow" | "turn" | "still";
const BLOCK_ANIMS: readonly BlockAnim[] = ["slide", "slide", "wipe", "grow", "turn", "still"];

/** Rectangles clustered at the edges, plus small ornaments; open center. */
export const FrameLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion } = p;
  const t = TAU * phase;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "frame");
    const blocks = Array.from({ length: Math.round(22 * p.density) }, (_, i) => {
      const k = `b${i}`;
      const { x, y } = pointOutsideCenter(rand, k, W, H, p.openCenter, 40, 0.45);
      const w = 60 + rand(`${k}w`) * 280;
      const square = rand(`${k}sq`) < 0.35;
      // Outward direction: toward the nearer screen edge, horizontal or vertical.
      const nx = (x - W / 2) / (W / 2);
      const ny = (y - H / 2) / (H / 2);
      const horizontal = Math.abs(nx) >= Math.abs(ny);
      return {
        x,
        y,
        w,
        h: square ? w : 50 + rand(`${k}h`) * 250,
        color: pick(colors, rand(`${k}c`)),
        depth: 0.3 + rand(`${k}d`) * 0.9,
        ph: rand(`${k}p`) * TAU,
        ph2: rand(`${k}q`) * TAU,
        anim: pick(BLOCK_ANIMS, rand(`${k}a`)),
        k: 1 + Math.floor(rand(`${k}ak`) * 2),
        off: rand(`${k}ao`),
        horizontal,
        out: horizontal ? Math.sign(nx) || 1 : Math.sign(ny) || 1,
      };
    }).sort((a, b) => b.w * b.h - a.w * a.h);
    const ornaments = Array.from({ length: Math.round(12 * p.density) }, (_, i) => {
      const k = `o${i}`;
      return {
        ...pointOutsideCenter(rand, k, W, H, p.openCenter * 0.9, -50, 0.7),
        kind: Math.floor(rand(`${k}k`) * 6),
        k: 1 + Math.floor(rand(`${k}s`) * 3),
        ph: rand(`${k}p`) * TAU,
        size: 22 + rand(`${k}z`) * 22,
        color: rand(`${k}c`) < 0.6 ? accentColor : pick(colors, rand(`${k}cc`)),
      };
    });
    const bands = Array.from({ length: 3 }, (_, i) => ({
      offset: (i - 1) * 0.42 + (rand(`band${i}`) - 0.5) * 0.2,
      thick: 0.12 + rand(`bandw${i}`) * 0.16,
      ph: rand(`bandp${i}`) * TAU,
    }));
    return { blocks, ornaments, bands };
  }, [p.randomSeed, p.density, p.openCenter, W, H, colors, accentColor]);

  const diag = Math.hypot(W, H);
  return (
    <g>
      {layout.bands.map((b, i) => (
        <rect
          key={`band${i}`}
          x={-diag / 2}
          y={(b.offset - b.thick / 2) * diag + Math.sin(t + b.ph) * 30 * motion}
          width={diag}
          height={b.thick * diag}
          fill="#ffffff"
          opacity={0.045 * p.revealAt(0)}
          transform={`translate(${W / 2} ${H / 2}) rotate(-35)`}
        />
      ))}
      {layout.blocks.map((b, i) => {
        const a = motion > 0 ? eventAmount(phase, b.k, b.off) : 0;
        let cx = b.x + Math.sin(t + b.ph) * 26 * motion * b.depth;
        let cy = b.y + Math.cos(t + b.ph2) * 18 * motion * b.depth;
        let w = b.w;
        let h = b.h;
        let rot = 0;
        const along = b.horizontal ? b.w : b.h;
        if (b.anim === "slide") {
          // Slide outward past the edge, hold, slide back.
          const d = a * (along * 0.7 + 60) * Math.min(1, motion) * b.out;
          if (b.horizontal) cx += d;
          else cy += d;
        } else if (b.anim === "wipe" || b.anim === "grow") {
          // Collapse into (wipe) or stretch from (grow) the outer edge.
          const f = b.anim === "wipe" ? 1 - 0.92 * a : 1 + 0.6 * a;
          const shift = (along * (1 - f) * b.out) / 2;
          if (b.horizontal) {
            w = b.w * f;
            cx += shift;
          } else {
            h = b.h * f;
            cy += shift;
          }
        } else if (b.anim === "turn") {
          // Two quarter turns per event pair, so rectangles end each cycle at 0° or 180°.
          rot = quarterTurns(phase, b.k * 2, b.off) * (motion > 0 ? 1 : 0);
        }
        // Reveal: each block wipes in from its outer edge, largest first.
        const ra = p.revealAt((i / layout.blocks.length) * 0.7);
        if (ra <= 0) return null;
        if (ra < 1) {
          const f = easeOutCubic(ra);
          const along2 = b.horizontal ? w : h;
          const shift = (along2 * (1 - f) * b.out) / 2;
          if (b.horizontal) {
            w *= f;
            cx += shift;
          } else {
            h *= f;
            cy += shift;
          }
        }
        return (
          <rect
            key={i}
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            fill={b.color}
            transform={`translate(${cx} ${cy}) rotate(${rot})`}
          />
        );
      })}
      {layout.ornaments.map((o, i) => (
        <Pop key={i} amount={p.revealAt(0.55 + (i / layout.ornaments.length) * 0.45)} x={o.x} y={o.y}>
          {renderOrnament(o, i)}
        </Pop>
      ))}
    </g>
  );

  function renderOrnament(o: (typeof layout.ornaments)[number], i: number) {
        const op = motion > 0 ? blink(t, o.k, o.ph) : 1;
        switch (o.kind) {
          case 0:
          case 1: {
            // Plus / cross marks spin in quarter turns (4-fold symmetric).
            const spin = motion > 0 ? quarterTurns(phase, o.k, o.ph / TAU) : 0;
            return <Plus key={i} x={o.x} y={o.y} size={o.size} color={o.color} width={4} rotate={(o.kind === 1 ? 45 : 0) + spin} opacity={op} />;
          }
          case 2:
            // Dot grid with a size wave running across the columns.
            return (
              <g key={i}>
                {Array.from({ length: 15 }, (_, d) => {
                  const col = d % 5;
                  const wave = motion > 0 ? 0.5 + 0.5 * Math.sin(t * o.k - col * 0.9 + o.ph) : 1;
                  return <circle key={d} cx={o.x + col * 16} cy={o.y + Math.floor(d / 5) * 16} r={1.5 + 3 * wave} fill={o.color} />;
                })}
              </g>
            );
          case 3:
            return <Chevrons key={i} x={o.x} y={o.y} count={4} size={13} color={o.color} phase={phase * o.k + o.ph / TAU} rotate={o.ph > Math.PI ? 90 : 0} />;
          case 4: {
            const s = o.size * (0.8 + 0.25 * Math.sin(t * o.k + o.ph) * motion);
            const turn = motion > 0 ? quarterTurns(phase, o.k * 2, o.ph / TAU) / 2 : 0;
            return <rect key={i} x={-s / 2} y={-s / 2} width={s} height={s} fill={o.color} transform={`translate(${o.x} ${o.y}) rotate(${turn})`} />;
          }
          default: {
            // Concentric circles that keep expanding outward like a ripple.
            const grow = motion > 0 ? (((phase * o.k + o.ph / TAU) % 1) + 1) % 1 : 0;
            return (
              <g key={i}>
                {[0, 1, 2, 3].map((r) => {
                  const rr = (r + grow) * 26;
                  return <circle key={r} cx={o.x} cy={o.y} r={Math.max(0.1, rr)} fill="none" stroke={o.color} strokeWidth={2} opacity={0.6 * (1 - (r + grow) / 4)} />;
                })}
              </g>
            );
          }
        }
  }
};

/** Rounded arcs, rings, hatched discs and orbiting dots around a few centers. */
export const OrbitLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion, strokeWidth: sw } = p;
  const t = TAU * phase;
  const hatchId = `${p.idPrefix}-hatch`;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "orbit");
    const clusterCount = 2 + (p.density > 1.2 ? 1 : 0);
    const clusters = Array.from({ length: clusterCount }, (_, c) => {
      const main = c === 0;
      const R = main ? H * 0.36 : H * (0.13 + rand(`R${c}`) * 0.08);
      const x = main ? W * (0.3 + rand(`cx${c}`) * 0.4) : W * (c === 1 ? 0.06 + rand(`cx${c}`) * 0.2 : 0.75 + rand(`cx${c}`) * 0.2);
      const y = main ? H * (0.4 + rand(`cy${c}`) * 0.2) : H * (0.15 + rand(`cy${c}`) * 0.7);
      const rings = Array.from({ length: main ? 4 : 2 }, (_, j) => {
        const k = `${c}-${j}`;
        return {
          r: R * (main ? 0.32 + j * 0.24 : 0.55 + j * 0.45),
          kind: j === 0 && main ? "dash" : rand(`kind${k}`) < 0.25 ? "thin" : "arc",
          width: sw * (0.7 + rand(`w${k}`) * 1.2),
          color: colors[(c + j) % colors.length],
          start: rand(`s${k}`),
          dir: rand(`d${k}`) < 0.5 ? -1 : 1,
          m: 1 + Math.floor(rand(`m${k}`) * 2),
          ph: rand(`p${k}`) * TAU,
        };
      });
      return {
        x,
        y,
        R,
        rings,
        hatch: { dx: (rand(`hx${c}`) - 0.5) * R * 0.9, dy: (rand(`hy${c}`) - 0.5) * R * 0.9, r: R * (0.45 + rand(`hr${c}`) * 0.3) },
        dotPh: rand(`dot${c}`),
      };
    });
    const scatter = Array.from({ length: Math.round(9 * p.density) }, (_, i) => {
      const k = `sc${i}`;
      return {
        x: rand(`${k}x`) * W,
        y: rand(`${k}y`) * H,
        kind: Math.floor(rand(`${k}k`) * 3),
        size: 6 + rand(`${k}z`) * 12,
        color: pick(colors, rand(`${k}c`)),
        ph: rand(`${k}p`) * TAU,
      };
    });
    return { clusters, scatter };
  }, [p.randomSeed, p.density, W, H, colors, sw]);

  return (
    <g>
      <defs>
        <HatchPattern id={hatchId} color={accentColor} spacing={16} lineWidth={3} />
      </defs>
      {layout.scatter.map((s, i) => {
        const dy = Math.sin(t + s.ph) * 14 * motion;
        const shape =
          s.kind === 0 ? <circle cx={s.x} cy={s.y + dy} r={s.size} fill={s.color} />
          : s.kind === 1 ? <circle cx={s.x} cy={s.y + dy} r={s.size * 3.2} fill={`url(#${hatchId})`} opacity={0.8} />
          : <Arc cx={s.x} cy={s.y + dy} r={s.size * 4} start={s.ph / TAU + phase * motion} sweep={0.18} color={s.color} width={4} />;
        return (
          <Pop key={i} amount={p.revealAt(0.5 + (i / layout.scatter.length) * 0.5)} x={s.x} y={s.y}>
            {shape}
          </Pop>
        );
      })}
      {layout.clusters.map((c, ci) => (
        <g key={ci}>
          <Pop amount={p.revealAt(ci * 0.2 + 0.1)} x={c.x + c.hatch.dx} y={c.y + c.hatch.dy}>
          <circle
            cx={c.x + c.hatch.dx + Math.sin(t) * 12 * motion}
            cy={c.y + c.hatch.dy + Math.cos(t) * 12 * motion}
            r={c.hatch.r}
            fill={`url(#${hatchId})`}
            opacity={0.75}
          />
          </Pop>
          {c.rings.map((r, ri) => {
            const start = r.start + r.dir * phase * motion;
            // Reveal: arcs draw on from their start, inner rings first.
            const draw = easeOutCubic(p.revealAt(ci * 0.2 + ri * 0.08));
            if (draw <= 0) return null;
            if (r.kind === "thin") {
              return <Arc key={ri} cx={c.x} cy={c.y} r={r.r} start={start} sweep={(0.62 + 0.2 * Math.sin(t * r.m + r.ph) * motion) * draw} color={r.color} width={3} />;
            }
            if (r.kind === "dash") {
              return <Arc key={ri} cx={c.x} cy={c.y} r={r.r} start={start} sweep={0.999 * draw} color={r.color} width={r.width * 0.6} dash={`3 ${Math.max(8, r.width * 0.6)}`} />;
            }
            return <Arc key={ri} cx={c.x} cy={c.y} r={r.r} start={start} sweep={(0.45 + 0.27 * Math.sin(t * r.m + r.ph) * motion) * draw} color={r.color} width={r.width} />;
          })}
          {c.rings.slice(0, 2).map((r, ri) => {
            const a = (c.dotPh + ri * 0.5 - r.dir * phase * motion) * TAU;
            const dx = c.x + Math.cos(a) * r.r;
            const dy = c.y + Math.sin(a) * r.r;
            return (
              <Pop key={`d${ri}`} amount={p.revealAt(ci * 0.2 + 0.45)} x={dx} y={dy}>
                <circle cx={dx} cy={dy} r={Math.max(6, sw * 0.55)} fill={colors[(ri + 1) % colors.length]} />
              </Pop>
            );
          })}
        </g>
      ))}
    </g>
  );
};

/** Bauhaus tiles: one shape per cell, turning in eased quarter turns. */
export const GridLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion, strokeWidth: sw } = p;
  const hatchId = `${p.idPrefix}-tilehatch`;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "grid");
    const rows = Math.max(2, Math.round(4 * p.density));
    const cell = H / rows;
    const cols = Math.ceil(W / cell);
    const ox = (W - cols * cell) / 2;
    const cells = Array.from({ length: rows * cols }, (_, i) => {
      const k = `c${i}`;
      const bgIndex = Math.floor(rand(`${k}bg`) * colors.length);
      let fgIndex = Math.floor(rand(`${k}fg`) * colors.length);
      if (fgIndex === bgIndex) fgIndex = (fgIndex + 1) % colors.length;
      return {
        x: ox + (i % cols) * cell,
        y: Math.floor(i / cols) * cell,
        order: ((i % cols) + Math.floor(i / cols)) / (cols + rows - 2),
        bg: colors[bgIndex],
        fg: colors[fgIndex],
        kind: Math.floor(rand(`${k}k`) * 8),
        rot: Math.floor(rand(`${k}r`) * 4) * 90,
        off: rand(`${k}o`),
      };
    });
    return { cell, cells };
  }, [p.randomSeed, p.density, W, H, colors]);

  return (
    <g>
      <defs>
        <HatchPattern id={hatchId} color={accentColor} spacing={14} lineWidth={4} />
      </defs>
      {layout.cells.map((c, i) => {
        // Four eased quarter turns per cycle add up to 360°, so the loop is seamless.
        const q = phase * 4 + c.off;
        const step = Math.floor(q) + easeInOut((q - Math.floor(q) - 0.7) / 0.3);
        const angle = c.rot + (motion > 0 ? step * 90 : 0);
        // Reveal: tiles fill in as a diagonal wave, then their shapes pop in.
        const tileIn = p.revealAt(c.order * 0.7);
        const shapeIn = p.revealAt(c.order * 0.7 + 0.25);
        const half = layout.cell / 2;
        return (
          <g key={i} transform={`translate(${c.x} ${c.y})`}>
            <Pop amount={tileIn} x={half} y={half}>
              <rect width={layout.cell + 0.5} height={layout.cell + 0.5} fill={c.bg} />
            </Pop>
            <Pop amount={shapeIn} x={half} y={half}>
              <g transform={`translate(${half} ${half}) rotate(${angle})`}>
                <TileShape kind={c.kind} size={layout.cell} color={c.fg} stroke={sw} hatchId={hatchId} />
              </g>
            </Pop>
          </g>
        );
      })}
    </g>
  );
};

/** Sparse mixed shapes drifting on closed loops and turning slowly. */
export const FloatLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion, strokeWidth: sw } = p;
  const t = TAU * phase;
  const hatchId = `${p.idPrefix}-floathatch`;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "float");
    return Array.from({ length: Math.round(16 * p.density) }, (_, i) => {
      const k = `f${i}`;
      return {
        ...pointOutsideCenter(rand, k, W, H, p.openCenter, -80, 0.8),
        kind: Math.floor(rand(`${k}k`) * 9),
        size: 60 + rand(`${k}z`) * 150,
        color: pick(colors, rand(`${k}c`)),
        a: 1 + Math.floor(rand(`${k}a`) * 2),
        b: 1 + Math.floor(rand(`${k}b`) * 2),
        ph: rand(`${k}p`) * TAU,
        ph2: rand(`${k}q`) * TAU,
        turn: Math.floor(rand(`${k}t`) * 3) - 1,
        rot0: rand(`${k}r`) * 360,
      };
    });
  }, [p.randomSeed, p.density, p.openCenter, W, H, colors]);

  return (
    <g>
      <defs>
        <HatchPattern id={hatchId} color={accentColor} spacing={14} lineWidth={3} />
      </defs>
      {layout.map((s, i) => {
        const x = s.x + Math.sin(t * s.a + s.ph) * 40 * motion;
        const y = s.y + Math.cos(t * s.b + s.ph2) * 30 * motion;
        const rot = s.rot0 + s.turn * 360 * phase * (motion > 0 ? 1 : 0);
        const h = s.size / 2;
        let shape: React.ReactNode;
        switch (s.kind) {
          case 0:
            shape = <circle r={h} fill={s.color} />;
            break;
          case 1:
            shape = <circle r={h} fill="none" stroke={s.color} strokeWidth={sw} />;
            break;
          case 2:
            shape = <rect x={-h} y={-h} width={s.size} height={s.size} fill="none" stroke={s.color} strokeWidth={sw} />;
            break;
          case 3:
            shape = <path d={`M0 ${-h}L${h} ${h * 0.8}H${-h}Z`} fill={s.color} />;
            break;
          case 4:
            shape = <Plus x={0} y={0} size={s.size * 0.6} color={s.color} width={sw} />;
            break;
          case 5:
            shape = <path d={`M${-h} 0A${h} ${h} 0 0 1 ${h} 0Z`} fill={s.color} />;
            break;
          case 6:
            shape = <Arc cx={0} cy={0} r={h} start={0} sweep={0.5} color={s.color} width={sw} />;
            break;
          case 7:
            shape = <circle r={h} fill={`url(#${hatchId})`} />;
            break;
          default:
            shape = <DotGrid x={-h} y={-h * 0.4} cols={4} rows={3} gap={s.size / 4} radius={5} color={s.color} />;
        }
        return (
          <Pop key={i} amount={p.revealAt(i / layout.length)} x={x} y={y}>
            <g transform={`translate(${x} ${y}) rotate(${rot})`}>{shape}</g>
          </Pop>
        );
      })}
    </g>
  );
};

/** Diagonal stripes of varying width that breathe and slide; optional open center. */
export const StripeLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion } = p;
  const t = TAU * phase;
  const hatchId = `${p.idPrefix}-stripehatch`;
  const maskId = `${p.idPrefix}-stripemask`;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "stripe");
    const count = Math.max(3, Math.round(6 * p.density));
    return Array.from({ length: count }, (_, i) => {
      const k = `s${i}`;
      const r = rand(`${k}kind`);
      return {
        weight: 0.4 + rand(`${k}w`),
        kind: r < 0.68 ? "solid" : r < 0.84 ? "hatch" : "gap",
        color: colors[i % colors.length],
        k: 1 + Math.floor(rand(`${k}k`) * 2),
        ph: rand(`${k}p`) * TAU,
      };
    });
  }, [p.randomSeed, p.density, colors]);

  // One repeating unit of stripes; sliding by whole units per cycle keeps the loop seamless.
  const unit = W * 0.6;
  const weights = layout.map((s) => s.weight * (1 + 0.35 * Math.sin(t * s.k + s.ph) * Math.min(1, motion)));
  const total = weights.reduce((a, b) => a + b, 0);
  const diag = Math.hypot(W, H);
  const shift = ((phase * unit * (motion > 0 ? 1 : 0)) % unit) - unit;
  const units = Math.ceil((diag * 2) / unit) + 2;
  const boxW = W * p.openCenter;
  const boxH = H * p.openCenter;

  return (
    <g>
      <defs>
        <HatchPattern id={hatchId} color={accentColor} spacing={14} lineWidth={4} angle={-45} />
        <mask id={maskId}>
          <rect width={W} height={H} fill="white" />
          {p.openCenter > 0 ? (
            <rect x={(W - boxW) / 2} y={(H - boxH) / 2} width={boxW} height={boxH} rx={28} fill="black" />
          ) : null}
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <g transform={`translate(${W / 2} ${H / 2}) rotate(-28)`}>
          {Array.from({ length: units }, (_, u) => {
            let x = -diag + u * unit + shift;
            return layout.map((s, i) => {
              const w = (weights[i] / total) * unit;
              const x0 = x;
              x += w;
              if (s.kind === "gap") return null;
              // Reveal: each stripe grows from its leading edge, in order within the unit.
              const grow = easeOutCubic(p.revealAt((i / layout.length) * 0.8));
              if (grow <= 0) return null;
              return (
                <rect
                  key={`${u}-${i}`}
                  x={x0}
                  y={-diag}
                  width={w * grow + 0.5}
                  height={diag * 2}
                  fill={s.kind === "hatch" ? `url(#${hatchId})` : s.color}
                />
              );
            });
          })}
        </g>
      </g>
    </g>
  );
};

type MemphisKind = "squiggle" | "zigzag" | "triangle" | "circle" | "ring" | "bar" | "dots" | "half" | "plus";
const MEMPHIS_KINDS: readonly MemphisKind[] = [
  "squiggle", "squiggle", "zigzag", "triangle", "circle", "ring", "bar", "dots", "half", "plus",
];

/** 80s Memphis: squiggles, zigzags and small bold shapes over a dotted backdrop. */
export const MemphisLayer: React.FC<LayerProps> = (p) => {
  const { width: W, height: H, phase, colors, accentColor, motion, strokeWidth: sw } = p;
  const t = TAU * phase;
  const dotsId = `${p.idPrefix}-memphisdots`;
  const layout = useMemo(() => {
    const rand = makeRand(p.randomSeed, "memphis");
    const soft = colors[colors.length - 1];
    const blobs = [
      { x: W * (0.05 + rand("b0x") * 0.15), y: H * (0.8 + rand("b0y") * 0.2), r: H * 0.38, color: soft },
      { x: W * (0.85 + rand("b1x") * 0.15), y: H * (0.05 + rand("b1y") * 0.15), r: H * 0.3, color: colors[0] },
    ];
    const items = Array.from({ length: Math.round(18 * p.density) }, (_, i) => {
      const k = `m${i}`;
      return {
        ...pointOutsideCenter(rand, k, W, H, p.openCenter, -60, 0.85),
        kind: pick(MEMPHIS_KINDS, rand(`${k}k`)),
        size: 100 + rand(`${k}z`) * 120,
        color: pick(colors.slice(0, -1), rand(`${k}c`)),
        k: 1 + Math.floor(rand(`${k}s`) * 2),
        ph: rand(`${k}p`) * TAU,
        ph2: rand(`${k}q`) * TAU,
        turn: Math.floor(rand(`${k}t`) * 3) - 1,
        rot0: (rand(`${k}r`) - 0.5) * 80,
      };
    });
    return { blobs, items };
  }, [p.randomSeed, p.density, p.openCenter, W, H, colors]);

  return (
    <g>
      <defs>
        <pattern id={dotsId} patternUnits="userSpaceOnUse" width={34} height={34}>
          <circle cx={17} cy={17} r={2.6} fill={accentColor} />
        </pattern>
      </defs>
      {layout.blobs.map((b, i) => (
        <Pop key={`b${i}`} amount={p.revealAt(i * 0.1)} x={b.x} y={b.y}>
          <circle cx={b.x + Math.sin(t + i) * 20 * motion} cy={b.y + Math.cos(t + i) * 16 * motion} r={b.r} fill={b.color} />
        </Pop>
      ))}
      <rect width={W} height={H} fill={`url(#${dotsId})`} opacity={0.16 * p.revealAt(0.2)} />
      {layout.items.map((s, i) => {
        const x = s.x + Math.sin(t * s.k + s.ph) * 26 * motion;
        const y = s.y + Math.cos(t * s.k + s.ph2) * 20 * motion;
        const rot = s.rot0 + (s.turn !== 0 ? s.turn * 360 * phase : Math.sin(t + s.ph) * 14) * (motion > 0 ? 1 : 0);
        const h = s.size / 2;
        let shape: React.ReactNode;
        switch (s.kind) {
          case "squiggle":
            shape = <Squiggle length={s.size * 1.6} amplitude={s.size * 0.14} waves={3} phase={phase * s.k * (motion > 0 ? 1 : 0)} color={accentColor} width={sw * 0.6} />;
            break;
          case "zigzag":
            shape = <Zigzag length={s.size * 1.4} height={s.size * 0.25} teeth={4} color={s.color} width={sw * 0.6} />;
            break;
          case "triangle":
            shape = <path d={`M0 ${-h}L${h} ${h * 0.75}H${-h}Z`} fill={s.color} stroke={accentColor} strokeWidth={3} />;
            break;
          case "circle":
            shape = <circle r={h * 0.7} fill={s.color} />;
            break;
          case "ring":
            shape = <circle r={h * 0.6} fill="none" stroke={accentColor} strokeWidth={sw * 0.4} />;
            break;
          case "bar":
            shape = <rect x={-h} y={-h * 0.18} width={s.size} height={h * 0.36} rx={h * 0.18} fill={s.color} />;
            break;
          case "dots":
            shape = <DotGrid x={-h * 0.6} y={-h * 0.4} cols={4} rows={3} gap={s.size / 5} radius={6} color={accentColor} />;
            break;
          case "half":
            shape = <path d={`M${-h} 0A${h} ${h} 0 0 1 ${h} 0Z`} fill={s.color} />;
            break;
          default:
            shape = <Plus x={0} y={0} size={s.size * 0.5} color={s.color} width={sw * 0.6} />;
        }
        return (
          <Pop key={i} amount={p.revealAt(0.3 + (i / layout.items.length) * 0.7)} x={x} y={y}>
            <g transform={`translate(${x} ${y}) rotate(${rot})`}>{shape}</g>
          </Pop>
        );
      })}
    </g>
  );
};
