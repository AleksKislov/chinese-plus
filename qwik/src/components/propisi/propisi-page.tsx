import {
  $,
  component$,
  useComputed$,
  useSignal,
  useStore,
  useStyles$,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import HanziWriter from 'hanzi-writer';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs, type Crumb } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import { Sheet, type GlyphsMap, type StrokesMap } from './sheet';
import { useSheetData } from '~/misc/loaders/propisi-loaders';
import { getGlyphs } from '~/misc/actions/propisi/get-glyphs';
import {
  type FaqItem,
  type HskSheetVersion,
  type SheetDir,
  type SheetGrid,
  type SheetFont,
  type SheetOptions,
  HSK_SHEET_LEVELS,
  SHEET_FONTS,
  hasStrokes,
  MAX_CHARS,
  MAX_COLS,
  MIN_COLS,
  cellMm,
  hskLevelName,
  hskLevelTitle,
  hskSheetPath,
  hskVersionName,
  parseOptions,
  parseSource,
  partRange,
  sheetFileName,
  sheetTitle,
  sheetUrl,
} from './types';

// only the sheet goes to paper: A4 with 15 mm side margins leaves exactly its 180 mm
const PRINT_CSS = `
@media print {
  @page { size: A4 portrait; margin: 12mm 15mm; }
  body:has(#propisi-sheet) header,
  body:has(#propisi-sheet) footer { display: none !important; }
  body:has(#propisi-sheet) main,
  body:has(#propisi-sheet) main > section { min-height: 0 !important; }
  body:has(#propisi-sheet) .container { padding: 0 !important; margin: 0 !important; max-width: none !important; }
  #propisi-sheet { zoom: 1 !important; padding: 0 !important; }
}
`;

const GRIDS: { val: SheetGrid; text: string }[] = [
  { val: 'tian', text: '田字格' },
  { val: 'mi', text: '米字格' },
  { val: 'kou', text: 'Без линий' },
];

const DIRS: { val: SheetDir; text: string }[] = [
  { val: 'h', text: 'Горизонтально' },
  { val: 'v', text: 'Вертикально' },
];

// the size slider's left end is the smallest cell (most columns)
const sliderToCols = (val: string) => MIN_COLS + MAX_COLS - Number(val);

type PropisiPageProps = {
  seo: { h1: string; intro: string; crumbs: Crumb[] };
  faq: FaqItem[];
};

export const PropisiPage = component$(({ seo, faq }: PropisiPageProps) => {
  useStyles$(PRINT_CSS);
  const loc = useLocation();
  const nav = useNavigate();
  const data = useSheetData();

  const source = useComputed$(() => parseSource(loc.url.searchParams, loc.params));
  const opts = useStore<SheetOptions>(parseOptions(loc.url.searchParams));
  const strokes = useStore<StrokesMap>({});
  const glyphs = useStore<Partial<Record<SheetOptions['font'], GlyphsMap>>>({});

  const mode = useSignal(source.value.kind);
  const charsInput = useSignal(source.value.kind === 'chars' ? source.value.chars : '');
  const inputError = useSignal('');
  const hskVersion = useSignal<HskSheetVersion>(
    source.value.kind === 'hsk' ? source.value.version : '3',
  );
  const hskLevel = useSignal(source.value.kind === 'hsk' ? source.value.level : '1');
  const copied = useSignal(false);

  useTask$(({ track }) => {
    track(() => loc.url.href);
    Object.assign(opts, parseOptions(loc.url.searchParams));
    const src = parseSource(loc.url.searchParams, loc.params);
    mode.value = src.kind;
    if (src.kind === 'hsk') {
      hskVersion.value = src.version;
      hskLevel.value = src.level;
    }
  });

  // stroke data comes from the hanzi-writer CDN, not from our backend
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    async ({ track }) => {
      const chars = track(() => data.value.chars);
      await Promise.all(
        chars
          .filter(({ ch }) => strokes[ch] === undefined)
          .map(async ({ ch }) => {
            const charData = await HanziWriter.loadCharacterData(ch).catch(() => null);
            strokes[ch] = charData ? charData.strokes : null;
          }),
      );
    },
    { strategy: 'document-ready' },
  );

  // 行书 glyphs: only for the chosen font and only the sheet's chars (via the FE server).
  // useTask$, not useVisibleTask$: a server$ used only in browser-only code is never loaded on
  // the server ("Dynamic import not found"); a sheet opened with ?font= also renders at once.
  // In the browser the task doesn't wait for them: an async task holds back the re-render, so the
  // font picker froze until they came; glyphsLoading shows the wait instead
  useTask$(async ({ track }) => {
    const chars = track(() => data.value.chars);
    const font = track(() => opts.font);
    if (font === 'kai') return;
    // read back from the store: the stored object is a reactive proxy, the literal is not
    if (!glyphs[font]) glyphs[font] = {};
    const loaded = glyphs[font]!;
    const missing = chars.map(({ ch }) => ch).filter((ch) => loaded[ch] === undefined);
    if (!missing.length) return;
    const request = getGlyphs(font, missing.join(''))
      .catch(() => ({} as GlyphsMap))
      // a char without a glyph (or a failed request) is drawn as 楷书
      .then((res) => missing.forEach((ch) => (loaded[ch] = res[ch] ?? null)));
    if (isServer) await request;
  });

  const glyphsLoading = useComputed$(
    () =>
      opts.font !== 'kai' &&
      data.value.chars.some(({ ch }) => glyphs[opts.font]?.[ch] === undefined),
  );
  const strokesLoading = useComputed$(
    () => glyphsLoading.value || data.value.chars.some(({ ch }) => strokes[ch] === undefined),
  );

  // display options change the sheet in place and the shareable URL, without a new request
  const setOptions = $((patch: Partial<SheetOptions>) => {
    Object.assign(opts, patch);
    opts.trace = Math.min(opts.trace, opts.cols - 1);
    history.replaceState(history.state, '', sheetUrl(source.value, { ...opts }));
    copied.value = false;
  });

  const createFromChars = $(() => {
    const chars = charsInput.value.replace(/\s/g, '');
    if (!/\p{Script=Han}/u.test(chars)) {
      inputError.value = 'Введите хотя бы один китайский иероглиф';
      return;
    }
    inputError.value = '';
    nav(sheetUrl({ kind: 'chars', chars }, { ...opts }));
  });

  const print = $(() => {
    const pageTitle = document.title;
    document.title = sheetFileName(source.value, data.value.total, data.value.chars);
    window.addEventListener('afterprint', () => (document.title = pageTitle), { once: true });
    window.print();
  });

  const src = source.value;
  const parts = data.value.parts;
  const levels = HSK_SHEET_LEVELS[hskVersion.value];
  const partUrl = (part: number) => (src.kind === 'hsk' ? sheetUrl({ ...src, part }, opts) : '');

  return (
    <>
      <div class="print:hidden">
        <Breadcrumbs items={seo.crumbs} />
        <PageTitle txt={seo.h1} />
        <div class="prose max-w-none mb-4">
          <p>{seo.intro}</p>
        </div>

        <div class="card bg-base-200 mb-4">
          <div class="card-body gap-4">
            <div class="tabs tabs-boxed w-fit">
              <button
                class={`tab ${mode.value === 'chars' ? 'tab-active' : ''}`}
                onClick$={() => (mode.value = 'chars')}
              >
                Свои иероглифы
              </button>
              <button
                class={`tab ${mode.value === 'hsk' ? 'tab-active' : ''}`}
                onClick$={() => (mode.value = 'hsk')}
              >
                Иероглифы HSK
              </button>
            </div>

            {mode.value === 'chars' ? (
              <form preventdefault:submit onSubmit$={createFromChars} class="flex flex-col gap-2">
                <div class="flex flex-wrap gap-2">
                  <input
                    type="text"
                    class="input input-bordered w-full max-w-md text-xl"
                    placeholder="你好中国"
                    maxLength={MAX_CHARS * 2}
                    bind:value={charsInput}
                  />
                  <button type="submit" class="btn btn-primary">
                    Создать пропись
                  </button>
                </div>
                <span class={`text-sm ${inputError.value ? 'text-error' : 'opacity-70'}`}>
                  {inputError.value || `До ${MAX_CHARS} иероглифов, повторы убираются`}
                </span>
              </form>
            ) : (
              <div class="flex flex-col gap-3">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="btn-group">
                    {(['3', '2'] as HskSheetVersion[]).map((v) => (
                      <button
                        key={v}
                        class={`btn btn-sm ${hskVersion.value === v ? 'btn-active' : ''}`}
                        onClick$={() => {
                          hskVersion.value = v;
                          if (!HSK_SHEET_LEVELS[v].includes(hskLevel.value)) hskLevel.value = '1';
                        }}
                      >
                        {hskVersionName(v)}
                      </button>
                    ))}
                  </div>
                  <div class="btn-group">
                    {levels.map((level) => (
                      <button
                        key={level}
                        class={`btn btn-sm ${hskLevel.value === level ? 'btn-active' : ''}`}
                        onClick$={() => (hskLevel.value = level)}
                      >
                        {hskLevelName(level)}
                      </button>
                    ))}
                  </div>
                  <button
                    class="btn btn-primary btn-sm"
                    onClick$={() =>
                      nav(
                        sheetUrl(
                          {
                            kind: 'hsk',
                            version: hskVersion.value,
                            level: hskLevel.value,
                            part: 1,
                          },
                          { ...opts },
                        ),
                      )
                    }
                  >
                    Создать пропись
                  </button>
                </div>

                {src.kind === 'hsk' && parts.length > 1 && (
                  <div class="flex flex-wrap items-center gap-1 text-sm">
                    <span class="mr-1">{hskLevelTitle(src.version, src.level)} — листы:</span>
                    {parts.map((_, i) => (
                      <Link
                        key={i}
                        prefetch="js"
                        href={partUrl(i + 1)}
                        class={`btn btn-xs ${i + 1 === src.part ? 'btn-primary' : 'btn-ghost'}`}
                      >
                        {partRange(i + 1, data.value.total)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div class="divider my-0"></div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <label class="flex items-center gap-2">
                Шрифт
                <select
                  class="select select-bordered select-sm"
                  value={opts.font}
                  onChange$={(e) => {
                    const font = (e.target as HTMLSelectElement).value as SheetFont;
                    setOptions({ font });
                  }}
                >
                  {SHEET_FONTS.map(({ id, name }) => (
                    <option key={id} value={id} selected={opts.font === id}>
                      {name}
                    </option>
                  ))}
                </select>
                {glyphsLoading.value ? (
                  <span class="flex items-center gap-1 opacity-70">
                    <span class="loading loading-spinner loading-xs"></span>
                    Загружаем шрифт…
                  </span>
                ) : (
                  <span class="opacity-70">
                    {SHEET_FONTS.find(({ id }) => id === opts.font)?.hint}
                  </span>
                )}
              </label>
              <div class="btn-group">
                {DIRS.map(({ val, text }) => (
                  <button
                    key={val}
                    class={`btn btn-sm ${opts.dir === val ? 'btn-active' : ''}`}
                    onClick$={() => setOptions({ dir: val })}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <div class="btn-group">
                {GRIDS.map(({ val, text }) => (
                  <button
                    key={val}
                    class={`btn btn-sm ${opts.grid === val ? 'btn-active' : ''}`}
                    onClick$={() => setOptions({ grid: val })}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <label class="flex items-center gap-3">
                Размер
                <input
                  type="range"
                  class="range range-sm range-primary w-40"
                  min={MIN_COLS}
                  max={MAX_COLS}
                  value={MIN_COLS + MAX_COLS - opts.cols}
                  onInput$={(e) => {
                    opts.cols = sliderToCols((e.target as HTMLInputElement).value);
                    opts.trace = Math.min(opts.trace, opts.cols - 1);
                  }}
                  onChange$={(e) =>
                    setOptions({ cols: sliderToCols((e.target as HTMLInputElement).value) })
                  }
                />
                <span class="whitespace-nowrap">
                  {Number(cellMm(opts.cols).toFixed(1))} мм · {opts.cols} в ряду
                </span>
              </label>
              <label class="flex items-center gap-2">
                {opts.dir === 'v' ? 'Столбцов на иероглиф' : 'Строк на иероглиф'}
                <select
                  class="select select-bordered select-sm"
                  value={String(opts.rows)}
                  onChange$={(e) =>
                    setOptions({ rows: Number((e.target as HTMLSelectElement).value) })
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={String(n)} selected={opts.rows === n}>
                      {String(n)}
                    </option>
                  ))}
                </select>
              </label>
              <label class="flex items-center gap-2">
                Для обводки
                <select
                  class="select select-bordered select-sm"
                  value={String(opts.trace)}
                  onChange$={(e) =>
                    setOptions({ trace: Number((e.target as HTMLSelectElement).value) })
                  }
                >
                  {Array.from({ length: opts.cols }, (_, n) => n).map((n) => (
                    <option key={n} value={String(n)} selected={opts.trace === n}>
                      {String(n)}
                    </option>
                  ))}
                </select>
              </label>
              {(
                [
                  ['py', 'Пиньинь', true],
                  ['ru', 'Перевод', opts.dir === 'h'],
                  ['count', 'Кол-во черт', opts.dir === 'h' && hasStrokes(opts.font)],
                  ['order', 'Порядок черт', hasStrokes(opts.font)],
                ] as const
              )
                // vertical: only pinyin and stroke order; 行书: no stroke count and order
                .filter(([, , shown]) => shown)
                .map(([key, text]) => (
                  <label key={key} class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      class="checkbox checkbox-sm"
                      checked={opts[key]}
                      onChange$={(e) =>
                        setOptions({
                          [key]: (e.target as HTMLInputElement).checked,
                        } as Partial<SheetOptions>)
                      }
                    />
                    {text}
                  </label>
                ))}
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                class="btn btn-primary"
                disabled={strokesLoading.value || !data.value.chars.length}
                onClick$={print}
              >
                {strokesLoading.value && <span class="loading loading-spinner loading-sm"></span>}
                {glyphsLoading.value
                  ? 'Загружаем шрифт…'
                  : strokesLoading.value
                  ? 'Загружаем черты…'
                  : 'Скачать PDF / Распечатать'}
              </button>
              <button
                class="btn btn-outline"
                onClick$={async () => {
                  await navigator.clipboard.writeText(location.href);
                  copied.value = true;
                }}
              >
                {copied.value ? 'Ссылка скопирована' : 'Скопировать ссылку'}
              </button>
            </div>
            <p class="text-sm opacity-70">
              В окне печати выберите «Сохранить как PDF», формат A4 и масштаб 100%.
            </p>
          </div>
        </div>
      </div>

      {data.value.chars.length ? (
        <div class="relative">
          {/* until the 行书 glyphs come, the cells still show 楷书 */}
          {glyphsLoading.value && (
            <div class="absolute inset-0 z-10 flex justify-center pt-24 bg-base-100/50 print:hidden">
              <span class="flex items-center gap-2 h-fit px-4 py-2 rounded-lg bg-base-100 shadow">
                <span class="loading loading-spinner loading-md"></span>
                Загружаем шрифт…
              </span>
            </div>
          )}
          <Sheet
            chars={data.value.chars}
            strokes={strokes}
            glyphs={glyphs[opts.font] || {}}
            opts={opts}
            title={sheetTitle(src, data.value.total)}
          />
        </div>
      ) : (
        <div class="alert print:hidden">
          {src.kind === 'chars'
            ? 'В тексте нет китайских иероглифов — введите их в поле выше.'
            : 'Не удалось загрузить иероглифы этого уровня. Попробуйте обновить страницу.'}
        </div>
      )}

      {src.kind === 'hsk' && parts.length > 1 && (
        <div class="flex justify-between gap-2 mt-4 print:hidden">
          {src.part > 1 ? (
            <Link prefetch="js" href={partUrl(src.part - 1)} class="btn btn-outline btn-sm">
              ← Иероглифы {partRange(src.part - 1, data.value.total)}
            </Link>
          ) : (
            <span />
          )}
          {src.part < parts.length && (
            <Link prefetch="js" href={partUrl(src.part + 1)} class="btn btn-outline btn-sm">
              Иероглифы {partRange(src.part + 1, data.value.total)} →
            </Link>
          )}
        </div>
      )}

      <div class="prose max-w-none mt-8 print:hidden">
        {src.kind === 'hsk' && parts.length > 0 && (
          <>
            <h2>Все иероглифы {hskLevelTitle(src.version, src.level)}</h2>
            <ul>
              {parts.map((chars, i) => (
                <li key={i}>
                  <Link prefetch="js" href={partUrl(i + 1)}>
                    Лист {i + 1} ({partRange(i + 1, data.value.total)})
                  </Link>
                  : <span class="text-lg">{chars}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>Как пользоваться генератором прописей</h2>
        <ol>
          <li>Вставьте свои иероглифы или выберите версию и уровень HSK.</li>
          <li>
            Выберите шрифт — уставной 楷书 или один из трёх вариантов синшу ("бегущий стиль") ручкой
            硬笔行书, сетку (田字格, 米字格 или без линий) и размер клеток — от 1 до 6 см.
          </li>
          <li>
            Выберите направление: горизонтально — строки с пиньинем, переводом и порядком черт,
            вертикально — у каждого иероглифа свой столбец с образцом, пиньинем и порядком черт
            сбоку. Укажите, сколько строк или столбцов дать на каждый иероглиф и сколько серых
            знаков для обводки.
          </li>
          <li>
            Нажмите «Скачать PDF / Распечатать» и сохраните лист или отправьте его на принтер.
          </li>
        </ol>

        <h2>Готовые прописи HSK</h2>
        {(['3', '2'] as HskSheetVersion[]).map((version) => (
          <p key={version}>
            <b>{hskVersionName(version)}:</b>{' '}
            {HSK_SHEET_LEVELS[version].map((level, i) => (
              <span key={level}>
                {i > 0 && ' · '}
                <Link prefetch="js" href={hskSheetPath(version, level)}>
                  {version === '2' ? `HSK ${level}` : `уровень ${hskLevelName(level)}`}
                </Link>
              </span>
            ))}
          </p>
        ))}
        <p>
          Порядок черт в анимации — на странице{' '}
          <Link prefetch="js" href="/start/strokes">
            «Черты»
          </Link>
          , а слова уровней с переводом — в{' '}
          <Link prefetch="js" href="/hsk/3/table">
            таблице HSK 3.0
          </Link>
          .
        </p>

        <h2>Частые вопросы</h2>
        {faq.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />
    </>
  );
});
