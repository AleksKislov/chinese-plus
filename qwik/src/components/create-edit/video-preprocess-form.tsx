import { $, component$, useContext, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import CONSTANTS from '~/misc/consts/consts';
import { AlertColorEnum, alertsContext } from '~/root';
import { countZnChars, parseTags, parseTextWords } from '~/misc/helpers/content';
import { FlexRow } from '../common/layout/flex-row';
import {
  type NewVideoStore,
  usePublishVideo,
  useGetRuCaptions,
  useGetCnCaptions,
  useGetPyCaptions,
  type VideoSub,
  useGetTextPinyin,
} from '~/routes/(content)/create/video';
import { WordTooltip } from '../common/tooltips/word-tooltip';
import { Loader } from '../common/ui/loader';
import { ParagNum } from '../read/parag-num';
import { useEditVideo, type EditVideoStore } from '~/routes/(content)/edit/video/[id]';
import { useSegmentAndGetTooltips } from '~/routes/(content)/create/text';

type VideoPreprocessFormProps = {
  store: NewVideoStore;
  captionLangs: string[];
  tooltipSubs?: (DictWord | string)[][];
};

export const VideoPreprocessForm = component$(
  ({ store, captionLangs, tooltipSubs }: VideoPreprocessFormProps) => {
    const getTxtPinyin = useGetTextPinyin();
    const segmentAction = useSegmentAndGetTooltips();
    const getCnCaptions = useGetCnCaptions();
    const getPyCaptions = useGetPyCaptions();
    const getRuCaptions = useGetRuCaptions();
    const editVideoAction = useEditVideo();
    const publishVideoAction = usePublishVideo();
    const canPublish = useSignal(false);
    const nav = useNavigate();

    const alertsState = useContext(alertsContext);
    const chineseText = useSignal('');
    const pinyinText = useSignal('');
    const origTranslation = useSignal('');
    const currentWord = useSignal(null);
    const tooltipTxt = useSignal<(DictWord | string)[][]>([]);

    useTask$(({ track }) => {
      track(() => chineseText.value.length);
      track(() => origTranslation.value.length);
      track(() => pinyinText.value.length);

      canPublish.value = false;
    });

    useTask$(() => {
      if (tooltipSubs) {
        tooltipTxt.value = tooltipSubs;
        chineseText.value = store.chineseArr.join('');
        pinyinText.value = store.pySubs.join('\n');
        origTranslation.value = store.ruSubs.join('\n');
        setTimeout(() => (canPublish.value = true), 1000);
      }
    });

    useTask$(({ track }) => {
      track(() => publishVideoAction.value);

      if (publishVideoAction.value?._id) {
        setTimeout(() => {
          nav('/watch/unapproved-videos/' + publishVideoAction.value?._id);
        }, 3000);
      }
    });

    useTask$(({ track }) => {
      track(() => editVideoAction.value);

      if (editVideoAction.value?._id) {
        setTimeout(() => {
          nav(
            `/watch/${store.isApproved ? '' : 'unapproved-'}videos/${editVideoAction.value?._id}`,
          );
        }, 3000);
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getCnCaptions.value);
      if (getCnCaptions.value?.length) {
        const subs = getCnCaptions.value?.map?.((sub) => sub.text) || [];
        chineseText.value = subs.join('\n') || '';
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getPyCaptions.value);

      if (getPyCaptions.value?.length) {
        const subs = getPyCaptions.value?.map?.((sub) => sub.text) || [];
        pinyinText.value = subs.join('\n') || '';
      }
    });

    useVisibleTask$(({ track }) => {
      track(() => getRuCaptions.value);

      if (getRuCaptions.value?.length) {
        const subs = getRuCaptions.value?.map?.((sub) => sub.text) || [];
        origTranslation.value = subs.join('\n') || '';
      }
    });

    useVisibleTask$(({ track }) => {
      const serverPinyin = track(() => getTxtPinyin.value);

      if (serverPinyin?.length) {
        const subs = serverPinyin.map((strArr) => strArr.join(' '));
        pinyinText.value = subs.join('\n');
      }
    });

    const preprocessForm = $(async () => {
      const trimmedChineseTxt = chineseText.value.trim().replace(/\n\s*\n/g, '\n');
      const chineseTextParagraphs = trimmedChineseTxt
        .split('\n')
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
        .split('\n')
        .map((parag) => parag.trim())
        .filter((parag) => Boolean(parag));

      const pinyinParagraphs = pinyinText.value
        .trim()
        .split('\n')
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

      origTranslation.value = translationParagraphs.join('\n');
      chineseText.value = chineseTextParagraphs.join('\n');
      pinyinText.value = pinyinParagraphs.join('\n');

      store.length = countZnChars(chineseText.value);
      store.cnSubs = chineseTextParagraphs;
      store.ruSubs = translationParagraphs;
      store.pySubs = pinyinParagraphs;

      segmentAction.submit({ txt: trimmedChineseTxt });
    });

    useTask$(({ track }) => {
      const val = track(() => segmentAction.value);
      if (!val) return;
      store.chineseArr = val.allwords;
      tooltipTxt.value = val.tooltipTxt;
      canPublish.value = true;
    });

    const publishVideo = $(() => {
      const {
        lvl,
        desc,
        tags,
        title,
        length,
        source,
        category,
        chineseArr,
        isApproved,
        cnSubs,
        ruSubs,
        pySubs,
      } = store;

      const cnSubsWithTime = getCnCaptions.value?.map((x, i) => ({ ...x, text: cnSubs[i] }));
      const sprtr = '@@';
      const splitChineseArr = chineseArr
        .join(sprtr)
        .split('\n')
        .map((x) => x.split(sprtr).filter(Boolean));

      const newVideoData: any = {
        lvl,
        desc,
        title,
        length,
        source,
        cnSubs: cnSubsWithTime,
        ruSubs,
        pySubs,
        category,
        chineseArr: splitChineseArr,
        tags: parseTags(tags),
        isApproved,
      };

      publishVideoAction.submit(newVideoData);

      alertsState.push({
        bg: AlertColorEnum.info,
        text: 'Спасибо! Через 3 секунды вы попадете на страницу нового видео',
      });
    });

    const handleKeyDown = $((e: MouseEvent) => {
      const trgt = e.target as HTMLTextAreaElement;
      trgt.style.height = trgt.scrollHeight + 'px';
    });

    const blockClass = 'my-1 border border-info rounded-md p-2 relative';

    return (
      <>
        {/* select langs */}
        <FlexRow>
          <div class="w-full basis-4/12">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Китайские субтитры (с таймингом)</span>
              </label>
              <select
                class="select select-bordered w-full"
                onChange$={(e) =>
                  getCnCaptions.submit({
                    id: store.source,
                    lang: (e.target as HTMLInputElement).value,
                  })
                }
              >
                <option key={0} value={''} selected>
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
          <div class="w-full basis-3/12 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Пиньинь (с youtube)</span>
              </label>
              <select
                class="select select-bordered w-full"
                onChange$={(e) =>
                  getPyCaptions.submit({
                    id: store.source,
                    lang: (e.target as HTMLInputElement).value,
                  })
                }
              >
                <option key={0} value={''} selected>
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
          <div class="w-full basis-5/12">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Русские субтитры</span>
              </label>
              <select
                class="select select-bordered w-full"
                onChange$={(e) =>
                  getRuCaptions.submit({
                    id: store.source,
                    lang: (e.target as HTMLInputElement).value,
                  })
                }
              >
                <option key={0} value={''} selected>
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
          <div class="w-full basis-4/12">{getCnCaptions.isRunning && <Loader size={'sm'} />}</div>
          <div class="w-full basis-3/12 mx-3">
            <div class="tooltip tooltip-info" data-tip={'После предобработки'}>
              <button
                class="btn btn-primary btn-sm"
                onClick$={() => getTxtPinyin.submit({ chineseArr: store.chineseArr })}
              >
                Взять с сервера
              </button>
            </div>
            {(getPyCaptions.isRunning || getTxtPinyin.isRunning) && <Loader size={'sm'} />}
          </div>
          <div class="w-full basis-5/12">{getRuCaptions.isRunning && <Loader size={'sm'} />}</div>
        </FlexRow>

        {/* textareas */}
        <FlexRow>
          <div class="w-full basis-4/12 flex flex-row">
            <div class="-ml-1 mt-1 text-secondary">
              <div class="mb-5 mr-1">sec.</div>
              {getCnCaptions.isRunning && <Loader size={'sm'} />}
              {getCnCaptions.value?.map?.((sub: VideoSub) => (
                <p key={sub.start}>{sub.start}</p>
              ))}
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Китайский текст</span>
                {getCnCaptions.value && (
                  <span class="label-text text-info">
                    Кол-во строк: {getCnCaptions.value.length}
                  </span>
                )}
              </label>

              <textarea
                onClick$={handleKeyDown}
                class="textarea textarea-bordered h-24"
                placeholder="汉字..."
                bind:value={chineseText}
              ></textarea>
              <label class="label">
                <span class="label-text-alt text-primary">Кол-во строк должно совпадать</span>
                <span
                  data-tip={'Не превышайте лимит'}
                  class={`label-text-alt tooltip tooltip-info ${
                    chineseText.value.length > CONSTANTS.videoTextLen
                      ? 'text-error'
                      : 'text-primary'
                  }`}
                >{`${chineseText.value.length} / ${CONSTANTS.videoTextLen}`}</span>
              </label>
            </div>
          </div>

          <div class="w-full basis-3/12 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Пининь</span>
                {getPyCaptions.value && (
                  <span class="label-text text-info">
                    Кол-во строк: {getPyCaptions.value.length}
                  </span>
                )}
              </label>
              <textarea
                onClick$={handleKeyDown}
                class="textarea textarea-bordered h-24"
                placeholder="Пиньинь (если на ютюбе нет, то грузите с сервера после предобработки)"
                bind:value={pinyinText}
              ></textarea>
              <label class="label">
                <span class="label-text-alt text-primary">Кол-во строк должно совпадать</span>
              </label>
            </div>
          </div>

          <div class="w-full basis-5/12">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Перевод</span>
                {getRuCaptions.value && (
                  <span class="label-text text-info">
                    Кол-во строк: {getRuCaptions.value.length}
                  </span>
                )}
              </label>
              <textarea
                onClick$={handleKeyDown}
                class="textarea textarea-bordered h-24"
                placeholder="Ваш перевод..."
                bind:value={origTranslation}
              ></textarea>
              <label class="label">
                <span class="label-text-alt text-primary">Кол-во строк должно совпадать</span>
              </label>
            </div>
          </div>
        </FlexRow>

        {/* preprocess btn */}
        <FlexRow>
          <div class="mt-3 ml-7">
            <button
              class="btn btn-primary w-48"
              disabled={Boolean(!(chineseText.value.length && origTranslation.value.length))}
              onClick$={preprocessForm}
            >
              Предобработать
            </button>
          </div>
        </FlexRow>

        {/* preview */}
        <FlexRow>
          <div class="w-full basis-4/12">
            {tooltipTxt.value.length > 0 &&
              tooltipTxt.value.map((parag, i) => (
                <div class={blockClass} key={i}>
                  <ParagNum num={i + 1} />

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
          <div class="w-full basis-3/12 mx-3">
            {store.pySubs.length > 0 &&
              store.pySubs.map((parag, i) => (
                <div class={blockClass} key={i}>
                  <ParagNum num={i + 1} />
                  {parag}
                </div>
              ))}
          </div>
          <div class="w-full basis-5/12">
            {store.ruSubs.length > 0 &&
              store.ruSubs.map((parag, i) => (
                <div class={blockClass} key={i}>
                  <ParagNum num={i + 1} />
                  {parag}
                </div>
              ))}
          </div>
        </FlexRow>

        {/* publish */}
        <FlexRow>
          <div class="mt-3 ml-7">
            <button
              class="btn btn-primary w-48"
              disabled={!canPublish.value}
              onClick$={publishVideo}
            >
              Опубликовать
            </button>
          </div>
        </FlexRow>
      </>
    );
  },
);
