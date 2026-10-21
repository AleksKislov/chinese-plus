import { $, component$, useOnDocument, useSignal, useTask$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Sidebar } from '~/components/common/layout/sidebar';
import CONSTANTS from '~/misc/consts/consts';
import { useSegmentAndGetTooltips } from '../(content)/create/text';
import {
  WordTooltip,
  editWordModalId,
  moreInfoModalId,
} from '~/components/common/tooltips/word-tooltip';
import { EditWordModal } from '~/components/common/modals/edit-word-modal';
import { MoreInfoModal } from '~/components/common/modals/more-info-modal';
import { SEGMENTER_ENUM, type SEGMENTER_VERSION } from '../dictionary';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';

const segmentOgImage = '/img/og/segment.png';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Что такое сегментация китайского текста?',
    a: 'В китайском тексте нет пробелов между словами, поэтому начинающим трудно понять, где заканчивается одно слово и начинается другое. Сегментатор разбивает текст на слова по словарю Chinese+, и каждое слово можно перевести отдельно.',
  },
  {
    q: 'Как показать пиньинь над иероглифами?',
    a: 'Вставьте текст, нажмите «Сегментировать», а затем кнопку «pinyin»: над каждым словом появится его чтение. Если у слова в словаре несколько чтений, показывается первое.',
  },
  {
    q: 'Как узнать перевод слова?',
    a: 'Нажмите на слово в разобранном тексте: откроется подсказка с пиньинем и переводом на русский. Зарегистрированные пользователи могут сразу добавить слово в свой список для повторения.',
  },
  {
    q: 'Чем отличаются версии сегментатора?',
    a: 'Версии v1 и v2 ищут самые длинные сочетания иероглифов, которые есть в словаре (то есть могут выделить целое словосочетание); v1 идёт с начала текста, v2 — с конца. Версия v3 строже и обычно делит текст на отдельные слова.',
  },
  {
    q: 'Что делать, если текст разбит неправильно?',
    a: 'Поставьте пробелы между иероглифами там, где должна проходить граница слов, и нажмите «Сегментировать» ещё раз — сегментатор учтёт ваши пробелы. Также можно попробовать другую версию сегментатора.',
  },
];

export default component$(() => {
  const segmentAction = useSegmentAndGetTooltips();
  const chineseText = useSignal('');
  const tooltipTxt = useSignal<(string | DictWord)[][] | string[]>([]);
  const currentWord = useSignal<DictWord | null>(null);
  const lengthIsOk = useSignal(true);
  const showPinyin = useSignal(false);
  const segmentVersionSignal = useSignal<SEGMENTER_VERSION>('v1');

  const segmentVersions = [
    SEGMENTER_ENUM.v1,
    SEGMENTER_ENUM.v2,
    SEGMENTER_ENUM.v3,
  ] as SEGMENTER_VERSION[];
  useOnDocument(
    'keydown',
    $((e) => {
      if ((e as KeyboardEvent).key === 'Enter') preprocessForm();
    }),
  );

  useTask$(({ track }) => {
    const len = track(() => chineseText.value.length);
    lengthIsOk.value = len <= CONSTANTS.smTextLen;
  });

  useTask$(({ track }) => {
    const val = track(() => segmentAction.value);
    if (!val) return;
    tooltipTxt.value = val.tooltipTxt;
  });

  const preprocessForm = $(() => {
    const trimmedChineseTxt = chineseText.value.trim().replace(/\n\s*\n/g, '\n');

    if (!trimmedChineseTxt) return null;
    const chineseTextParagraphs = trimmedChineseTxt
      .split('\n')
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    chineseText.value = chineseTextParagraphs.join('\n\n');
    segmentAction.submit({ txt: trimmedChineseTxt, version: segmentVersionSignal.value });
  });

  return (
    <>
      <Breadcrumbs items={[{ name: 'Сегментатор' }]} />
      <PageTitle txt={'Сегментация китайского текста онлайн'} />
      <div class="prose max-w-none mb-3">
        <p>
          Вставьте китайский текст — сегментатор разобьёт его на слова, покажет пиньинь над
          иероглифами и перевод каждого слова по клику. Подходит, чтобы разобрать фразу из учебника,
          сообщение от друга или отрывок статьи. Готовые тексты с переводом и озвучкой есть в
          разделе{' '}
          <Link prefetch="js" href="/read/texts/">
            «Тексты»
          </Link>
          , а все слоги с произношением — в{' '}
          <Link prefetch="js" href="/start/pinyin-chart/">
            таблице пиньиня
          </Link>
          .
        </p>
      </div>

      <FlexRow>
        <Sidebar>
          <div class="card bg-base-200">
            <div class="card-body">
              Инструмент сегментирует китайский текст на отдельные слова (перевод доступен по
              клику). <br />
              Используйте пробелы между иероглифами, чтобы сегментация сработала так, как нужно вам.
            </div>
          </div>

          <div class="card bg-base-200 mt-3">
            <div class="card-body">
              <h2 class="card-title">Версии сегментатора</h2>
              <p>
                1-я и 2-я версии ищут наиболее длинные сочетания иероглифов (т. е. словосочетания
                тоже) по нашему словарю.
                <br />
                2-я версия осуществляет поиск с конца текста.
                <br />
                3-я версия - более строгая, как правило делит на отдельные слова.
              </p>
              <div class="btn-group ml-1">
                {segmentVersions.map((txt, ind) => (
                  <button
                    key={ind}
                    class={`btn btn-sm btn-outline btn-info ${
                      txt === segmentVersionSignal.value ? 'btn-active' : ''
                    }`}
                    onClick$={() => {
                      segmentVersionSignal.value = txt;
                    }}
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Sidebar>
        <MainContent>
          <div class="prose">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Вставьте китайский текст</span>
              </label>
              <textarea
                onClick$={() => {}}
                class="textarea textarea-bordered h-24"
                placeholder="汉字..."
                bind:value={chineseText}
              ></textarea>
              <label class="label">
                <span
                  class={`label-text-alt ${lengthIsOk.value ? 'text-primary' : 'text-error'}`}
                >{`${chineseText.value.length} / ${CONSTANTS.smTextLen}`}</span>
              </label>
            </div>

            <div class="mb-3 flex justify-between">
              <button
                class="btn btn-primary btn-sm"
                onClick$={preprocessForm}
                disabled={!lengthIsOk.value}
              >
                Сегментировать
              </button>
              {tooltipTxt.value.length > 0 && (
                <button
                  class={`btn btn-sm btn-outline btn-info ${showPinyin.value ? 'btn-active' : ''}`}
                  onClick$={() => (showPinyin.value = !showPinyin.value)}
                >
                  pinyin
                </button>
              )}
            </div>

            <div>
              {tooltipTxt.value.length > 0 &&
                tooltipTxt.value.map((tooltipedParag, ind) => (
                  <div
                    class={`my-1 rounded-md p-2 relative bg-base-200 text-lg ${
                      showPinyin.value ? 'leading-[2.2]' : ''
                    }`}
                    key={ind}
                  >
                    {(tooltipedParag as DictWord[]).map((word, i) => (
                      <WordTooltip
                        key={i}
                        word={word}
                        currentWord={currentWord}
                        hasReddened={undefined}
                        showPinyin={showPinyin.value}
                      />
                    ))}
                  </div>
                ))}
            </div>
          </div>

          <div class="prose max-w-none mt-8">
            <h2>Как пользоваться сегментатором</h2>
            <ol>
              <li>Вставьте китайский текст в поле (до {CONSTANTS.smTextLen} символов).</li>
              <li>Выберите версию сегментатора и нажмите «Сегментировать».</li>
              <li>Включите «pinyin», чтобы увидеть чтение над иероглифами.</li>
              <li>Нажмите на любое слово, чтобы посмотреть перевод.</li>
            </ol>

            <h2>Частые вопросы</h2>
            {FAQ.map(({ q, a }) => (
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
              mainEntity: FAQ.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            }}
          />

          {!currentWord.value ? null : (
            <div>
              <EditWordModal word={currentWord.value} modalId={editWordModalId} />
              <MoreInfoModal
                word={{
                  _id: currentWord.value._id,
                  cn: currentWord.value.chinese,
                  py: currentWord.value.pinyin,
                  ru: currentWord.value.russian,
                  lvl: 'unknown',
                  id: 0,
                }}
                modalId={moreInfoModalId}
              />
            </div>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = () => {
  const title =
    'Сегментация китайского текста онлайн — разбить на слова, пиньинь и перевод | Chinese+';
  const description =
    'Бесплатный сегментатор китайского текста: разбивает иероглифы на слова, показывает пиньинь над иероглифами и перевод каждого слова по клику. Вставьте текст и читайте с подсказками.';
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${segmentOgImage}` },
    ],
  };
};
