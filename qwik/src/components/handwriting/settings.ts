import { type BrushId, BRUSHES, DEFAULT_STYLE, MAX_SMOOTHING, MAX_TAPER } from './brushes';

// Settings of /admin/handwriting/. Two copies:
// - the working copy, one per model font, in localStorage: every change is kept at once;
// - the saved settings of a font, on the BE (api/handwriting/settings/:font, model
//   server/src/models/HandwritingSettings.js): changed only by the "save" button, so an
//   accidental change can be undone with "restore". They survive another browser or a cleared
//   localStorage, and a font opened without a working copy here starts from them.

export type HandwritingSettings = {
  size: number; // writing square, css px
  opacity: number; // of the model character
  width: number; // line width on the 1000 grid
  brush: BrushId;
  sensitivity: number; // 1..10, see brushes.ts
  taperStart: number; // thin start of lines
  taperEnd: number;
  smoothing: number; // 0..10, removes tremor
  speed: number; // replay
  autoNext: boolean; // after saving go to the next unsaved character
};

export type SavedSettings = { font: string; settings: HandwritingSettings; updatedAt: string };

export const SIZE_MIN = 200;
export const SIZE_MAX = 1000;
export const WIDTH_MIN = 6;
export const WIDTH_MAX = 60;
export const OPACITY_MAX = 0.6;
export const SPEEDS = [0.5, 1, 2, 4];

export const defaultSettings = (size = 560): HandwritingSettings => ({
  size,
  opacity: 0.15,
  width: DEFAULT_STYLE.width,
  brush: DEFAULT_STYLE.brush,
  sensitivity: DEFAULT_STYLE.sensitivity,
  taperStart: DEFAULT_STYLE.taperStart,
  taperEnd: DEFAULT_STYLE.taperEnd,
  smoothing: DEFAULT_STYLE.smoothing,
  speed: 1,
  autoNext: true,
});

// settings from localStorage or the BE, checked against the page's limits; a missing or bad
// value is taken from `base`
export function cleanSettings(raw: unknown, base: HandwritingSettings): HandwritingSettings {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<string, unknown>>;
  const num = (key: keyof HandwritingSettings, min: number, max: number): number => {
    const n = s[key];
    return typeof n === 'number' && Number.isFinite(n)
      ? Math.min(max, Math.max(min, n))
      : (base[key] as number);
  };
  const brush = BRUSHES.find((b) => b.id === s.brush)?.id ?? base.brush;
  return {
    size: Math.round(num('size', SIZE_MIN, SIZE_MAX)),
    opacity: Math.round(num('opacity', 0, OPACITY_MAX) * 100) / 100,
    width: Math.round(num('width', WIDTH_MIN, WIDTH_MAX)),
    brush,
    sensitivity: Math.round(num('sensitivity', 1, 10)),
    taperStart: Math.round(num('taperStart', 0, MAX_TAPER)),
    taperEnd: Math.round(num('taperEnd', 0, MAX_TAPER)),
    smoothing: Math.round(num('smoothing', 0, MAX_SMOOTHING)),
    speed: SPEEDS.includes(s.speed as number) ? (s.speed as number) : base.speed,
    autoNext: typeof s.autoNext === 'boolean' ? s.autoNext : base.autoNext,
  };
}

// what each setting is called on the page and how its value is shown, in the page's order
export const SETTING_LABELS: [keyof HandwritingSettings, string][] = [
  ['brush', 'Кисть'],
  ['size', 'Размер поля'],
  ['opacity', 'Видимость образца'],
  ['width', 'Толщина линии'],
  ['sensitivity', 'Чувствительность нажима'],
  ['smoothing', 'Сглаживание дрожи'],
  ['taperStart', 'Тонкое начало линии'],
  ['taperEnd', 'Тонкий конец линии'],
  ['speed', 'Скорость повтора'],
  ['autoNext', 'После сохранения — следующий'],
];

export function showSetting(key: keyof HandwritingSettings, s: HandwritingSettings): string {
  switch (key) {
    case 'brush':
      return BRUSHES.find((b) => b.id === s.brush)?.name ?? s.brush;
    case 'size':
      return `${s.size}px`;
    case 'opacity':
      return `${Math.round(s.opacity * 100)}%`;
    case 'speed':
      return `×${s.speed}`;
    case 'autoNext':
      return s.autoNext ? 'да' : 'нет';
    default:
      return String(s[key]);
  }
}

// the settings that differ: [label, saved value, current value]
export function settingsDiff(
  saved: HandwritingSettings,
  current: HandwritingSettings,
): [string, string, string][] {
  return SETTING_LABELS.filter(([key]) => {
    const a = saved[key];
    const b = current[key];
    return typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) > 1e-6 : a !== b;
  }).map(([key, label]) => [label, showSetting(key, saved), showSetting(key, current)]);
}
