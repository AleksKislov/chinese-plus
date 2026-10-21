// Прописи (writing sheets): characters come from api/writing-sheets, stroke data from hanzi-writer
import { type Crumb } from '~/components/common/layout/breadcrumbs';
import { pluralRu } from '~/components/hsk/exams/levels';

export type SheetChar = { ch: string; py: string; ru: string };

export type SheetGrid = 'tian' | 'mi' | 'kou';
export type SheetSize = 'xs' | 's' | 'm' | 'l';
export type HskSheetVersion = '3' | '2';

export type SheetOptions = {
  grid: SheetGrid;
  size: SheetSize;
  rows: number; // practice rows per character
  trace: number; // grey copies to trace after the model in the first row
  py: boolean;
  ru: boolean;
  order: boolean; // stroke order row
};

// what to print: typed characters (/propisi/), or a part of an HSK level's new characters
export type SheetSource =
  | { kind: 'chars'; chars: string }
  | { kind: 'hsk'; version: HskSheetVersion; level: string; part: number };

// parts: every sheet of an HSK level as a string of its characters
export type SheetData = { chars: SheetChar[]; total: number; parts: string[] };

export type FaqItem = { q: string; a: string };

export const propisiUrl = '/propisi/';
export const propisiOgImage = '/img/og/propisi.png';

export const DEFAULT_CHARS = '永你好中国';
export const MAX_CHARS = 60;
export const PART_SIZE = 20;

export const HSK_SHEET_LEVELS: Record<HskSheetVersion, string[]> = {
  3: ['1', '2', '3', '4', '5', '6', '789'],
  2: ['1', '2', '3', '4', '5', '6'],
};
export const hskVersionName = (v: HskSheetVersion) => (v === '3' ? 'HSK 3.0' : 'HSK 2.0');
export const hskLevelName = (level: string) => (level === '789' ? '7–9' : level);

// same naming as the word lists: plain "HSK 1" for the old standard (what people search for)
export const hskLevelTitle = (v: HskSheetVersion, level: string) =>
  v === '2' ? `HSK ${level} (HSK 2.0)` : `HSK 3.0 уровень ${hskLevelName(level)}`;

export const hskSheetPath = (v: HskSheetVersion, level: string) => `/propisi/hsk-${v}/${level}/`;

// A4 minus 15 mm side margins: 180 mm fits 18 / 15 / 12 / 9 cells
export const SHEET_WIDTH_MM = 180;
export const SHEET_PADDING_MM = 6;
export const CELL_MM: Record<SheetSize, number> = { xs: 10, s: 12, m: 15, l: 20 };
export const ORDER_CELL_MM = 8;
export const cellsPerRow = (size: SheetSize) => Math.floor(SHEET_WIDTH_MM / CELL_MM[size]);

export const DEFAULT_OPTIONS: SheetOptions = {
  grid: 'tian',
  size: 'm',
  rows: 2,
  trace: 3,
  py: true,
  ru: true,
  order: true,
};

const pick = <T extends string>(val: string | null | undefined, allowed: readonly T[], def: T): T =>
  allowed.includes(val as T) ? (val as T) : def;

const intIn = (val: string | null, min: number, max: number, def: number) => {
  const num = Number(val);
  return val !== null && Number.isInteger(num) && num >= min && num <= max ? num : def;
};

// route params of /propisi/[version]/[level]/: 'hsk-3', '789'
export const parseHskParams = (params: Record<string, string>) => {
  const version = params.version?.replace(/^hsk-/, '');
  if (version !== '3' && version !== '2') return null;
  if (!HSK_SHEET_LEVELS[version].includes(params.level)) return null;
  return { version: version as HskSheetVersion, level: params.level };
};

export const parseSource = (
  search: URLSearchParams,
  params: Record<string, string>,
): SheetSource => {
  const hsk = parseHskParams(params);
  if (hsk) return { kind: 'hsk', ...hsk, part: intIn(search.get('part'), 1, 1000, 1) };
  return { kind: 'chars', chars: (search.get('chars') || DEFAULT_CHARS).slice(0, MAX_CHARS * 2) };
};

export const parseOptions = (params: URLSearchParams): SheetOptions => {
  const size = pick(params.get('size'), ['xs', 's', 'm', 'l'] as const, DEFAULT_OPTIONS.size);
  return {
    grid: pick(params.get('grid'), ['tian', 'mi', 'kou'] as const, DEFAULT_OPTIONS.grid),
    size,
    rows: intIn(params.get('rows'), 1, 8, DEFAULT_OPTIONS.rows),
    trace: intIn(params.get('trace'), 0, cellsPerRow(size) - 1, DEFAULT_OPTIONS.trace),
    py: params.get('py') !== '0',
    ru: params.get('ru') !== '0',
    order: params.get('order') !== '0',
  };
};

// only non-default options go to the URL, so shared links stay short
export const sheetUrl = (source: SheetSource, opts: SheetOptions = DEFAULT_OPTIONS) => {
  const params = new URLSearchParams();
  if (source.kind === 'hsk' && source.part > 1) params.set('part', String(source.part));
  if (source.kind === 'chars' && source.chars !== DEFAULT_CHARS) params.set('chars', source.chars);

  (Object.keys(DEFAULT_OPTIONS) as (keyof SheetOptions)[]).forEach((key) => {
    const val = opts[key];
    if (val === DEFAULT_OPTIONS[key]) return;
    params.set(key, typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
  });

  const path = source.kind === 'hsk' ? hskSheetPath(source.version, source.level) : propisiUrl;
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const partRange = (part: number, total: number) =>
  `${(part - 1) * PART_SIZE + 1}–${Math.min(part * PART_SIZE, total)}`;

export const sheetTitle = (source: SheetSource, total: number) =>
  source.kind === 'chars'
    ? 'Прописи китайских иероглифов'
    : `Прописи ${hskLevelTitle(source.version, source.level)}: иероглифы ${partRange(
        source.part,
        total,
      )} из ${total}`;

// the browser suggests the page title as the name of a PDF saved from the print dialog
export const sheetFileName = (source: SheetSource, total: number, chars: SheetChar[]) =>
  source.kind === 'chars'
    ? `Прописи ${chars
        .slice(0, 10)
        .map((x) => x.ch)
        .join('')}`
    : `Прописи ${hskLevelTitle(source.version, source.level)} — ${partRange(source.part, total)}`;

export const charsCount = (n: number) =>
  `${n} ${pluralRu(n, ['иероглиф', 'иероглифа', 'иероглифов'])}`;

export const hubSeo = {
  h1: 'Прописи китайских иероглифов',
  title: 'Прописи китайских иероглифов — распечатать или скачать PDF | Chinese+',
  description:
    'Бесплатный генератор прописей для китайских иероглифов: сетка 田字格 или 米字格, порядок черт, пиньинь и перевод. Свои иероглифы или списки HSK 1–6 — скачайте PDF и распечатайте.',
  intro:
    'Генератор прописей для китайских иероглифов: клетки 田字格 или 米字格, порядок черт, пиньинь и перевод. Вставьте свои иероглифы или выберите уровень HSK, настройте лист и сохраните его в PDF или сразу распечатайте. Бесплатно и без регистрации.',
  crumbs: [{ name: 'Прописи иероглифов' }] as Crumb[],
};

export const levelSeo = (v: HskSheetVersion, level: string, total: number) => {
  const name = hskLevelTitle(v, level);
  const count = total ? charsCount(total) : 'иероглифы';
  const parts = Math.ceil(total / PART_SIZE);
  return {
    h1: `Прописи ${name}`,
    title: `Прописи ${name} — ${count}, распечатать PDF | Chinese+`,
    description: `Прописи для иероглифов ${name}: ${count} уровня в клетках 田字格 с порядком черт, пиньинем и переводом. Листы по ${PART_SIZE} иероглифов — распечатайте или сохраните в PDF.`,
    intro: `Прописи для всех иероглифов, которые впервые встречаются в словах ${name}: ${count}, по ${PART_SIZE} на листе. У каждого иероглифа — порядок черт, пиньинь, перевод, образец и серые знаки для обводки. Выберите лист, настройте сетку и распечатайте или сохраните в PDF.`,
    crumbs: [
      { name: 'Прописи иероглифов', href: propisiUrl },
      {
        name: `${hskVersionName(v)}, ${level === '789' ? 'уровни 7–9' : `уровень ${level}`}`,
      },
    ] as Crumb[],
    faq: [
      {
        q: `Сколько иероглифов в ${name}?`,
        a: `В словах ${name} впервые встречается ${count}${
          level === '1' ? '' : ' — сверх иероглифов предыдущих уровней'
        }. Здесь они разбиты на ${parts} ${pluralRu(parts, [
          'лист',
          'листа',
          'листов',
        ])} по ${PART_SIZE} иероглифов в порядке официального списка слов.`,
      },
      {
        q: `Как распечатать прописи ${name}?`,
        a: 'Выберите лист с нужными иероглифами, настройте сетку и количество строк, нажмите «Скачать PDF / Распечатать». В окне печати выберите принтер или «Сохранить как PDF», формат A4, масштаб 100%.',
      },
    ] as FaqItem[],
  };
};
