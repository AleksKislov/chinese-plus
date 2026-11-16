import { type PenStroke } from './types';

// How a recording looks. Only the look: the saved points stay raw ([x, y, pressure, t]), so
// the same recording can be drawn with any brush; the brush settings are saved next to them
// to build the animated font with the same look.
//
// A line is drawn as a pen tip moved along the path: a disc at every point (its radius from the
// pressure) joined to the next disc by the band that touches both, all filled as one shape.
// So a corner keeps its full width (one outline offset from the path narrows at corners, by
// cos of half the angle: about 70% at a right angle) and the first light touch is not lost.
// The path is resampled every STEP units and smoothed by distance on both sides of each point
// (a Gaussian, not a filter that follows the pen and lags): hand tremor and sample noise go,
// the ends stay where the pen was, the shape doesn't drift.

export type BrushId = 'pen' | 'fountain' | 'pencil';

export type BrushStyle = {
  brush: BrushId;
  width: number; // base line width on the 1000 grid
  sensitivity: number; // 1..10: how hard to press for the fullest line, see pressureCurve
  // thin start / end of every line, length on the 1000 grid (0: none). By distance, as the
  // taper of Procreate brushes, whatever the pressure
  taperStart?: number;
  taperEnd?: number;
  smoothing?: number; // 0..10: removes tremor; more = rounder corners
};

type Brush = {
  id: BrushId;
  name: string;
  color: string;
  grain?: boolean; // pencil texture
  scale: number; // of the base width
  thinning: number; // how much the pressure changes the width: 0 even .. 1 a lot
};

export const BRUSHES: Brush[] = [
  { id: 'pen', name: 'Ручка', color: '#111111', scale: 1, thinning: 0.35 },
  { id: 'fountain', name: 'Перьевая ручка', color: '#0f1420', scale: 1.25, thinning: 0.75 },
  { id: 'pencil', name: 'Карандаш', color: '#262626', grain: true, scale: 0.8, thinning: 0.5 },
];

export const DEFAULT_STYLE: Required<BrushStyle> = {
  brush: 'fountain',
  width: 22,
  sensitivity: 5,
  taperStart: 60,
  taperEnd: 80,
  smoothing: 5,
};
export const MAX_TAPER = 250;
export const MAX_SMOOTHING = 10;

export const findBrush = (id: string) => BRUSHES.find((b) => b.id === id) || BRUSHES[0];

// Safari gives the Apple Pencil's force as pressure 0..1, and ordinary writing stays near
// 0.1-0.3, so a linear mapping hardly changes the width. The fullest line is reached at
// `full` pressure: 1.0 at sensitivity 1, 0.4 at 4, 0.18 at 10.
export const fullPressure = (sensitivity: number) => 1 / (1 + 0.5 * (sensitivity - 1));

export const pressureCurve = (pressure: number, sensitivity: number) =>
  Math.min(1, pressure / fullPressure(sensitivity));

const STEP = 1.5; // resampling step on the 1000 grid
const MIN_RADIUS = 0.4;
const MIN_TAPER = 0.08; // the thinnest end of a taper, of the radius
const SIGMA_PER_SMOOTHING = 2; // Gaussian sigma on the 1000 grid per smoothing step
const PRESSURE_SIGMA = 1.5; // the width is smoothed wider than the path: no bumps

type Tip = { x: number; y: number; r: number };

// the pen tip positions of a line on the 1000 grid, smoothed, resampled and tapered
export function strokeTips(
  stroke: PenStroke,
  style: BrushStyle,
  pen: boolean,
  last: boolean,
): Tip[] {
  if (!stroke.length) return [];
  const brush = findBrush(style.brush);
  const size = style.width * brush.scale;
  const radius = (p: number) => size * (0.5 - brush.thinning * (0.5 - p));

  const pr = (raw: number) => (pen ? pressureCurve(raw, style.sensitivity) : 0.5);

  // 1. the raw line resampled every STEP units (linear), so the smoothing works by distance and
  // not by how often the browser sent samples; the last raw point is kept exactly
  // here r holds the pressure (0..1); it becomes the radius after smoothing
  const pts: Tip[] = [{ x: stroke[0][0], y: stroke[0][1], r: pr(stroke[0][2]) }];
  let since = 0; // path length since the last resampled point
  for (let i = 1; i < stroke.length; i++) {
    const [ax, ay, ap] = stroke[i - 1];
    const [bx, by, bp] = stroke[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (!seg) continue;
    let at = STEP - since;
    for (; at <= seg; at += STEP) {
      const t = at / seg;
      pts.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t, r: pr(ap + (bp - ap) * t) });
    }
    since = seg - (at - STEP);
  }
  const end = stroke[stroke.length - 1];
  if (since > STEP * 0.1) pts.push({ x: end[0], y: end[1], r: pr(end[2]) });

  // 2. Gaussian smoothing on both sides of each point; near the ends the window shrinks evenly,
  // so the first and last points stay put (the line still starts and ends under the pen)
  const smoothing = style.smoothing ?? DEFAULT_STYLE.smoothing;
  const sigma = (smoothing * SIGMA_PER_SMOOTHING) / STEP; // in resampled points
  const xy = gaussian(pts, sigma, (q) => [q.x, q.y]);
  const width = gaussian(pts, Math.max(sigma, 1) * PRESSURE_SIGMA, (q) => [q.r]);
  const tips: Tip[] = pts.map((_, i) => ({ x: xy[i][0], y: xy[i][1], r: radius(width[i][0]) }));

  // 3. tapers by distance from the start and (once lifted) to the end; a line shorter than both
  // tapers gets them shortened in proportion, so a dot stays visible
  const dist = [0];
  for (let i = 1; i < tips.length; i++) {
    dist.push(dist[i - 1] + Math.hypot(tips[i].x - tips[i - 1].x, tips[i].y - tips[i - 1].y));
  }
  const total = dist[dist.length - 1];
  let ts = style.taperStart ?? DEFAULT_STYLE.taperStart;
  let te = last ? style.taperEnd ?? DEFAULT_STYLE.taperEnd : 0;
  if (ts + te > total && ts + te > 0) {
    const k = total / (ts + te);
    ts *= k;
    te *= k;
  }
  const ease = (t: number) => MIN_TAPER + (1 - MIN_TAPER) * Math.sin((t * Math.PI) / 2);
  tips.forEach((tip, i) => {
    let f = 1;
    if (ts > 0 && dist[i] < ts) f = Math.min(f, ease(dist[i] / ts));
    if (te > 0 && total - dist[i] < te) f = Math.min(f, ease((total - dist[i]) / te));
    tip.r = Math.max(MIN_RADIUS, tip.r * f);
  });
  return tips;
}

// each value averaged with its neighbours, weights exp(-d²/2σ²) over ±3σ; at the ends the
// window is cut to the same reach on both sides
function gaussian(pts: Tip[], sigma: number, get: (q: Tip) => number[]): number[][] {
  const vals = pts.map(get);
  if (sigma < 0.3 || pts.length < 3) return vals;
  const reach = Math.ceil(sigma * 3);
  const w = Array.from({ length: reach + 1 }, (_, j) => Math.exp(-(j * j) / (2 * sigma * sigma)));
  return vals.map((v, i) => {
    const h = Math.min(reach, i, vals.length - 1 - i);
    const sum = v.map(() => 0);
    let total = 0;
    for (let j = -h; j <= h; j++) {
      const wj = w[Math.abs(j)];
      vals[i + j].forEach((x, c) => (sum[c] += x * wj));
      total += wj;
    }
    return sum.map((x) => x / total);
  });
}

// the line as one fillable shape in canvas pixels (k = canvas px per grid unit): discs and the
// bands between them, all wound the same way so the nonzero fill is their union (one fill: no
// darker overlaps with a semi-transparent pencil)
export function strokePath(
  stroke: PenStroke,
  style: BrushStyle,
  pen: boolean,
  k: number,
  last: boolean,
): Path2D {
  const path = new Path2D();
  const tips = strokeTips(stroke, style, pen, last);
  tips.forEach((a, i) => {
    path.moveTo((a.x + a.r) * k, a.y * k);
    path.arc(a.x * k, a.y * k, a.r * k, 0, Math.PI * 2);
    const b = tips[i + 1];
    if (!b) return;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d <= Math.abs(a.r - b.r)) return; // one disc inside the other
    const dir = Math.atan2(b.y - a.y, b.x - a.x);
    const spread = Math.acos((a.r - b.r) / d); // to the outer tangent points
    const at = (c: Tip, angle: number) => [
      (c.x + c.r * Math.cos(angle)) * k,
      (c.y + c.r * Math.sin(angle)) * k,
    ];
    // same turning direction as arc(): angles growing, clockwise on screen
    const quad = [
      at(a, dir + spread),
      at(b, dir + spread),
      at(b, dir - spread),
      at(a, dir - spread),
    ];
    const area = quad.reduce((sum, q, j) => {
      const n = quad[(j + 1) % 4];
      return sum + q[0] * n[1] - n[0] * q[1];
    }, 0);
    if (area < 0) quad.reverse();
    path.moveTo(quad[0][0], quad[0][1]);
    quad.slice(1).forEach(([x, y]) => path.lineTo(x, y));
    path.closePath();
  });
  return path;
}

// pencil: the ink color with a little random transparency, as graphite on paper
let grainCanvas: HTMLCanvasElement | null = null;
export function brushFill(ctx: CanvasRenderingContext2D, style: BrushStyle) {
  const brush = findBrush(style.brush);
  if (!brush.grain) return brush.color;
  if (!grainCanvas) {
    grainCanvas = document.createElement('canvas');
    grainCanvas.width = grainCanvas.height = 96;
    const g = grainCanvas.getContext('2d')!;
    const img = g.createImageData(96, 96);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 38;
      img.data[i + 3] = 190 + Math.random() * 65; // 75-100% opaque
    }
    g.putImageData(img, 0, 0);
  }
  return ctx.createPattern(grainCanvas, 'repeat') || brush.color;
}
