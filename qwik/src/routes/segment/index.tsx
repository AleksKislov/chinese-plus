import { $, component$, useOnDocument, useSignal, useTask$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
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
import { SEGMENTER_ENUM, type SEGMENTER_VERSION } from '../search';

export default component$(() => {
  const segmentAction = useSegmentAndGetTooltips();
  const chineseText = useSignal('');
  const tooltipTxt = useSignal<(string | DictWord)[][] | string[]>([]);
  const currentWord = useSignal<DictWord | null>(null);
  const lengthIsOk = useSignal(true);
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
      <PageTitle txt={'Сегментация китайского текста'} />

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

            <div class="mb-3">
              <button
                class="btn btn-primary btn-sm"
                onClick$={preprocessForm}
                disabled={!lengthIsOk.value}
              >
                Сегментировать
              </button>
            </div>

            <div>
              {tooltipTxt.value.length > 0 &&
                tooltipTxt.value.map((tooltipedParag, ind) => (
                  <div class={`my-1 rounded-md p-2 relative bg-base-200 text-lg`} key={ind}>
                    {(tooltipedParag as DictWord[]).map((word, i) => (
                      <WordTooltip
                        key={i}
                        word={word}
                        currentWord={currentWord}
                        hasReddened={undefined}
                      />
                    ))}
                  </div>
                ))}
            </div>
          </div>

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
  return {
    title: `Chinese+ Сегментация китайского текста`,
    meta: [
      {
        name: 'description',
        content: `Инструмент сегментирует китайский текст на отдельные слова (перевод доступен по клику)`,
      },
    ],
  };
};
