import { $, component$, useOnDocument, useSignal, useTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { Sidebar } from "~/components/common/layout/sidebar";
import CONSTANTS from "~/misc/consts/consts";
import { useSegmentAndGetTooltips } from "../(content)/create/text";
import {
  WordTooltip,
  editWordModalId,
  moreInfoModalId,
} from "~/components/common/tooltips/word-tooltip";
import { EditWordModal } from "~/components/common/modals/edit-word-modal";
import { MoreInfoModal } from "~/components/common/modals/more-info-modal";

export default component$(() => {
  const segmentAction = useSegmentAndGetTooltips();
  const chineseText = useSignal("");
  const tooltipTxt = useSignal<(string | DictWord)[][] | string[]>([]);
  const currentWord = useSignal<DictWord | undefined>(undefined);
  const lengthIsOk = useSignal(true);

  useOnDocument(
    "keydown",
    $((e) => {
      if ((e as KeyboardEvent).key === "Enter") preprocessForm();
    })
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
    const trimmedChineseTxt = chineseText.value.trim().replace(/\n\s*\n/g, "\n");

    if (!trimmedChineseTxt) return null;
    const chineseTextParagraphs = trimmedChineseTxt
      .split("\n")
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    chineseText.value = chineseTextParagraphs.join("\n\n");
    segmentAction.submit({ txt: trimmedChineseTxt });
  });

  return (
    <>
      <PageTitle txt={"Сегментация китайского текста"} />

      <FlexRow>
        <Sidebar>
          <div class='card bg-base-200'>
            <div class='card-body'>
              Инструмент сегментирует китайский текст на отдельные слова (перевод доступен по
              клику). <br />
              Используйте пробелы между иероглифами, чтобы сегментация сработала так, как нужно вам.
            </div>
          </div>
        </Sidebar>
        <MainContent>
          <div class='prose'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Вставьте китайский текст</span>
              </label>
              <textarea
                onClick$={() => {}}
                class='textarea textarea-bordered h-24'
                placeholder='汉字...'
                bind:value={chineseText}
              ></textarea>
              <label class='label'>
                <span
                  class={`label-text-alt ${lengthIsOk.value ? "text-primary" : "text-error"}`}
                >{`${chineseText.value.length} / ${CONSTANTS.smTextLen}`}</span>
              </label>
            </div>

            <div>
              <button
                class='btn btn-primary btn-sm'
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
                  lvl: "unknown",
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
        name: "description",
        content: `Инструмент сегментирует китайский текст на отдельные слова (перевод доступен по клику)`,
      },
    ],
  };
};
