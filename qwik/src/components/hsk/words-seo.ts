import { type DocumentHeadValue } from '@builder.io/qwik-city';
import CONSTANTS from '~/misc/consts/consts';
import CONST_URLS from '~/misc/consts/urls';
import { type Crumb } from '~/components/common/layout/breadcrumbs';
import { type HskVersion, VERSION_NAME, VERSION_SEGMENT, pluralRu } from './exams/levels';

// SEO for the HSK word list pages (/hsk/{2,3}/table, /tests, /search, /hsk/3/old-table).
// Levels there are ?lvl= params; the canonical keeps lvl (and pg) so every level
// is its own indexable page instead of all of them collapsing into level 1.

export type WordsPage = 'table' | 'tests' | 'search' | 'old-table';

// Level keys as the word APIs use them: HSK 3.0 levels 7-9 are "789".
export const WORD_LEVELS: Record<HskVersion, string[]> = {
  old: ['1', '2', '3', '4', '5', '6'],
  new: ['1', '2', '3', '4', '5', '6', '789'],
};

const { hskInfo } = CONSTANTS;
const sizeKey = (lvl: string) => (lvl === '789' ? '7-8-9' : lvl);

export const wordLevelLabel = (lvl: string) => (lvl === '789' ? '7–9' : lvl);

// Words introduced at this level (what the level's table actually lists).
const levelSize = (version: HskVersion, page: WordsPage, lvl: string): number | undefined => {
  if (version === 'old') return hskInfo.oldLevelSize[lvl as keyof typeof hskInfo.oldLevelSize];
  const sizes = page === 'old-table' ? hskInfo.bandSizeOld : hskInfo.bandSize;
  return sizes[sizeKey(lvl) as keyof typeof sizes];
};

export const getWordsLevel = (url: URL, version: HskVersion): string => {
  const lvl = url.searchParams.get('lvl') || '1';
  return WORD_LEVELS[version].includes(lvl) ? lvl : '1';
};

export const getWordsPage = (url: URL): number =>
  Math.max(0, +(url.searchParams.get('pg') || 0) || 0);

export const wordsPagePath = (version: HskVersion, page: WordsPage) =>
  `/hsk/${VERSION_SEGMENT[version]}/${page}/`;

// Level 1, first page is the bare path - the URL the menu and sitemap already use.
// Canonical URL of a level/page on any word list path. Also used for the level
// menu and pagination links, so internal links point at the canonical URL.
export const wordsLevelHref = (pathname: string, lvl = '1', pg = 0) => {
  const params = [lvl !== '1' || pg ? `lvl=${lvl}` : '', pg ? `pg=${pg}` : ''].filter(Boolean);
  return `${pathname}${params.length ? `?${params.join('&')}` : ''}`;
};

export const wordsPageUrl = (version: HskVersion, page: WordsPage, lvl = '1', pg = 0) =>
  wordsLevelHref(wordsPagePath(version, page), lvl, pg);

// How a level is named: plain "HSK 1" for the old standard (what people search
// for), "HSK 3.0 уровень 1" for the new one - same convention as the exam pages.
const levelTitle = (version: HskVersion, lvl: string) =>
  version === 'old' ? `HSK ${lvl}` : `HSK 3.0 уровень ${wordLevelLabel(lvl)}`;

type WordsSeoParams = { version: HskVersion; page: WordsPage; lvl?: string; pg?: number };

export const getWordsSeo = ({ version, page, lvl = '1', pg = 0 }: WordsSeoParams) => {
  const size = levelSize(version, page, lvl);
  const sizeText = size ? `${size} ${pluralRu(size, ['слово', 'слова', 'слов'])}` : 'слова';
  const pgSuffix = pg ? ` — стр. ${pg + 1}` : '';
  const vName = VERSION_NAME[version];
  const listCrumb: Crumb = { name: `Слова ${vName}`, href: wordsPagePath(version, 'table') };
  const levelCrumb: Crumb = { name: `Уровень ${wordLevelLabel(lvl)}` };

  const byPage = {
    table: {
      h1:
        version === 'old'
          ? `Слова HSK ${lvl} (HSK 2.0)`
          : `Слова HSK 3.0 — уровень ${wordLevelLabel(lvl)} (2026)`,
      title:
        version === 'old'
          ? `Слова HSK ${lvl} — ${sizeText} с переводом и озвучкой (HSK 2.0)${pgSuffix} | Chinese+`
          : `Слова HSK 3.0 уровень ${wordLevelLabel(
              lvl,
            )} — ${sizeText} с переводом и озвучкой${pgSuffix} | Chinese+`,
      description:
        version === 'old'
          ? `Список слов HSK ${lvl} (стандарт HSK 2.0): ${sizeText} уровня с пиньинем, переводом на русский и озвучкой. Скачайте CSV для Anki и добавляйте слова в личный словарик.`
          : `Новый список слов HSK 3.0 (редакция 2026), уровень ${wordLevelLabel(
              lvl,
            )}: ${sizeText} с пиньинем, переводом на русский и озвучкой. Можно скачать CSV для Anki.`,
      crumbs: [listCrumb, levelCrumb],
    },
    tests: {
      h1: `Тесты на слова ${levelTitle(version, lvl)}`,
      title: `Тесты на слова ${levelTitle(version, lvl)}${
        version === 'old' ? ' (HSK 2.0)' : ''
      } онлайн — иероглифы, пиньинь, аудио | Chinese+`,
      description: `Бесплатные тесты на лексику ${levelTitle(version, lvl)}${
        version === 'old' ? ' (HSK 2.0)' : ''
      }: узнайте иероглиф, пиньинь и слово на слух, напечатайте иероглифы на скорость.`,
      crumbs: [listCrumb, { name: 'Тесты', href: wordsPagePath(version, 'tests') }, levelCrumb],
    },
    search: {
      h1: `Поиск слов ${vName}`,
      title: `Поиск слов ${vName} — перевод, пиньинь и уровень слова | Chinese+`,
      description: `Найдите любое слово ${vName} по иероглифам, пиньиню или переводу и узнайте, к какому уровню оно относится.`,
      crumbs: [listCrumb, { name: 'Поиск' }],
    },
    'old-table': {
      h1: `Слова HSK 3.0 — старая редакция 2021, уровень ${wordLevelLabel(lvl)}`,
      title: `Старый список слов HSK 3.0 (2021), уровень ${wordLevelLabel(
        lvl,
      )} — ${sizeText}${pgSuffix} | Chinese+`,
      description: `Прежняя редакция списка слов HSK 3.0 (2021), уровень ${wordLevelLabel(
        lvl,
      )}: ${sizeText} с переводом и озвучкой. Актуальный список 2026 года — на странице «Слова HSK 3.0».`,
      crumbs: [
        listCrumb,
        { name: 'Редакция 2021', href: wordsPagePath(version, 'old-table') },
        levelCrumb,
      ],
    },
  }[page];

  const image =
    page === 'search' || page === 'old-table'
      ? `/img/og/hsk-words-${version}.png`
      : `/img/og/hsk-words-${version}-${lvl}.png`;

  return {
    ...byPage,
    canonical: `${CONST_URLS.siteUrl}${
      page === 'search' ? wordsPagePath(version, page) : wordsPageUrl(version, page, lvl, pg)
    }`,
    image: `${CONST_URLS.siteUrl}${image}`,
  };
};

export const wordsHead = (params: WordsSeoParams): DocumentHeadValue => {
  const { title, description, canonical, image } = getWordsSeo(params);
  return {
    title,
    // RouterHead skips its default (query-less) canonical when a page sets one.
    links: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  };
};
