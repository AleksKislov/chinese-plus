import { GRID, type HandwritingData, type PenPoint, type PenStroke } from './types';

// Records the pen on a canvas (browser only, no API calls): every pointer sample (with the
// coalesced ones Safari collects between frames: Apple Pencil gives up to 240 per second) as
// [x, y, pressure, t]. Draws the ink with a width that follows the pressure, and replays
// recordings with their real timing.

const INK = '#111';
const REPLAY_INK = '#1d4ed8';
const MAX_REPLAY_GAP = 400; // ms: longer pen-up pauses are shortened in the replay

export class PenRecorder {
  private ctx: CanvasRenderingContext2D;
  private strokes: PenStroke[] = [];
  private current: PenStroke | null = null;
  private pointerId: number | null = null;
  private start = 0; // event time of the first point of the character
  private penSeen = false;
  private cssSize = 400;
  private width = 22; // base line width on the 1000 grid
  private replayFrame = 0;
  private resolveReplay: (() => void) | null = null;
  // a replayed recording left on the canvas (null: own strokes are shown)
  private shown: { strokes: PenStroke[]; color: string } | null = null;

  constructor(private canvas: HTMLCanvasElement, private onChange: (strokeCount: number) => void) {
    this.ctx = canvas.getContext('2d')!;
  }

  attach() {
    const c = this.canvas;
    const down = (e: PointerEvent) => this.down(e);
    const move = (e: PointerEvent) => this.move(e);
    const up = (e: PointerEvent) => this.up(e);
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    return () => {
      c.removeEventListener('pointerdown', down);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerup', up);
      c.removeEventListener('pointercancel', up);
      this.stopReplay();
    };
  }

  setSize(cssSize: number) {
    this.cssSize = cssSize;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(cssSize * dpr);
    this.canvas.height = Math.round(cssSize * dpr);
    this.redraw();
  }

  setWidth(width: number) {
    this.width = width;
    this.redraw();
  }

  get count() {
    return this.strokes.length;
  }

  getData(): HandwritingData {
    return {
      strokes: this.strokes.map((s) => s.map((p) => [...p] as PenPoint)),
      size: this.cssSize,
      pen: this.penSeen,
    };
  }

  undo() {
    this.stopReplay();
    this.shown = null;
    this.strokes.pop();
    this.redraw();
    this.onChange(this.strokes.length);
  }

  clear() {
    this.stopReplay();
    this.shown = null;
    this.strokes = [];
    this.current = null;
    this.pointerId = null;
    this.redraw();
    this.onChange(0);
  }

  // own strokes when none are given; resolves when the replay ends or is stopped
  replay(data?: Pick<HandwritingData, 'strokes'>, speed = 1): Promise<void> {
    this.stopReplay();
    const own = !data;
    const strokes = data?.strokes || this.strokes;
    const color = own ? INK : REPLAY_INK;
    this.shown = own ? null : { strokes, color };

    // shift every point back by the pen-up time cut from the pauses before it
    const timeline: PenStroke[] = [];
    let cut = 0;
    let prevEnd = strokes[0]?.[0]?.[3] ?? 0;
    strokes.forEach((s) => {
      const gap = s[0][3] - prevEnd;
      if (gap > MAX_REPLAY_GAP) cut += gap - MAX_REPLAY_GAP;
      timeline.push(s.map(([x, y, p, t]) => [x, y, p, t - cut] as PenPoint));
      prevEnd = s[s.length - 1][3];
    });
    const t0 = timeline[0]?.[0]?.[3] ?? 0;
    this.clearCanvas();

    return new Promise((resolve) => {
      const drawn = timeline.map(() => 0); // points drawn of each stroke
      const began = performance.now();
      const frame = () => {
        const now = t0 + (performance.now() - began) * speed;
        let left = false;
        timeline.forEach((s, i) => {
          while (drawn[i] < s.length && s[drawn[i]][3] <= now) {
            this.drawPoint(s, drawn[i], color);
            drawn[i]++;
          }
          if (drawn[i] < s.length) left = true;
        });
        if (left) this.replayFrame = requestAnimationFrame(frame);
        else this.stopReplay();
      };
      this.resolveReplay = resolve;
      this.replayFrame = requestAnimationFrame(frame);
    });
  }

  // a stopped replay leaves the whole drawing on the canvas
  stopReplay() {
    if (!this.replayFrame) return;
    cancelAnimationFrame(this.replayFrame);
    this.replayFrame = 0;
    this.resolveReplay?.();
    this.resolveReplay = null;
    this.redraw();
  }

  private down(e: PointerEvent) {
    if (e.pointerType === 'pen') this.penSeen = true;
    // palm rejection: once a stylus was used, fingers and the palm do not draw
    if (this.penSeen && e.pointerType === 'touch') return;
    if (this.pointerId !== null) return;
    e.preventDefault();

    // writing hides a replay and shows own strokes again
    if (this.replayFrame || this.shown) {
      this.stopReplay();
      this.shown = null;
      this.redraw();
    }
    this.canvas.setPointerCapture?.(e.pointerId);
    this.pointerId = e.pointerId;
    if (!this.strokes.length) this.start = e.timeStamp;
    this.current = [this.toPoint(e)];
    this.strokes.push(this.current);
    this.drawPoint(this.current, 0, INK);
  }

  private move(e: PointerEvent) {
    if (e.pointerId !== this.pointerId || !this.current) return;
    e.preventDefault();
    const events = e.getCoalescedEvents?.() || [];
    (events.length ? events : [e]).forEach((ev) => {
      const p = this.toPoint(ev);
      const last = this.current![this.current!.length - 1];
      if (p[0] === last[0] && p[1] === last[1] && p[3] === last[3]) return;
      this.current!.push(p);
      this.drawPoint(this.current!, this.current!.length - 1, INK);
    });
  }

  private up(e: PointerEvent) {
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.current = null;
    this.onChange(this.strokes.length);
  }

  private toPoint(e: PointerEvent): PenPoint {
    const r = this.canvas.getBoundingClientRect();
    const clamp = (n: number) => Math.min(GRID, Math.max(0, n));
    // a mouse reports 0.5 while pressed, a finger 0 or 1: only a stylus has real pressure
    const pressure = e.pointerType === 'pen' ? e.pressure : 0.5;
    return [
      Math.round(clamp(((e.clientX - r.left) / r.width) * GRID) * 10) / 10,
      Math.round(clamp(((e.clientY - r.top) / r.height) * GRID) * 10) / 10,
      Math.round(pressure * 100) / 100,
      Math.max(0, Math.round(e.timeStamp - this.start)),
    ];
  }

  // line width on the 1000 grid: thin at a light touch, up to ~1.25 of the base when pressed
  private lineWidth(pressure: number) {
    return this.width * (0.3 + 0.95 * pressure);
  }

  // the segment from the previous point (a dot for the first one)
  private drawPoint(stroke: PenStroke, i: number, color: string) {
    const k = this.canvas.width / GRID;
    const ctx = this.ctx;
    const [x, y, p] = stroke[i];
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (i === 0) {
      ctx.beginPath();
      ctx.arc(x * k, y * k, (this.lineWidth(p) * k) / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const [px, py, pp] = stroke[i - 1];
    ctx.lineWidth = this.lineWidth((p + pp) / 2) * k;
    ctx.beginPath();
    ctx.moveTo(px * k, py * k);
    ctx.lineTo(x * k, y * k);
    ctx.stroke();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private redraw() {
    if (this.replayFrame) return; // the replay draws itself
    this.clearCanvas();
    const { strokes, color } = this.shown || { strokes: this.strokes, color: INK };
    strokes.forEach((s) => s.forEach((_, i) => this.drawPoint(s, i, color)));
  }
}
