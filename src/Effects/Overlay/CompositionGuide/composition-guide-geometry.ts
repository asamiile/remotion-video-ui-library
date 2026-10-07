import type { CompositionGuideSchemaType } from "./composition-guide.schema";

export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
export const SILVER_RATIO = Math.SQRT2;

/** One drawable path; strokes sharing an `order` draw in together. */
export type GuideStroke = {
  d: string;
  order: number;
  /** Long strokes (the spiral) take twice the draw time */
  long?: boolean;
};

type Rect = { x: number; y: number; w: number; h: number };
type Point = [number, number];

const f = (n: number) => n.toFixed(2);

/** A straight line drawn outward from its midpoint (two half strokes). */
function line(a: Point, b: Point, order: number): GuideStroke[] {
  const m: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return [
    { d: `M${f(m[0])},${f(m[1])}L${f(a[0])},${f(a[1])}`, order },
    { d: `M${f(m[0])},${f(m[1])}L${f(b[0])},${f(b[1])}`, order },
  ];
}

/** Vertical and horizontal lines at the given fractions of the frame. */
function divisionLines(xs: number[], ys: number[], W: number, H: number): GuideStroke[] {
  return [
    ...xs.flatMap((t, i) => line([W * t, 0], [W * t, H], i)),
    ...ys.flatMap((t, i) => line([0, H * t], [W, H * t], xs.length + i)),
  ];
}

/** Foot of the perpendicular from p onto the line through a and b. */
function foot(p: Point, a: Point, b: Point): Point {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  return [a[0] + dx * t, a[1] + dy * t];
}

/** The rectangle the ratio construction lives in. */
function ratioRect(ratio: number, fit: CompositionGuideSchemaType["fit"], W: number, H: number): Rect {
  if (fit === "stretch") return { x: 0, y: 0, w: W, h: H };
  const w = Math.min(W, H * ratio);
  const h = w / ratio;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

/**
 * Whirling subdivision: cut a piece off the left, top, right, bottom in
 * turn and run a quarter-ellipse through each piece from corner to corner,
 * so the arcs join into one spiral. Built on an exact ratio x 1 rectangle,
 * then mapped onto `rect` (stretched in `stretch` fit). `cut` returns the
 * piece's thickness along the long side of what is left.
 */
function whirl(
  ratio: number,
  rect: Rect,
  steps: number,
  cut: (long: number, short: number) => number,
): GuideStroke[] {
  const strokes: GuideStroke[] = [];
  const sx = rect.w / ratio;
  const sy = rect.h;
  const map = (p: Point): Point => [rect.x + p[0] * sx, rect.y + p[1] * sy];
  let x = 0;
  let y = 0;
  let w = ratio;
  let h = 1;
  let spiral = "";
  for (let i = 0; i < steps; i++) {
    const side = i % 4;
    const horizontal = side === 0 || side === 2;
    const c = horizontal ? cut(w, h) : cut(h, w);
    let piece: Rect;
    let start: Point;
    let end: Point;
    let divider: [Point, Point];
    if (side === 0) {
      piece = { x, y, w: c, h };
      start = [x, y + h];
      end = [x + c, y];
      divider = [[x + c, y], [x + c, y + h]];
      x += c;
      w -= c;
    } else if (side === 1) {
      piece = { x, y, w, h: c };
      start = [x, y];
      end = [x + w, y + c];
      divider = [[x, y + c], [x + w, y + c]];
      y += c;
      h -= c;
    } else if (side === 2) {
      piece = { x: x + w - c, y, w: c, h };
      start = [x + w, y];
      end = [x + w - c, y + h];
      divider = [[x + w - c, y], [x + w - c, y + h]];
      w -= c;
    } else {
      piece = { x, y: y + h - c, w, h: c };
      start = [x + w, y + h];
      end = [x, y + h - c];
      divider = [[x, y + h - c], [x + w, y + h - c]];
      h -= c;
    }
    strokes.push(...line(map(divider[0]), map(divider[1]), i));
    const s0 = map(start);
    const e0 = map(end);
    if (i === 0) spiral = `M${f(s0[0])},${f(s0[1])}`;
    spiral += `A${f(piece.w * sx)},${f(piece.h * sy)} 0 0 1 ${f(e0[0])},${f(e0[1])}`;
  }
  // The spiral follows the last divider.
  strokes.push({ d: spiral, order: steps, long: true });
  return strokes;
}

/** Outline of a centered true-ratio rectangle (skipped when it fills the frame). */
function frameEdges(rect: Rect, W: number, H: number): GuideStroke[] {
  if (rect.w >= W - 0.5 && rect.h >= H - 0.5) return [];
  const { x, y, w, h } = rect;
  return [
    ...line([x, y], [x, y + h], 0),
    ...line([x + w, y], [x + w, y + h], 0),
    ...line([x, y], [x + w, y], 0),
    ...line([x, y + h], [x + w, y + h], 0),
  ];
}

/** Every stroke of a guide in frame pixels, before any flip. */
export function buildGuide(props: CompositionGuideSchemaType, W: number, H: number): GuideStroke[] {
  switch (props.guide) {
    case "thirds":
      return divisionLines([1 / 3, 2 / 3], [1 / 3, 2 / 3], W, H);
    case "halves":
      return divisionLines([0.5], [0.5], W, H);
    case "grid": {
      const n = props.divisions;
      const ts = Array.from({ length: n - 1 }, (_, i) => (i + 1) / n);
      return divisionLines(ts, ts, W, H);
    }
    case "diagonal": {
      const s = Math.min(W, H);
      return [
        ...line([0, 0], [W, H], 0),
        ...line([W, 0], [0, H], 0),
        ...line([0, 0], [s, s], 1),
        ...line([W, 0], [W - s, s], 1),
        ...line([0, H], [s, H - s], 2),
        ...line([W, H], [W - s, H - s], 2),
      ];
    }
    case "goldenGrid": {
      const t = 1 / (GOLDEN_RATIO * GOLDEN_RATIO);
      return divisionLines([t, 1 - t], [t, 1 - t], W, H);
    }
    case "silverGrid": {
      const t = 1 / (1 + SILVER_RATIO);
      return divisionLines([t, 1 - t], [t, 1 - t], W, H);
    }
    case "goldenTriangle": {
      const a: Point = [0, H];
      const b: Point = [W, 0];
      return [
        ...line(a, b, 0),
        ...line([0, 0], foot([0, 0], a, b), 1),
        ...line([W, H], foot([W, H], a, b), 1),
      ];
    }
    case "goldenSpiral": {
      const rect = ratioRect(GOLDEN_RATIO, props.fit, W, H);
      // A square off the long side each turn.
      return [...frameEdges(rect, W, H), ...whirl(GOLDEN_RATIO, rect, 10, (_long, short) => short)];
    }
    case "silverSpiral": {
      const rect = ratioRect(SILVER_RATIO, props.fit, W, H);
      // Halving a 1 : sqrt(2) rectangle leaves another one, turned 90 degrees.
      return [...frameEdges(rect, W, H), ...whirl(SILVER_RATIO, rect, 10, (long) => long / 2)];
    }
  }
}
