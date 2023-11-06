import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
  type QwikMouseEvent,
} from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";
import { AlertColorEnum, alertsContext } from "~/root";
import { countZnChars, parseTags } from "~/misc/helpers/content";
import { FlexRow } from "../common/layout/flex-row";
import { Paragraph } from "../read/paragraph";
import { FontSizeBtns } from "../common/content-cards/content-page-card";
import { useNavigate } from "@builder.io/qwik-city";
import { type EditTextStore, useEditText } from "~/routes/(content)/edit/text/[id]";
import { useSegmentAndGetTooltips } from "~/routes/(content)/create/text";

type TextPreprocessFormProps = {
  store: EditTextStore;
};

export const EditTextPreprocessForm = component$(({ store }: TextPreprocessFormProps) => {
  const segmentAction = useSegmentAndGetTooltips();
  const editTextAction = useEditText();
  const canPublish = useSignal(false);
  const nav = useNavigate();

  const alertsState = useContext(alertsContext);
  const chineseText = useSignal(store.chineseTextParagraphs.join("\n\n"));
  const origTranslation = useSignal(store.translationParagraphs.join("\n\n"));
  const tooltipTxt = useSignal<(string | DictWord)[][] | string[]>([]);
  const currentWord = useSignal<DictWord | undefined>(undefined);

  useTask$(({ track }) => {
    track(() => chineseText.value.length);
    canPublish.value = false;
  });

  useTask$(({ track }) => {
    track(() => origTranslation.value.length);
    canPublish.value = false;
  });

  useTask$(({ track }) => {
    track(() => editTextAction.value);

    if (editTextAction.value?.status === "done") {
      // setTimeout(() => {
      nav(`/read/${store.isApproved ? "" : "unapproved-"}texts/${store.textId}`);
      // }, 3000);
    }
  });

  useTask$(({ track }) => {
    const val = track(() => segmentAction.value);
    if (!val) return;
    store.allwords = val.allwords;
    tooltipTxt.value = val.tooltipTxt;
    canPublish.value = true;
  });

  const preprocessForm = $(() => {
    const translationParagraphs = origTranslation.value
      .trim()
      .split("\n")
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    const trimmedChineseTxt = chineseText.value.trim().replace(/\n\s*\n/g, "\n");
    const chineseTextParagraphs = trimmedChineseTxt
      .split("\n")
      .map((parag) => parag.trim())
      .filter((parag) => Boolean(parag));

    if (translationParagraphs.length !== chineseTextParagraphs.length) {
      alertsState.push({
        bg: AlertColorEnum.error,
        text: `Кол-во параграфов в переводе должно совпадать с оригиналом`,
      });
      return;
    }

    origTranslation.value = translationParagraphs.join("\n\n");
    chineseText.value = chineseTextParagraphs.join("\n\n");

    store.length = countZnChars(chineseText.value);
    store.chineseTextParagraphs = chineseTextParagraphs;
    store.translationParagraphs = translationParagraphs;
    segmentAction.submit({ txt: trimmedChineseTxt });
  });

  const editText = $(async () => {
    const {
      textId,
      lvl,
      tags,
      title,
      length,
      source,
      picUrl,
      allwords,
      description,
      categoryInd,
      isApproved,
      audioSrc,
      chineseTextParagraphs,
      translationParagraphs,
      isLongText,
      curPage,
    } = store;

    editTextAction.submit({
      textId,
      length,
      source,
      level: lvl,
      description,
      categoryInd,
      pic_url: picUrl,
      tags: parseTags(tags),
      chinese_arr: allwords,
      title: title || "Default_title",
      origintext: chineseTextParagraphs,
      translation: translationParagraphs,
      audioSrc, // only for admin to change
      isApproved, // only for admin to change
      // for long texts
      isLongText,
      pageToEdit: curPage,
    });

    alertsState.push({
      bg: AlertColorEnum.info,
      text: "Спасибо! Пару секунд, и вы попадете на страницу отредактированного текста",
    });
  });

  const handleKeyDown = $((e: QwikMouseEvent<HTMLTextAreaElement, MouseEvent>) => {
    const trgt = e.target as HTMLTextAreaElement;
    trgt.style.height = trgt.scrollHeight + "px";
  });

  return (
    <>
      <FlexRow>
        <div class='w-full basis-1/2 mt-3 ml-7 mr-3'>
          <div class='form-control w-full'>
            <label class='label'>
              <span class='label-text'>Китайский текст</span>
            </label>
            <textarea
              onClick$={handleKeyDown}
              class='textarea textarea-bordered h-24'
              placeholder='汉字...'
              bind:value={chineseText}
            ></textarea>
            <label class='label'>
              {chineseText.value.length <= CONSTANTS.smTextLen && (
                <span
                  data-tip={"Длина обычного текста"}
                  class={`label-text-alt tooltip tooltip-info text-primary`}
                >{`${chineseText.value.length} / ${CONSTANTS.smTextLen}`}</span>
              )}
              <span
                data-tip={"Длина большого текста, не превышайте лимит"}
                class={`label-text-alt tooltip tooltip-info text-primary`}
              >{`${chineseText.value.length} / ${CONSTANTS.bgTextLen}`}</span>
            </label>
          </div>
        </div>
        <div class='w-full basis-1/2 mt-3 mr-7 ml-3'>
          <div class='form-control w-full'>
            <label class='label'>
              <span class='label-text'>Русский перевод</span>
            </label>
            <textarea
              onClick$={handleKeyDown}
              class='textarea textarea-bordered h-24'
              placeholder='Ваш перевод...'
              bind:value={origTranslation}
            ></textarea>
            <label class='label'>
              <span class='label-text-alt text-primary'>
                Кол-во параграфов должно совпадать с оригиналом
              </span>
            </label>
          </div>
        </div>
      </FlexRow>

      <FlexRow>
        <div class='mt-3 ml-7'>
          <button
            class='btn btn-primary w-48'
            disabled={Boolean(!(chineseText.value.length && origTranslation.value.length))}
            onClick$={preprocessForm}
          >
            Предобработать
          </button>
        </div>
      </FlexRow>

      <div class='mr-7 ml-7'>
        {tooltipTxt.value.length > 0 &&
          tooltipTxt.value.map((parag, i) => (
            <Paragraph
              key={i}
              ind={i}
              fontSize={FontSizeBtns.md}
              tooltipedParag={parag as (string | DictWord)[]}
              translation={store.translationParagraphs[i]}
              strLen={countZnChars(store.chineseTextParagraphs[i])}
              currentWord={currentWord}
              showTranslation={true}
              forEditing={true}
            />
          ))}
      </div>

      <FlexRow>
        <div class='mt-3 ml-7'>
          <button
            class='btn btn-primary w-48'
            disabled={!canPublish.value || editTextAction.isRunning}
            onClick$={editText}
          >
            Отредактировать
          </button>
        </div>
      </FlexRow>
    </>
  );
});
