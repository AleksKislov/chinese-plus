import {
  $,
  component$,
  useContext,
  useSignal,
  useTask$,
  type QwikMouseEvent,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import CONSTANTS from "~/misc/consts/consts";
import { AlertColorEnum, alertsContext } from "~/root";
import { countZnChars, parseTags, parseTextWords } from "~/misc/helpers/content";
import { FlexRow } from "../common/layout/flex-row";
import { segmenter } from "~/routes/search";
import { getWordsForTooltips } from "~/routes/read/texts/[id]";
import {
  type NewVideoStore,
  usePublishVideo,
  useGetRuCaptions,
  useGetCnCaptions,
  useGetPyCaptions,
  type VideoSub,
} from "~/routes/(content)/create/video";
import { WordTooltip } from "../common/tooltips/word-tooltip";

type VideoPreprocessFormProps = {
  store: NewVideoStore;
  captionLangs: string[];
};

export const VideoPreprocessForm = component$(
  ({ store, captionLangs }: VideoPreprocessFormProps) => {
    const getCnCaptions = useGetCnCaptions();
    const getPyCaptions = useGetPyCaptions();
    const getRuCaptions = useGetRuCaptions();
    const publishVideoAction = usePublishVideo();
    const canPublish = useSignal(false);
    const nav = useNavigate();

    const alertsState = useContext(alertsContext);
    const chineseText = useSignal("");
    const pinyinText = useSignal("");
    const origTranslation = useSignal("");
    const currentWord = useSignal(undefined);
    const tooltipTxt = useSignal<(DictWord | string)[][]>([]);

    useTask$(({ track }) => {
      track(() => chineseText.value.length);
      track(() => origTranslation.value.length);
      track(() => pinyinText.value.length);

      canPublish.value = false;
    });

    useTask$(({ track }) => {
      track(() => publishVideoAction.value);

      if (publishVideoAction.value?._id) {
        setTimeout(() => {
          nav("/watch/unapproved-videos/" + publishVideoAction.value?._id);
        }, 3000);
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getCnCaptions.value);

      if (getCnCaptions.value?.length) {
        const subs = getCnCaptions.value?.map?.((sub) => sub.text) || [];
        chineseText.value = subs.join("\n") || "";
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getPyCaptions.value);

      if (getPyCaptions.value?.length) {
        const subs = getPyCaptions.value?.map?.((sub) => sub.text) || [];
        pinyinText.value = subs.join("\n") || "";
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getRuCaptions.value);

      if (getRuCaptions.value?.length) {
        const subs = getRuCaptions.value?.map?.((sub) => sub.text) || [];
        origTranslation.value = subs.join("\n") || "";
      }
    });

    const preprocessForm = $(async () => {
      const trimmedChineseTxt = chineseText.value.trim().replace(/\n\s*\n/g, "\n");
      const chineseTextParagraphs = trimmedChineseTxt
        .split("\n")
        .map((parag) => parag.trim())
        .filter((parag) => Boolean(parag));

      if (chineseText.value.length > CONSTANTS.videoTextLen) {
        alertsState.push({
          bg: AlertColorEnum.error,
          text: `Слишком большой текст`,
        });
        return;
      }
      const translationParagraphs = origTranslation.value
        .trim()
        .split("\n")
        .map((parag) => parag.trim())
        .filter((parag) => Boolean(parag));

      const pinyinParagraphs = pinyinText.value
        .trim()
        .split("\n")
        .map((parag) => parag.trim())
        .filter((parag) => Boolean(parag));

      if (
        translationParagraphs.length !== chineseTextParagraphs.length ||
        pinyinParagraphs.length !== chineseTextParagraphs.length
      ) {
        alertsState.push({
          bg: AlertColorEnum.error,
          text: `Кол-во строк должно совпадать`,
        });
        return;
      }

      origTranslation.value = translationParagraphs.join("\n");
      chineseText.value = chineseTextParagraphs.join("\n");
      pinyinText.value = pinyinParagraphs.join("\n");

      const chineseArr = (await segmenter(trimmedChineseTxt)).filter((word) => word !== " ");
      tooltipTxt.value = parseTextWords(chineseArr, await getWordsForTooltips(chineseArr));

      store.length = countZnChars(chineseText.value);
      store.cnSubs = chineseTextParagraphs;
      store.ruSubs = translationParagraphs;
      store.pySubs = pinyinParagraphs;
      store.chineseArr = chineseArr;

      canPublish.value = true;
    });

    const publishVideo = $(async () => {
      const {
        lvl,
        desc,
        tags,
        title,
        length,
        source,
        category,
        chineseArr,
        cnSubs,
        ruSubs,
        pySubs,
      } = store;

      await publishVideoAction.submit({
        lvl,
        desc,
        title,
        length,
        source,
        cnSubs,
        ruSubs,
        pySubs,
        category,
        chineseArr,
        tags: parseTags(tags),
      });

      alertsState.push({
        bg: AlertColorEnum.info,
        text: "Спасибо! Через 3 секунды вы попадете на страницу нового видео",
      });
    });

    const handleKeyDown = $((e: QwikMouseEvent<HTMLTextAreaElement, MouseEvent>) => {
      const trgt = e.target as HTMLTextAreaElement;
      trgt.style.height = trgt.scrollHeight + "px";
    });

    const blockClass = "my-1 border border-info rounded-md p-2 relative";

    return (
      <>
        {/* select langs */}
        <FlexRow>
          <div class='w-full basis-4/12'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Китайские субтитры (с таймингом)</span>
              </label>
              <select
                class='select select-bordered w-full'
                onChange$={(e) => getCnCaptions.submit({ id: store.source, lang: e.target.value })}
              >
                <option key={0} value={""} selected>
                  Язык субтитров
                </option>
                {captionLangs.map((lang, ind) => (
                  <option key={ind + 1} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class='w-full basis-3/12 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Пиньинь</span>
              </label>
              <select
                class='select select-bordered w-full'
                onChange$={(e) => getPyCaptions.submit({ id: store.source, lang: e.target.value })}
              >
                <option key={0} value={""} selected>
                  Язык субтитров
                </option>
                {captionLangs.map((lang, ind) => (
                  <option key={ind + 1} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class='w-full basis-5/12'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Русские субтитры</span>
              </label>
              <select
                class='select select-bordered w-full'
                onChange$={(e) => getRuCaptions.submit({ id: store.source, lang: e.target.value })}
              >
                <option key={0} value={""} selected>
                  Язык субтитров
                </option>
                {captionLangs.map((lang, ind) => (
                  <option key={ind + 1} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FlexRow>

        {/* loading and pinyin source select */}
        <FlexRow>
          <div class='w-full basis-4/12'>
            {getCnCaptions.isRunning && <span class='loading loading-spinner loading-sm'></span>}
          </div>
          <div class='w-full basis-3/12 mx-3'>
            <div class='join mr-2'>
              <input
                class='join-item btn btn-xs normal-case'
                type='radio'
                name='options'
                aria-label='backend'
                checked
              />
              <input
                class='join-item btn btn-xs normal-case'
                type='radio'
                name='options'
                aria-label='youtube'
              />
            </div>
            {getPyCaptions.isRunning && <span class='loading loading-spinner loading-sm'></span>}
          </div>
          <div class='w-full basis-5/12'>
            {getRuCaptions.isRunning && <span class='loading loading-spinner loading-sm'></span>}
          </div>
        </FlexRow>

        {/* textareas */}
        <FlexRow>
          <div class='w-full basis-4/12 flex flex-row'>
            <div class='-ml-1 mt-1 text-secondary'>
              <div class='mb-5 mr-1'>sec.</div>
              {getCnCaptions.isRunning && <span class='loading loading-spinner loading-sm'></span>}
              {getCnCaptions.value?.map?.((sub: VideoSub) => (
                <p key={sub.start}>{sub.start}</p>
              ))}
            </div>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Китайский текст</span>
                {getCnCaptions.value && (
                  <span class='label-text text-info'>
                    Кол-во строк: {getCnCaptions.value.length}
                  </span>
                )}
              </label>

              <textarea
                onClick$={handleKeyDown}
                class='textarea textarea-bordered h-24'
                placeholder='汉字...'
                bind:value={chineseText}
              ></textarea>
              <label class='label'>
                <span class='label-text-alt text-primary'>Кол-во строк должно совпадать</span>
                <span
                  data-tip={"Не превышайте лимит"}
                  class={`label-text-alt tooltip tooltip-info ${
                    chineseText.value.length > CONSTANTS.videoTextLen
                      ? "text-error"
                      : "text-primary"
                  }`}
                >{`${chineseText.value.length} / ${CONSTANTS.videoTextLen}`}</span>
              </label>
            </div>
          </div>

          <div class='w-full basis-3/12 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Пининь</span>
                {getPyCaptions.value && (
                  <span class='label-text text-info'>
                    Кол-во строк: {getPyCaptions.value.length}
                  </span>
                )}
              </label>
              <textarea
                onClick$={handleKeyDown}
                class='textarea textarea-bordered h-24'
                placeholder='Пиньинь'
                bind:value={pinyinText}
              ></textarea>
              <label class='label'>
                <span class='label-text-alt text-primary'>Кол-во строк должно совпадать</span>
              </label>
            </div>
          </div>

          <div class='w-full basis-5/12'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Перевод</span>
                {getRuCaptions.value && (
                  <span class='label-text text-info'>
                    Кол-во строк: {getRuCaptions.value.length}
                  </span>
                )}
              </label>
              <textarea
                onClick$={handleKeyDown}
                class='textarea textarea-bordered h-24'
                placeholder='Ваш перевод...'
                bind:value={origTranslation}
              ></textarea>
              <label class='label'>
                <span class='label-text-alt text-primary'>Кол-во строк должно совпадать</span>
              </label>
            </div>
          </div>
        </FlexRow>

        {/* preprocess */}
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

        {/* preview */}
        <FlexRow>
          <div class='w-full basis-4/12'>
            {tooltipTxt.value.length > 0 &&
              tooltipTxt.value.map((parag, i) => (
                <div class={blockClass} key={i}>
                  {parag.map((word, ind) => (
                    <WordTooltip
                      key={ind}
                      word={word}
                      currentWord={currentWord}
                      hasReddened={undefined}
                    />
                  ))}
                </div>
              ))}
          </div>
          <div class='w-full basis-3/12 mx-3'>
            {store.pySubs.length > 0 &&
              store.pySubs.map((parag, i) => (
                <div class={blockClass} key={i}>
                  {parag}
                </div>
              ))}
          </div>
          <div class='w-full basis-5/12'>
            {store.ruSubs.length > 0 &&
              store.ruSubs.map((parag, i) => (
                <div class={blockClass} key={i}>
                  {parag}
                </div>
              ))}
          </div>
        </FlexRow>

        {/* publish */}
        <FlexRow>
          <div class='mt-3 ml-7'>
            <button
              class='btn btn-primary w-48'
              disabled={!canPublish.value}
              onClick$={publishVideo}
            >
              Опубликовать
            </button>
          </div>
        </FlexRow>
      </>
    );
  }
);
