import {
  $,
  component$,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  type DocumentHead,
  Link,
  type RequestEvent,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { EditWordModal } from '~/components/common/modals/edit-word-modal';
import { ShowHideBtn } from '~/components/common/modals/show-hide-btn';
import { EditWordBtn } from '~/components/common/tooltips/edit-word-btn';
import { OwnWordBtn } from '~/components/common/tooltips/own-word-btn';
import { ADD_WORD_PARAM, OwnWordRequest } from '~/components/common/tooltips/own-word-request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { loginUrl } from '~/misc/helpers/login-next';
import { editWordModalId } from '~/components/common/tooltips/word-tooltip';
import { DictWordTranslation } from '~/components/common/translation/dict-word-translation';
import { SearchResutlTable } from '~/components/search/search-result-table';
import { DictionarySearch } from '~/components/search/dictionary-search';
import { ApiService } from '~/misc/actions/request';
import { userContext } from '~/root';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';
import HanziWriter from 'hanzi-writer';
import { sheetUrl } from '~/components/propisi/types';
import { Sidebar } from '~/components/common/layout/sidebar';
import { SearchRuResult } from '~/components/search/search-ru-result';
import { getChineseWordsArr, HanziWriterSettings, type RuWord } from '~/routes/dictionary';
import {
  isChinese,
  isPinyin,
  isRussian,
  isValidWildcardPattern,
  isWildcardPattern,
} from '~/components/search/dictionary-query';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { Breadcrumbs, truncateCrumb } from '~/components/common/layout/breadcrumbs';
import { nameUrl } from '~/components/names/types';
import { capitalize, ruWordUrl } from '~/components/ru-words/types';
import { type HskLevels, HskLevelBadge } from '~/components/hsk/hsk-level-badge';
import {
  type DictTranslationResponse,
  translationToText,
} from '~/components/common/translation/types';
import { type ParsedWordTranslation } from '~/components/common/translation/dict-word-translation';

// ?add=1 ("add to my words" from the browser extension) needs a login first, then back here
export const onGet = async ({ cookie, redirect, url }: RequestEvent) => {
  if (url.searchParams.get(ADD_WORD_PARAM) === '1' && !getTokenFromCookie(cookie)) {
    throw redirect(302, loginUrl(url.pathname + url.search));
  }
};

export const useGetRuWord = routeLoader$(async ({ params }): Promise<RuWord | null> => {
  if (!isRussian(params.word)) return null;
  return ApiService.get('/api/ru-dictionary/' + params.word);
});

export const useGetWildcardWords = routeLoader$(async ({ params }): Promise<DictWord[] | null> => {
  if (!isWildcardPattern(params.word) || !isValidWildcardPattern(params.word)) return null;
  return ApiService.post('/api/dictionary/wildcardSearch', { pattern: params.word });
});

export const useGetPinyinWords = routeLoader$(async ({ params }): Promise<DictWord[] | null> => {
  if (!isPinyin(params.word)) return null;
  return ApiService.post('/api/dictionary/pinyinSearch', { pinyin: params.word });
});

export const useLoadTranslation = routeLoader$(
  async ({ params }): Promise<(string | DictWord)[] | null> => {
    if (isWildcardPattern(params.word) || !isChinese(params.word)) return null;
    const segmentedWords = await getChineseWordsArr(params.word);
    const wordsWithInfo = await getWordsForTooltips(segmentedWords);

    return segmentedWords.map((word) => {
      for (let i = 0; i < wordsWithInfo.length; i++) {
        const info = wordsWithInfo[i] as DictWord;
        if (info.chinese === word || info.tradChinese === word) {
          return info;
        }
      }
      return word;
    });
  },
);

const singleChinese = (word: string | DictWord) => (typeof word === 'string' ? word : word.chinese);

// full parsed translation of the found word, else the trimmed one it came with from the search
// (null: the DSL markup is rendered, the word is not migrated)
const wordParsed = (
  word: string | DictWord,
  loaded: DictTranslationResponse | null,
): ParsedWordTranslation | null => {
  if (typeof word === 'string') return null;
  if (loaded?.translation && loaded.translation.wordId === String(word._id)) {
    return { senses: loaded.translation.senses, examples: loaded.examples };
  }
  return word.senses?.length ? { senses: word.senses, examples: [] } : null;
};

// parsed translation + examples of a single found word (null: falls back to the DSL markup)
export const useGetParsedTranslation = routeLoader$(
  async ({ resolveValue }): Promise<DictTranslationResponse | null> => {
    const words = await resolveValue(useLoadTranslation);
    if (!words || words.length !== 1 || typeof words[0] === 'string') return null;
    return ApiService.get(
      `/api/dictionary/translation/${String(words[0]._id)}?examples=true`,
      undefined,
      null,
    );
  },
);

// pages on /na-kitayskom whose main word is the found one: 妈妈 -> "Мама на китайском"
export const useGetRuWordPages = routeLoader$(
  async ({ resolveValue }): Promise<{ slug: string; ru: string }[]> => {
    const words = await resolveValue(useLoadTranslation);
    if (!words || words.length !== 1 || typeof words[0] === 'string') return [];
    return ApiService.get(
      `/api/ru-words/by-cn/${encodeURIComponent(words[0].chinese)}`,
      undefined,
      [],
    );
  },
);

// HSK 3.0 levels of every chinese word the page shows (search result, wildcard and pinyin lists)
export const useGetHskLevels = routeLoader$(async ({ resolveValue }): Promise<HskLevels> => {
  const lists = await Promise.all([
    resolveValue(useLoadTranslation),
    resolveValue(useGetWildcardWords),
    resolveValue(useGetPinyinWords),
  ]);
  const chinese = lists.flatMap((list) => list || []).map(singleChinese);
  if (!chinese.length) return {};
  return ApiService.post('/api/newhskwords/levels', [...new Set(chinese)], undefined, {});
});

export default component$(() => {
  const CHAR_SVG_DIV_ID = 'showCharDiv';
  const loc = useLocation();
  const loadTranslation = useLoadTranslation();
  const ruWord = useGetRuWord();
  const wildcardWords = useGetWildcardWords();
  const pinyinWords = useGetPinyinWords();
  const hskLevels = useGetHskLevels();
  const parsedTranslation = useGetParsedTranslation();
  const ruWordPages = useGetRuWordPages();
  const words = useSignal<(string | DictWord)[] | null>(null);

  const { isAdmin, isModerator } = useContext(userContext);
  const canEditDictionary = isAdmin || isModerator;
  const showExamples = useSignal(true);

  // Chinese queries only (the loader skips Russian, pinyin and * patterns); long texts get no link
  const sheetChars = useComputed$(() => {
    const han = [...(loc.params.word || '')].filter((ch) => /\p{Script=Han}/u.test(ch));
    return loadTranslation.value && han.length <= 12 ? han.join('') : '';
  });

  useVisibleTask$(({ track }) => {
    track(() => loc.params.word);
    words.value = null;
    setTimeout(() => (words.value = loadTranslation.value));
  });

  const clearCharDiv = $(() => {
    const charDiv = document.getElementById(CHAR_SVG_DIV_ID);
    if (charDiv) charDiv!.innerHTML = '';
  });

  useVisibleTask$(({ track }) => {
    track(() => words.value);

    const chars = (words.value || [])
      .map((word) => {
        if (typeof word === 'string') return word;
        return [...word.chinese];
      })
      .flat();

    clearCharDiv();
    setTimeout(() => {
      chars.forEach((char) => {
        const writer = HanziWriter.create(CHAR_SVG_DIV_ID, char, HanziWriterSettings);
        writer.loopCharacterAnimation();
      });
    }, 100);
  });

  // undefined for a moment when navigating to another route (/dictionary/edit/…, /dictionary/add)
  const pageWord = loc.params.word || '';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: pageWord,
          inDefinedTermSet: `${CONST_URLS.siteUrl}/dictionary`,
          url: `${CONST_URLS.siteUrl}/dictionary/${encodeURIComponent(pageWord)}`,
        }}
      />
      <Breadcrumbs
        items={[{ name: 'Словарь', href: '/dictionary/' }, { name: truncateCrumb(pageWord) }]}
      />
      <PageTitle txt={'Китайско-русский словарь: ' + pageWord} />

      <FlexRow>
        <Sidebar noAds={true}></Sidebar>
        <Alerts />
        <MainContent>
          <div class="prose mb-3">
            <DictionarySearch value={pageWord} placeholder="汉字…">
              {canEditDictionary && (
                <Link
                  prefetch="js"
                  href="/dictionary/add"
                  class="link link-hover link-secondary text-sm w-fit"
                >
                  + Добавить слово в словарь
                </Link>
              )}
            </DictionarySearch>

            {loadTranslation.value && <OwnWordRequest words={loadTranslation.value} />}

            <div id={CHAR_SVG_DIV_ID} class="flex mt-3"></div>
            {sheetChars.value && (
              <Link
                prefetch="js"
                href={sheetUrl({ kind: 'chars', chars: sheetChars.value })}
                class="link link-hover link-secondary text-sm"
              >
                Распечатать пропись для {sheetChars.value} →
              </Link>
            )}
            <div>
              {words.value && !ruWord.value && words.value.length === 1 && (
                <>
                  <div class={'mt-3 flex justify-between'}>
                    <div class={'flex'}>
                      <OwnWordBtn word={words.value[0] as DictWord} />
                      <div class={'mx-1'}></div>
                      <EditWordBtn />
                      {hskLevels.value[singleChinese(words.value[0])] && (
                        <div class="ml-2 self-center">
                          <HskLevelBadge level={hskLevels.value[singleChinese(words.value[0])]} />
                        </div>
                      )}
                    </div>

                    <ShowHideBtn showExamples={showExamples} />
                  </div>
                  <DictWordTranslation
                    emptyText="перевод отсутствует или не найден :("
                    parsed={wordParsed(words.value[0], parsedTranslation.value)}
                    py={(words.value[0] as DictWord).pinyin}
                    tradChinese={
                      typeof words.value[0] !== 'string' &&
                      words.value[0].tradChinese &&
                      words.value[0].tradChinese !== words.value[0].chinese
                        ? words.value[0].tradChinese
                        : undefined
                    }
                    showExamples={showExamples.value}
                  />

                  {ruWordPages.value.map((p) => (
                    <Link
                      key={p.slug}
                      prefetch="js"
                      href={ruWordUrl(p.slug)}
                      class="btn btn-outline btn-primary btn-sm mt-3 mr-2"
                    >
                      {capitalize(p.ru)} на китайском: произношение, иероглифы, примеры →
                    </Link>
                  ))}

                  {canEditDictionary && (
                    <EditWordModal word={words.value[0] as DictWord} modalId={editWordModalId} />
                  )}
                </>
              )}

              {words.value && words.value.length > 1 && (
                <SearchResutlTable words={words.value || []} hskLevels={hskLevels.value} />
              )}

              {wildcardWords.value && wildcardWords.value.length > 0 && (
                <SearchResutlTable words={wildcardWords.value} hskLevels={hskLevels.value} />
              )}

              {wildcardWords.value && wildcardWords.value.length === 0 && (
                <div class="mt-3">Слов по шаблону не найдено</div>
              )}

              {pinyinWords.value && pinyinWords.value.length > 0 && (
                <SearchResutlTable words={pinyinWords.value} hskLevels={hskLevels.value} />
              )}

              {pinyinWords.value && pinyinWords.value.length === 0 && (
                <div class="mt-3">Слов с таким пиньинь не найдено</div>
              )}

              {ruWord.value && (
                <>
                  {ruWord.value.word?.ru && (
                    <div class={'mt-3 flex justify-between'}>
                      <div class={'flex'}>
                        <div class="font-bold text-xl text-success">{ruWord.value.word?.ru}</div>
                      </div>
                      <ShowHideBtn showExamples={showExamples} />
                    </div>
                  )}

                  <SearchRuResult ruWord={ruWord.value} showExamples={showExamples.value} />

                  {ruWord.value.nameSlug && (
                    <Link
                      prefetch="js"
                      href={nameUrl(ruWord.value.nameSlug)}
                      class="btn btn-outline btn-primary btn-sm mt-3"
                    >
                      Это имя: как пишется по-китайски, значение иероглифов →
                    </Link>
                  )}

                  {ruWord.value.wordSlug && (
                    <Link
                      prefetch="js"
                      href={ruWordUrl(ruWord.value.wordSlug)}
                      class="btn btn-outline btn-primary btn-sm mt-3 ml-2"
                    >
                      {capitalize(ruWord.value.word?.ru || pageWord)} на китайском: иероглифы,
                      произношение, примеры →
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </MainContent>
        <Sidebar>
          <div class="card card-compact bg-base-200 mt-3">
            <div class="card-body">
              <span class="text-sm">
                Поиск:
                <br />- традиционные и упрощённые иероглифы,
                <br />- пиньинь без тонов ("nihao"), <br />- шаблон со звездочкой "*" вместо
                неизвестного иероглифа, <br />- ручной ввод мышью или на тачпаде.
              </span>
            </div>
          </div>
        </Sidebar>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue, params }) => {
  const cnTranslation = resolveValue(useLoadTranslation);
  const parsedTranslation = resolveValue(useGetParsedTranslation);
  const ruWord = resolveValue(useGetRuWord);
  const word = params.word;
  const url = `${CONST_URLS.siteUrl}/dictionary/${encodeURIComponent(word)}/`;

  if (isWildcardPattern(word)) {
    const title = `Слова по шаблону ${word} — китайско-русский словарь | Chinese+`;
    const description = `Поиск китайских слов по шаблону "${word}" в китайско-русском словаре Chinese+.`;

    return {
      title,
      meta: [
        // One page per possible pattern - endless thin pages, keep them out of the index.
        { name: 'robots', content: 'noindex, follow' },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
      ],
    };
  }

  if (cnTranslation && cnTranslation.length === 1 && typeof cnTranslation[0] !== 'string') {
    const wordObj = cnTranslation[0];
    const hasTrad = wordObj.tradChinese && wordObj.tradChinese !== wordObj.chinese;
    const chineseLabel = hasTrad
      ? `${wordObj.chinese} (традиционное написание: ${wordObj.tradChinese})`
      : wordObj.chinese;
    const title = `${wordObj.chinese}${hasTrad ? ' / ' + wordObj.tradChinese : ''} (${
      wordObj.pinyin
    }) — перевод с китайского на русский | Chinese+`;
    const parsed = wordParsed(wordObj, parsedTranslation);
    const meaning = parsed ? translationToText(parsed.senses) : '';
    const description = `Значение китайского слова ${chineseLabel}: ${meaning}`.slice(0, 300);

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
      ],
    };
  }

  if (ruWord?.word) {
    const title = `${ruWord.word.ru} по-китайски — ${ruWord.word.cn}, перевод с русского на китайский | Chinese+`;
    const description = `Как будет "${ruWord.word.ru}" по-китайски: ${ruWord.word.cn}`;

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
      ],
    };
  }

  return {
    title: `${word} — китайско-русский словарь | Chinese+`,
    meta: [
      // Not a single dictionary entry (a phrase, pinyin search or unknown word): any
      // input makes its own URL here, so only real word pages get indexed.
      { name: 'robots', content: 'noindex, follow' },
      {
        name: 'description',
        content: `Перевод слова "${word}" в китайско-русском словаре Chinese+ с примерами и анимацией написания иероглифов.`,
      },
      { property: 'og:url', content: url },
    ],
  };
};
