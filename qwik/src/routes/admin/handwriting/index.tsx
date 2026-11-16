import {
  $,
  component$,
  type NoSerialize,
  noSerialize,
  useComputed$,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';
import HanziWriter from 'hanzi-writer';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import {
  deleteHandwriting,
  getHandwriting,
  saveHandwriting,
} from '~/misc/actions/handwriting/handwriting-api';
import { PageTitle } from '~/components/common/layout/title';
import { MiGrid } from '~/components/handwriting/mi-grid';
import { PenRecorder, type PressureInfo } from '~/components/handwriting/pen-recorder';
import { guardTouches } from '~/components/handwriting/touch-guard';
import {
  BRUSHES,
  type BrushId,
  DEFAULT_STYLE,
  findBrush,
  fullPressure,
  MAX_SMOOTHING,
  MAX_TAPER,
} from '~/components/handwriting/brushes';
import {
  DEFAULT_FONT,
  HANDWRITING_FONTS,
  findFont,
  fontFaceCss,
  fontFamily,
} from '~/components/handwriting/fonts';
import {
  DEFAULT_HSK,
  HAN_RE,
  HANDWRITING_PATH,
  type HandwritingChar,
  type HandwritingPageData,
  HSK_SETS,
  KAI_FONT,
  MAX_CHARS,
} from '~/components/handwriting/types';

// Hidden admin page (no links to it): trace characters with a stylus over a model font,
// the pen movement is saved to build an animated handwriting font. See components/handwriting/.

// ?font=<id> &chars=<typed characters> or &hsk=3-1 (new characters of an HSK 3.0 level)
export const useHandwritingPage = routeLoader$(
  async ({ cookie, query, redirect }): Promise<HandwritingPageData> => {
    const token = getTokenFromCookie(cookie);
    if (!token) throw redirect(302, '/');

    const font = findFont(query.get('font') || '')?.id || DEFAULT_FONT;
    // the BE refuses everyone but admins
    const saved: string[] | null = await ApiService.get(
      `/api/handwriting?font=${font}`,
      token,
      null,
    );
    if (!saved) throw redirect(302, '/');

    const typed = [...new Set([...(query.get('chars') || '')].filter((ch) => HAN_RE.test(ch)))]
      .slice(0, MAX_CHARS)
      .join('');
    if (typed) {
      const chars: HandwritingChar[] = await ApiService.get(
        `/api/writing-sheets/chars?chars=${encodeURIComponent(typed)}`,
        undefined,
        [],
      );
      return { chars, saved, font, source: typed };
    }

    const hsk = HSK_SETS.includes(query.get('hsk') || '') ? query.get('hsk')! : DEFAULT_HSK;
    const [version, level] = hsk.split('-');
    const chars: HandwritingChar[] = await ApiService.get(
      `/api/writing-sheets/hsk?version=${version}&level=${level}`,
      undefined,
      [],
    );
    return { chars, saved, font, source: hsk };
  },
);

type Settings = {
  size: number;
  opacity: number;
  width: number;
  autoNext: boolean;
  brush: BrushId;
  sensitivity: number;
  taperStart: number;
  taperEnd: number;
  smoothing: number;
  speed: number;
};
// kept in this browser (localStorage): settings, the last font and character set (?query),
// and the current character of each set
const SETTINGS_KEY = 'handwriting-settings';
const QUERY_KEY = 'handwriting-query';
const POS_KEY = 'handwriting-pos'; // { [chars of the set]: index }
const MAX_POS = 30;
const SPEEDS = [0.5, 1, 2, 4];

const readJson = <T,>(key: string, empty: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? empty;
  } catch {
    return empty;
  }
};
const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode: not kept
  }
};
const SIZE_MIN = 200;
const SIZE_MAX = 1000;

export default component$(() => {
  const data = useHandwritingPage();
  const loc = useLocation();
  const nav = useNavigate();

  const idx = useSignal(0);
  const saved = useSignal<string[]>(data.value.saved);
  const charsKey = useSignal(data.value.chars.map((c) => c.ch).join(''));

  const size = useSignal(560); // writing square, css px
  const opacity = useSignal(0.15); // of the model character
  const width = useSignal(DEFAULT_STYLE.width); // line width on the 1000 grid
  const brush = useSignal<BrushId>(DEFAULT_STYLE.brush);
  const sensitivity = useSignal(DEFAULT_STYLE.sensitivity); // 1..10, see brushes.ts
  const taperStart = useSignal(DEFAULT_STYLE.taperStart); // thin start of lines
  const taperEnd = useSignal(DEFAULT_STYLE.taperEnd);
  const smoothing = useSignal(DEFAULT_STYLE.smoothing); // 0..10, removes tremor
  const pressure = useSignal<PressureInfo | null>(null); // live, to tune the sensitivity
  const autoNext = useSignal(true); // after saving go to the next unsaved character
  const speed = useSignal(1); // replay
  const settingsLoaded = useSignal(false);
  const posKey = useSignal(''); // set whose saved position was restored

  const strokeCount = useSignal(0);
  const busy = useSignal(false);
  const msg = useSignal('');
  const canvasRef = useSignal<HTMLCanvasElement>();
  const kaiRef = useSignal<HTMLDivElement>();
  const rec = useSignal<NoSerialize<PenRecorder>>();

  const font = useComputed$(() => findFont(data.value.font) || HANDWRITING_FONTS[0]);
  const current = useComputed$(() => data.value.chars[idx.value] as HandwritingChar | undefined);
  const isSaved = useComputed$(() =>
    Boolean(current.value && saved.value.includes(current.value.ch)),
  );

  // another font or character set loaded: a new font has its own saved characters
  useTask$(({ track }) => {
    const d = track(() => data.value);
    saved.value = d.saved;
    const key = d.chars.map((c) => c.ch).join('');
    if (key !== charsKey.value) {
      charsKey.value = key;
      idx.value = 0;
      rec.value?.clear();
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    // opened without a font or set: the ones used last time
    const lastQuery = readJson<string>(QUERY_KEY, '');
    if (!loc.url.search && lastQuery.startsWith('?') && lastQuery !== loc.url.search) {
      nav(`${HANDWRITING_PATH}${lastQuery}`);
    }

    try {
      const s: Partial<Settings> = readJson(SETTINGS_KEY, {});
      if (s.size) size.value = Math.min(SIZE_MAX, Math.max(SIZE_MIN, s.size));
      else size.value = Math.max(SIZE_MIN, Math.min(window.innerWidth - 32, 560));
      if (typeof s.opacity === 'number') opacity.value = s.opacity;
      if (s.width) width.value = s.width;
      if (typeof s.autoNext === 'boolean') autoNext.value = s.autoNext;
      if (s.brush) brush.value = findBrush(s.brush).id;
      if (s.sensitivity) sensitivity.value = Math.min(10, Math.max(1, s.sensitivity));
      if (s.speed && SPEEDS.includes(s.speed)) speed.value = s.speed;
      const taper = (n: unknown) => typeof n === 'number' && n >= 0 && n <= MAX_TAPER;
      if (taper(s.taperStart)) taperStart.value = s.taperStart!;
      if (taper(s.taperEnd)) taperEnd.value = s.taperEnd!;
      if (typeof s.smoothing === 'number' && s.smoothing >= 0 && s.smoothing <= MAX_SMOOTHING) {
        smoothing.value = s.smoothing;
      }
    } catch {
      size.value = Math.max(SIZE_MIN, Math.min(window.innerWidth - 32, 560));
    }
    settingsLoaded.value = true;

    if (!canvasRef.value) return;
    const r = new PenRecorder(
      canvasRef.value,
      (n) => (strokeCount.value = n),
      (info) => (pressure.value = info),
    );
    r.setSize(size.value);
    r.setStyle({
      brush: brush.value,
      width: width.value,
      sensitivity: sensitivity.value,
      taperStart: taperStart.value,
      taperEnd: taperEnd.value,
      smoothing: smoothing.value,
    });
    rec.value = noSerialize(r);
    const detach = r.attach();
    const unguard = guardTouches(() => r.writing);
    cleanup(() => {
      detach();
      unguard();
    });
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const s: Settings = {
      size: track(() => size.value),
      opacity: track(() => opacity.value),
      width: track(() => width.value),
      autoNext: track(() => autoNext.value),
      brush: track(() => brush.value),
      sensitivity: track(() => sensitivity.value),
      taperStart: track(() => taperStart.value),
      taperEnd: track(() => taperEnd.value),
      smoothing: track(() => smoothing.value),
      speed: track(() => speed.value),
    };
    if (!settingsLoaded.value) return;
    rec.value?.setSize(s.size);
    rec.value?.setStyle({
      brush: s.brush,
      width: s.width,
      sensitivity: s.sensitivity,
      taperStart: s.taperStart,
      taperEnd: s.taperEnd,
      smoothing: s.smoothing,
    });
    writeJson(SETTINGS_KEY, s);
  });

  // the font and set shown, to open them next time
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const query = track(() => loc.url.search);
    if (query) writeJson(QUERY_KEY, query);
  });

  // a set opened again: back to the character it was left at; then the current one is kept.
  // One task for both, so a new set's index 0 is not saved before its position is restored
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const key = track(() => charsKey.value);
    const i = track(() => idx.value);
    if (!key) return;
    const pos = readJson<Record<string, number>>(POS_KEY, {});
    if (key !== posKey.value) {
      posKey.value = key;
      const last = pos[key];
      if (Number.isInteger(last) && last !== i && last < data.value.chars.length) {
        idx.value = last; // the task runs again and saves it
        return;
      }
    }
    delete pos[key]; // re-added last: the oldest sets are dropped first
    pos[key] = i;
    const keys = Object.keys(pos);
    keys.slice(0, Math.max(0, keys.length - MAX_POS)).forEach((k) => delete pos[k]);
    writeJson(POS_KEY, pos);
  });

  // the character in Kaiti with its stroke order (Hanzi Writer data, from its CDN); tap: animate
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const ch = track(() => current.value?.ch);
    const el = kaiRef.value;
    if (!el || !ch) return;
    el.innerHTML = '';
    const writer = HanziWriter.create(el, ch, {
      width: 160,
      height: 160,
      padding: 5,
      showOutline: true,
      strokeColor: '#111',
      outlineColor: '#ddd',
      // not in Hanzi Writer's data: the system Kaiti
      onLoadCharDataError: () => {
        const div = document.createElement('div');
        div.textContent = ch;
        div.style.cssText = 'font-size:140px;line-height:160px;text-align:center';
        div.style.fontFamily = KAI_FONT;
        el.replaceChildren(div);
      },
    });
    el.onclick = () => writer.animateCharacter();
  });

  const goTo = $((i: number) => {
    const n = data.value.chars.length;
    if (!n) return;
    idx.value = (i + n) % n;
    msg.value = '';
    rec.value?.clear();
  });

  const save = $(async () => {
    const r = rec.value;
    const ch = current.value?.ch;
    if (!r || !ch || !r.count || busy.value) return;
    busy.value = true;
    msg.value = '';
    const res = await saveHandwriting({ font: font.value.id, char: ch, ...r.getData() });
    busy.value = false;
    if ('error' in res) {
      msg.value = res.error;
      return;
    }
    if (!saved.value.includes(ch)) saved.value = [...saved.value, ch];

    if (!autoNext.value) {
      msg.value = `${ch} сохранён`;
      return;
    }
    const chars = data.value.chars;
    const after = [...chars.slice(idx.value + 1), ...chars.slice(0, idx.value)];
    const next = after.find((c) => !saved.value.includes(c.ch));
    if (!next) {
      msg.value = `${ch} сохранён. Все иероглифы набора сохранены`;
      return;
    }
    await goTo(chars.indexOf(next));
    msg.value = `${ch} сохранён`;
  });

  const replaySaved = $(async () => {
    const ch = current.value?.ch;
    if (!ch || busy.value) return;
    busy.value = true;
    msg.value = '';
    const res = await getHandwriting({ font: font.value.id, char: ch });
    busy.value = false;
    if ('error' in res) {
      msg.value = res.error;
      return;
    }
    await rec.value?.replay(res, speed.value);
  });

  const removeSaved = $(async () => {
    const ch = current.value?.ch;
    if (!ch || busy.value || !confirm(`Удалить сохранённый ${ch} (${font.value.name})?`)) return;
    busy.value = true;
    const res = await deleteHandwriting({ font: font.value.id, char: ch });
    busy.value = false;
    if ('error' in res) {
      msg.value = res.error;
      return;
    }
    saved.value = saved.value.filter((c) => c !== ch);
    msg.value = `${ch} удалён`;
  });

  const pickFont = $((id: string) => {
    const params = new URLSearchParams(loc.url.searchParams);
    params.set('font', id);
    nav(`${HANDWRITING_PATH}?${params}`);
  });

  const chars = data.value.chars;
  const typed = !HSK_SETS.includes(data.value.source);
  const savedInSet = chars.filter((c) => saved.value.includes(c.ch)).length;

  return (
    <div style={{ touchAction: 'manipulation' }}>
      <style dangerouslySetInnerHTML={fontFaceCss} />
      <PageTitle txt="Пропись стилусом" />

      {/* model font and the character set */}
      <div class="flex flex-wrap items-end gap-3 mb-3">
        <label class="form-control">
          <span class="label-text text-xs">Шрифт-образец</span>
          <select
            class="select select-bordered select-sm"
            value={font.value.id}
            onChange$={(_, el) => pickFont(el.value)}
          >
            {HANDWRITING_FONTS.map((f) => (
              <option key={f.id} value={f.id} selected={f.id === font.value.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <form method="get" action={HANDWRITING_PATH} class="flex flex-wrap items-end gap-2">
          <input type="hidden" name="font" value={font.value.id} />
          <label class="form-control">
            <span class="label-text text-xs">HSK 3.0</span>
            <select name="hsk" class="select select-bordered select-sm">
              {HSK_SETS.map((s) => (
                <option key={s} value={s} selected={s === data.value.source}>
                  {`уровень ${s.split('-')[1]}`}
                </option>
              ))}
            </select>
          </label>
          <label class="form-control">
            <span class="label-text text-xs">или свои иероглифы (до {MAX_CHARS})</span>
            <input
              name="chars"
              class="input input-bordered input-sm w-56"
              value={typed ? data.value.source : ''}
              placeholder="永你好中国"
            />
          </label>
          <button type="submit" class="btn btn-sm">
            Показать
          </button>
        </form>
      </div>

      {/* characters of the set: saved ones are green */}
      <div class="text-xs mb-1 opacity-70">
        Сохранено {savedInSet} из {chars.length} ({font.value.name})
      </div>
      <div class="flex flex-wrap gap-1 mb-4">
        {chars.map((c, i) => {
          const isDone = saved.value.includes(c.ch);
          const active = i === idx.value;
          return (
            <button
              key={c.ch}
              type="button"
              title={`${c.py} ${c.ru}`}
              onClick$={() => goTo(i)}
              class={[
                'w-10 h-10 rounded text-2xl border',
                isDone ? 'bg-success/30 border-success' : 'bg-base-200 border-base-300',
                active ? 'ring-2 ring-primary' : '',
              ]}
              style={{ fontFamily: KAI_FONT }}
            >
              {c.ch}
            </button>
          );
        })}
        {!chars.length && <div class="opacity-70">Нет иероглифов</div>}
      </div>

      {/* always rendered: the recorder is attached to the canvas once */}
      <div class="flex flex-col lg:flex-row gap-6 items-start">
        {current.value && (
          <div class="card bg-base-200 shrink-0">
            <div class="card-body p-4 items-center text-center">
              <div ref={kaiRef} class="cursor-pointer" title="Нажмите: порядок черт" />
              <div class="text-lg">{current.value.py}</div>
              <div class="text-sm max-w-[180px]">{current.value.ru}</div>
              <div class="text-6xl mt-2" style={{ fontFamily: fontFamily(font.value) }}>
                {current.value.ch}
              </div>
              <div class="text-xs opacity-70">{font.value.name}</div>
              {isSaved.value && <div class="badge badge-success mt-2">сохранён</div>}
            </div>
          </div>
        )}

        <div>
          {/* writing square: 米字格, the model character, the ink canvas on top */}
          <div
            class="relative bg-white select-none"
            style={{ width: `${size.value}px`, height: `${size.value}px` }}
          >
            <MiGrid />
            <div
              class="absolute inset-0 flex items-center justify-center pointer-events-none text-black"
              style={{
                fontFamily: fontFamily(font.value),
                fontSize: `${size.value * 0.85}px`,
                lineHeight: 1,
                opacity: opacity.value,
              }}
            >
              {current.value?.ch}
            </div>
            <canvas
              ref={canvasRef}
              class="absolute inset-0 w-full h-full"
              style="touch-action:none;-webkit-user-select:none;-webkit-touch-callout:none"
            />
          </div>

          <div class="flex flex-wrap gap-2 mt-3">
            <button type="button" class="btn btn-sm" onClick$={() => goTo(idx.value - 1)}>
              ←
            </button>
            <button
              type="button"
              class="btn btn-sm"
              disabled={!strokeCount.value}
              onClick$={() => rec.value?.undo()}
            >
              Отменить линию
            </button>
            <button
              type="button"
              class="btn btn-sm"
              disabled={!strokeCount.value}
              onClick$={() => rec.value?.clear()}
            >
              Очистить
            </button>
            <button
              type="button"
              class="btn btn-sm"
              disabled={!strokeCount.value}
              onClick$={() => rec.value?.replay(undefined, speed.value)}
            >
              ▶ Моё
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              disabled={!strokeCount.value || busy.value}
              onClick$={save}
            >
              {isSaved.value ? 'Сохранить заново' : 'Сохранить'}
            </button>
            <button type="button" class="btn btn-sm" onClick$={() => goTo(idx.value + 1)}>
              →
            </button>
          </div>

          {isSaved.value && (
            <div class="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                class="btn btn-sm btn-success"
                disabled={busy.value}
                onClick$={replaySaved}
              >
                ▶ Сохранённое
              </button>
              <button
                type="button"
                class="btn btn-sm btn-ghost text-error"
                disabled={busy.value}
                onClick$={removeSaved}
              >
                Удалить сохранённое
              </button>
            </div>
          )}

          {msg.value && <div class="mt-2 text-sm">{msg.value}</div>}

          {/* brush: only the look, the saved points are the same */}
          <div class="flex flex-wrap items-center gap-2 mt-4">
            <div class="join">
              {BRUSHES.map(({ id, name }) => (
                <button
                  key={id}
                  type="button"
                  class={['btn btn-sm join-item', id === brush.value ? 'btn-secondary' : '']}
                  onClick$={() => (brush.value = id)}
                >
                  {name}
                </button>
              ))}
            </div>
            {/* the stylus pressure as the browser gives it, to tune the sensitivity */}
            <span class="text-xs opacity-70">
              {pressure.value
                ? pressure.value.type === 'pen'
                  ? `нажим ${pressure.value.pressure.toFixed(
                      2,
                    )}, максимум в линии ${pressure.value.max.toFixed(
                      2,
                    )}, полная толщина с ${fullPressure(sensitivity.value).toFixed(2)}`
                  : `${pressure.value.type}: нажима нет, толщина по скорости`
                : 'нажим появится, когда начнёте писать'}
            </span>
          </div>

          {/* settings, kept in this browser */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-4 max-w-xl text-sm">
            <label>
              Размер поля: {size.value}px
              <input
                type="range"
                class="range range-xs"
                min={SIZE_MIN}
                max={SIZE_MAX}
                step={10}
                value={size.value}
                onInput$={(_, el) => (size.value = Number(el.value))}
              />
            </label>
            <label>
              Видимость образца: {Math.round(opacity.value * 100)}%
              <input
                type="range"
                class="range range-xs"
                min={0}
                max={0.6}
                step={0.01}
                value={opacity.value}
                onInput$={(_, el) => (opacity.value = Number(el.value))}
              />
            </label>
            <label>
              Толщина линии: {width.value}
              <input
                type="range"
                class="range range-xs"
                min={6}
                max={60}
                step={1}
                value={width.value}
                onInput$={(_, el) => (width.value = Number(el.value))}
              />
            </label>
            <label>
              Чувствительность нажима: {sensitivity.value}
              <input
                type="range"
                class="range range-xs"
                min={1}
                max={10}
                step={1}
                value={sensitivity.value}
                onInput$={(_, el) => (sensitivity.value = Number(el.value))}
              />
            </label>
            <label>
              Сглаживание дрожи: {smoothing.value}
              <input
                type="range"
                class="range range-xs"
                min={0}
                max={MAX_SMOOTHING}
                step={1}
                value={smoothing.value}
                onInput$={(_, el) => (smoothing.value = Number(el.value))}
              />
            </label>
            <label>
              Тонкое начало линии: {taperStart.value}
              <input
                type="range"
                class="range range-xs"
                min={0}
                max={MAX_TAPER}
                step={5}
                value={taperStart.value}
                onInput$={(_, el) => (taperStart.value = Number(el.value))}
              />
            </label>
            <label>
              Тонкий конец линии: {taperEnd.value}
              <input
                type="range"
                class="range range-xs"
                min={0}
                max={MAX_TAPER}
                step={5}
                value={taperEnd.value}
                onInput$={(_, el) => (taperEnd.value = Number(el.value))}
              />
            </label>
            <label>
              Скорость повтора
              <select
                class="select select-bordered select-xs ml-2"
                onChange$={(_, el) => (speed.value = Number(el.value))}
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s} selected={s === speed.value}>
                    {`×${s}`}
                  </option>
                ))}
              </select>
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-xs"
                checked={autoNext.value}
                onChange$={(_, el) => (autoNext.value = el.checked)}
              />
              После сохранения — следующий
            </label>
          </div>
          <p class="text-xs opacity-60 mt-3 max-w-xl">
            Сохраняется движение пера: каждая линия от касания до отрыва, точки с силой нажатия и
            временем. Кисть, толщина и чувствительность меняют только вид (они сохраняются рядом,
            чтобы анимация выглядела так же), сами точки те же. Чувствительность: чем выше, тем
            слабее нужно нажать для самой толстой линии. Тонкое начало и конец: на какой длине линия
            сужается (поле — 1000), независимо от нажима. Сглаживание убирает дрожь руки; при
            большом значении острые углы скругляются. Пока перо пишет и ещё 1,5 секунды после
            отрыва, пальцы и ладонь ничего не нажимают и не прокручивают; перо нажимает кнопки
            всегда.
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Пропись стилусом',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
};
