import { type BrushStyle, DEFAULT_STYLE, brushFill, strokePath } from './brushes';
import { GRID, type HandwritingData, type PenPoint, type PenStroke } from './types';

// Records the pen on a canvas (browser only, no API calls): every pointer sample (with the
// coalesced ones the browser collects between frames) as [x, y, pressure, t]. Draws the ink
// with the chosen brush (brushes.ts) and replays recordings with their real timing.
//
// Drawing: finished lines are kept on an offscreen canvas; on each animation frame the screen
// gets that canvas plus the line being written, recomputed as one smooth outline.

const MAX_REPLAY_GAP = 400; // ms: longer pen-up pauses are shortened in the replay
const MAX_CANVAS_PX = 4096; // backing canvas side, also when the page is pinch-zoomed
const PRESSURE_EVERY = 80; // ms between pressure meter updates
// ms after the pen is lifted that still count as writing: the wrist rests on the screen
// between lines, its taps must not press buttons (touch-guard.ts)
const WRITING_TAIL = 1500;

export type PressureInfo = { pressure: number; max: number; type: string };

// a recording drawn instead of own lines: a replay, or what it left after it ended
type Shown = { strokes: PenStroke[]; style: BrushStyle; pen: boolean };
export type ReplayData = { strokes: PenStroke[]; style?: BrushStyle; pen?: boolean };

export class PenRecorder {
  private ctx: CanvasRenderingContext2D;
  private done: HTMLCanvasElement; // own finished lines
  private doneCtx: CanvasRenderingContext2D;
  private strokes: PenStroke[] = [];
  private current: PenStroke | null = null;
  private currentMax = 0; // highest pressure of the line being written
  private pointerId: number | null = null;
  private start = 0; // event time of the first point of the character
  private penSeen = false;
  private cssSize = 400;
  private style: BrushStyle = DEFAULT_STYLE;
  private frame = 0; // scheduled redraw
  private dirty = false; // own finished lines to draw again on the next frame
  private replayFrame = 0;
  private resolveReplay: (() => void) | null = null;
  private shown: Shown | null = null;
  private pressureAt = 0;
  private liftedAt = -Infinity; // performance.now() of the last pen up

  constructor(
    private canvas: HTMLCanvasElement,
    private onChange: (strokeCount: number) => void,
    private onPressure: (info: PressureInfo) => void = () => {},
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.done = document.createElement('canvas');
    this.doneCtx = this.done.getContext('2d')!;
  }

  attach() {
    const c = this.canvas;
    const down = (e: PointerEvent) => this.down(e);
    const move = (e: PointerEvent) => this.move(e);
    const up = (e: PointerEvent) => this.up(e);
    // pinch zoom: more canvas pixels, so the ink stays sharp
    const zoom = () => this.setSize(this.cssSize);
    c.addEventListener('pointerdown', down);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    // the pen's pointerup can be lost (Safari): without this the pen stays "down", it can't
    // start a new line and fingers stay blocked (touch-guard.ts)
    c.addEventListener('lostpointercapture', up);
    window.visualViewport?.addEventListener('resize', zoom);
    return () => {
      c.removeEventListener('pointerdown', down);
      c.removeEventListener('pointermove', move);
      c.removeEventListener('pointerup', up);
      c.removeEventListener('pointercancel', up);
      c.removeEventListener('lostpointercapture', up);
      window.visualViewport?.removeEventListener('resize', zoom);
      this.stopReplay();
      if (this.frame) cancelAnimationFrame(this.frame);
    };
  }

  setSize(cssSize: number) {
    this.cssSize = cssSize;
    const scale = (window.devicePixelRatio || 1) * (window.visualViewport?.scale || 1);
    const px = Math.min(MAX_CANVAS_PX, Math.round(cssSize * scale));
    if (px === this.canvas.width) return;
    this.canvas.width = this.canvas.height = px;
    this.done.width = this.done.height = px;
    this.rebuildSoon();
  }

  // a slider sends a new style on every step: the lines are drawn again once per frame, and
  // not at all when nothing changed
  setStyle(style: BrushStyle) {
    const keys = Object.keys({ ...this.style, ...style }) as (keyof BrushStyle)[];
    if (keys.every((k) => this.style[k] === style[k])) return;
    this.style = style;
    this.rebuildSoon();
  }

  get count() {
    return this.strokes.length;
  }

  // the stylus is on the screen or was lifted a moment ago
  get writing() {
    if (!this.penSeen) return false;
    return this.pointerId !== null || performance.now() - this.liftedAt < WRITING_TAIL;
  }

  getData(): HandwritingData {
    return {
      strokes: this.strokes.map((s) => s.map((p) => [...p] as PenPoint)),
      size: this.cssSize,
      pen: this.penSeen,
      style: { ...this.style },
    };
  }

  undo() {
    this.stopReplay();
    this.shown = null;
    this.strokes.pop();
    this.rebuild();
    this.onChange(this.strokes.length);
  }

  clear() {
    this.stopReplay();
    this.shown = null;
    this.strokes = [];
    this.current = null;
    this.pointerId = null;
    this.rebuild();
    this.onChange(0);
  }

  // own lines when no data is given; a saved recording with its own brush when it has one.
  // Resolves when the replay ends or is stopped; the whole drawing stays on the canvas.
  replay(data?: ReplayData, speed = 1): Promise<void> {
    this.stopReplay();
    const show: Shown = data
      ? { strokes: data.strokes, style: data.style || this.style, pen: Boolean(data.pen) }
      : { strokes: this.strokes, style: this.style, pen: this.penSeen };
    this.shown = data ? show : null;

    // shift every point back by the pen-up time cut from the pauses before it
    const timeline: PenStroke[] = [];
    let cut = 0;
    let prevEnd = show.strokes[0]?.[0]?.[3] ?? 0;
    show.strokes.forEach((s) => {
      const gap = s[0][3] - prevEnd;
      if (gap > MAX_REPLAY_GAP) cut += gap - MAX_REPLAY_GAP;
      timeline.push(s.map(([x, y, p, t]) => [x, y, p, t - cut] as PenPoint));
      prevEnd = s[s.length - 1][3];
    });
    const t0 = timeline[0]?.[0]?.[3] ?? 0;
    const k = this.canvas.width / GRID;
    const fill = brushFill(this.ctx, show.style);

    return new Promise((resolve) => {
      const drawn = timeline.map(() => 0); // points shown of each line
      const finished: (Path2D | null)[] = timeline.map(() => null);
      const began = performance.now();
      const step = () => {
        const now = t0 + (performance.now() - began) * speed;
        let left = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = fill;
        timeline.forEach((s, i) => {
          while (drawn[i] < s.length && s[drawn[i]][3] <= now) drawn[i]++;
          if (drawn[i] < s.length) left = true;
          if (!drawn[i]) return;
          if (drawn[i] === s.length) {
            finished[i] ||= strokePath(s, show.style, show.pen, k, true);
            this.ctx.fill(finished[i]!);
          } else {
            this.ctx.fill(strokePath(s.slice(0, drawn[i]), show.style, show.pen, k, false));
          }
        });
        if (left) this.replayFrame = requestAnimationFrame(step);
        else this.stopReplay();
      };
      this.resolveReplay = resolve;
      this.replayFrame = requestAnimationFrame(step);
    });
  }

  stopReplay() {
    if (!this.replayFrame) return;
    cancelAnimationFrame(this.replayFrame);
    this.replayFrame = 0;
    this.resolveReplay?.();
    this.resolveReplay = null;
    this.render();
  }

  private down(e: PointerEvent) {
    if (e.pointerType === 'pen') this.penSeen = true;
    // palm rejection: once a stylus was used, fingers and the palm do not draw
    if (this.penSeen && e.pointerType === 'touch') return;
    if (this.pointerId !== null) return;
    e.preventDefault();

    // writing hides a replay and shows own lines again
    if (this.replayFrame || this.shown) {
      this.shown = null;
      this.stopReplay();
      this.render();
    }
    this.canvas.setPointerCapture?.(e.pointerId);
    this.pointerId = e.pointerId;
    if (!this.strokes.length) this.start = e.timeStamp;
    this.current = [this.toPoint(e)];
    this.currentMax = this.current[0][2];
    this.strokes.push(this.current);
    this.schedule();
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
      this.currentMax = Math.max(this.currentMax, p[2]);
    });
    this.schedule();

    if (e.timeStamp - this.pressureAt > PRESSURE_EVERY) {
      this.pressureAt = e.timeStamp;
      this.onPressure({ pressure: e.pressure, max: this.currentMax, type: e.pointerType });
    }
  }

  private up(e: PointerEvent) {
    if (e.pointerId !== this.pointerId) return;
    if (this.current) this.drawLine(this.doneCtx, this.current, true);
    this.liftedAt = performance.now();
    this.pointerId = null;
    this.current = null;
    this.schedule();
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

  private drawLine(ctx: CanvasRenderingContext2D, stroke: PenStroke, last: boolean) {
    ctx.fillStyle = brushFill(ctx, this.style);
    ctx.fill(strokePath(stroke, this.style, this.penSeen, this.canvas.width / GRID, last));
  }

  // at most one redraw per animation frame, however many samples came
  private schedule() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      if (this.dirty) this.rebuild();
      else this.render();
    });
  }

  private rebuildSoon() {
    this.dirty = true;
    this.schedule();
  }

  // own finished lines drawn again: after undo, a new size or brush
  private rebuild() {
    this.dirty = false;
    this.doneCtx.clearRect(0, 0, this.done.width, this.done.height);
    this.strokes.forEach((s) => s !== this.current && this.drawLine(this.doneCtx, s, true));
    this.render();
  }

  private render() {
    if (this.replayFrame) return; // the replay draws itself
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.shown) {
      const { strokes, style, pen } = this.shown;
      const k = canvas.width / GRID;
      ctx.fillStyle = brushFill(ctx, style);
      strokes.forEach((s) => ctx.fill(strokePath(s, style, pen, k, true)));
      return;
    }
    ctx.drawImage(this.done, 0, 0);
    if (this.current) this.drawLine(ctx, this.current, false);
  }
}
