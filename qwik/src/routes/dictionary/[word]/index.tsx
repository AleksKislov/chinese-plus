import {
  $,
  component$,
  useContext,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import {
  type DocumentHead,
  Link,
  routeLoader$,
  useLocation,
  useNavigate,
} from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { searchSvg } from '~/components/common/media/svg';
import { EditWordModal } from '~/components/common/modals/edit-word-modal';
import { ShowHideBtn } from '~/components/common/modals/show-hide-btn';
import { EditWordBtn } from '~/components/common/tooltips/edit-word-btn';
import { OwnWordBtn } from '~/components/common/tooltips/own-word-btn';
import { editWordModalId } from '~/components/common/tooltips/word-tooltip';
import { DictWordTranslation } from '~/components/common/translation/dict-word-translation';
import { SearchResutlTable } from '~/components/search/search-result-table';
import { ApiService } from '~/misc/actions/request';
import { alertsContext, userContext } from '~/root';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';
import HanziWriter from 'hanzi-writer';
import { stripRuMarkup } from '~/misc/helpers/translation';
import { Sidebar } from '~/components/common/layout/sidebar';
import { Loader } from '~/components/common/ui/loader';
import { SearchRuResult } from '~/components/search/search-ru-result';
import {
  getChineseWordsArr,
  HanziWriterSettings,
  isChinese,
  isPinyin,
  isRussian,
  isValidWildcardPattern,
  isWildcardPattern,
  WILDCARD_MAX_LENGTH,
  WILDCARD_CHAR,
  type RuWord,
} from '~/routes/dictionary';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';

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
        if ((wordsWithInfo[i] as DictWord).chinese === word) {
          return wordsWithInfo[i];
        }
      }
      return word;
    });
  },
);

export default component$(() => {
  const CHAR_SVG_DIV_ID = 'showCharDiv';
  const loc = useLocation();
  const nav = useNavigate();
  const loadTranslation = useLoadTranslation();
  const ruWord = useGetRuWord();
  const wildcardWords = useGetWildcardWords();
  const pinyinWords = useGetPinyinWords();
  const words = useSignal<(string | DictWord)[] | null>(null);
  const input = useSignal(loc.params.word || '');

  const alertsState = useContext(alertsContext);
  const { isAdmin } = useContext(userContext);
  const showExamples = useSignal(true);

  useVisibleTask$(({ track }) => {
    const word = track(() => loc.params.word);
    input.value = word || '';
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

  const getTranslation = $(() => {
    clearCharDiv();

    let inputStr = input.value.trim();
    if (!inputStr) return (input.value = '');

    if (isRussian(inputStr)) {
      inputStr = inputStr.toLowerCase();
      input.value = inputStr;
    }

    if (isWildcardPattern(inputStr)) {
      if (!isValidWildcardPattern(inputStr)) {
        alertsState.push({
          bg: 'alert-error',
          text: `Шаблон должен содержать от 1 до ${WILDCARD_MAX_LENGTH} китайских иероглифов, "${WILDCARD_CHAR}" заменяет один неизвестный символ`,
        });
        return;
      }
      nav('/dictionary/' + encodeURIComponent(inputStr));
    } else if (isChinese(inputStr) || isRussian(inputStr) || isPinyin(inputStr)) {
      nav('/dictionary/' + encodeURIComponent(inputStr));
    } else {
      alertsState.push({
        bg: 'alert-error',
        text: 'Поиск только по китайским, русским словам или пиньинь',
      });
    }
  });

  useOnDocument(
    'keydown',
    $((e) => {
      if ((e as KeyboardEvent).key === 'Enter') getTranslation();
    }),
  );

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: loc.params.word,
          inDefinedTermSet: `${CONST_URLS.siteUrl}/dictionary`,
          url: `${CONST_URLS.siteUrl}/dictionary/${encodeURIComponent(loc.params.word)}`,
        }}
      />
      <PageTitle txt={'Китайско-русский словарь: ' + loc.params.word} />

      <FlexRow>
        <Sidebar>
          <div class="card card-compact bg-base-200">
            <div class="card-body">
              <span>
                База слов взята с{' '}
                <Link
                  class="link link-hover link-secondary font-bold"
                  href={'https://bkrs.info/'}
                  target="_blank"
                >
                  БКРС
                </Link>
              </span>
            </div>
          </div>
        </Sidebar>
        <Alerts />
        <MainContent>
          <div class="prose">
            <div class="form-control">
              <div class="input-group w-full">
                <input
                  type="text"
                  placeholder="汉字…"
                  class="input input-bordered w-full"
                  value={input.value}
                  onInput$={(e) => (input.value = (e.target as HTMLInputElement)?.value || '')}
                />
                <button class="btn btn-square" onClick$={getTranslation} disabled={loc.isNavigating}>
                  {loc.isNavigating ? <Loader size="sm" /> : searchSvg}
                </button>
              </div>
              <span class="text-sm opacity-60 mt-1">
                Не знаете все иероглифы? Используйте "{WILDCARD_CHAR}" вместо неизвестного, например
                "爱{WILDCARD_CHAR}" (до {WILDCARD_MAX_LENGTH} символов)
              </span>
            </div>

            <div id={CHAR_SVG_DIV_ID} class="flex mt-3"></div>
            <div>
              {words.value && !ruWord.value && words.value.length === 1 && (
                <>
                  <div class={'mt-3 flex justify-between'}>
                    <div class={'flex'}>
                      <OwnWordBtn word={words.value[0] as DictWord} />
                      <div class={'mx-1'}></div>
                      <EditWordBtn />
                    </div>

                    <ShowHideBtn showExamples={showExamples} />
                  </div>
                  <DictWordTranslation
                    ru={
                      typeof words.value[0] === 'string'
                        ? 'перевод отсутствует или не найден :('
                        : words.value[0].russian
                    }
                    py={(words.value[0] as DictWord).pinyin}
                    showExamples={showExamples.value}
                  />

                  {isAdmin && (
                    <EditWordModal word={words.value[0] as DictWord} modalId={editWordModalId} />
                  )}
                </>
              )}

              {words.value && words.value.length > 1 && (
                <SearchResutlTable words={words.value || []} />
              )}

              {wildcardWords.value && wildcardWords.value.length > 0 && (
                <SearchResutlTable words={wildcardWords.value} />
              )}

              {wildcardWords.value && wildcardWords.value.length === 0 && (
                <div class="mt-3">Слов по шаблону не найдено</div>
              )}

              {pinyinWords.value && pinyinWords.value.length > 0 && (
                <SearchResutlTable words={pinyinWords.value} />
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
                </>
              )}
            </div>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue, params }) => {
  const cnTranslation = resolveValue(useLoadTranslation);
  const ruWord = resolveValue(useGetRuWord);
  const word = params.word;
  const url = `${CONST_URLS.siteUrl}/dictionary/${encodeURIComponent(word)}`;

  if (isWildcardPattern(word)) {
    const title = `Chinese+ поиск по шаблону ${word}`;
    const description = `Поиск китайских слов по шаблону "${word}" в китайско-русском словаре Chinese+.`;

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

  if (cnTranslation && cnTranslation.length === 1 && typeof cnTranslation[0] !== 'string') {
    const wordObj = cnTranslation[0];
    const title = `Chinese+ ${wordObj.chinese} (${wordObj.pinyin}) — перевод с китайского на русский`;
    const description = `Значение китайского слова ${wordObj.chinese}: ${stripRuMarkup(
      wordObj.russian,
    )}`.slice(0, 300);

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
    const title = `Chinese+ ${ruWord.word.ru} — перевод с русского на китайский (${ruWord.word.cn})`;
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
    title: `Chinese+ ${word} — китайско-русский словарь`,
    meta: [
      {
        name: 'description',
        content: `Перевод слова "${word}" в китайско-русском словаре Chinese+ с примерами и анимацией написания иероглифов.`,
      },
      { property: 'og:url', content: url },
    ],
  };
};
