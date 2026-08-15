import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { useGetPics } from '~/routes/(content)/create/text';
import { FlexRow } from '../common/layout/flex-row';
import CONSTANTS from '~/misc/consts/consts';
import { arrorUturnDown } from '../common/media/svg';
import { TextThemePics } from './text-theme-pics';
import { alertsContext } from '~/root';
import { EditTextStore } from '~/routes/(content)/edit/text/[id]';
import { useUploadTextAudio } from '~/misc/actions/texts/upload-audio';
import { useDeleteTextAudio } from '~/misc/actions/texts/delete-audio';

type OtherTextFieldsProps = {
  store: EditTextStore;
  isAdmin: boolean;
  isModerator: boolean;
};

const MAX_AUDIO_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * @desc заголовок, уровень, описание, тэги, тема картинки, категория, источник
 */
export const EditTextFields = component$(({ store, isAdmin, isModerator }: OtherTextFieldsProps) => {
  const alertsState = useContext(alertsContext);
  const STARS_LVL = [1, 2, 3];
  const picTheme = useSignal('');
  const getPics = useGetPics();
  const picsRequestsLeft = useSignal(CONSTANTS.maxThemePicRequests);
  const uploadAudio = useUploadTextAudio();
  const deleteAudio = useDeleteTextAudio();
  const canModerate = isAdmin || isModerator;

  useTask$(({ track }) => {
    const res = track(() => uploadAudio.value);
    if (res?.status === 'done') store.audioSrc = 1;
  });

  useTask$(({ track }) => {
    const res = track(() => deleteAudio.value);
    if (res?.status === 'done') store.audioSrc = 0;
  });

  return (
    <div tabIndex={0} class={`collapse collapse-open border border-base-300 bg-base-200`}>
      <div class={`collapse-content mt-4`}>
        {canModerate && (
          <FlexRow>
            <div class="form-control">
              <div class="mx-4 label">Для админа/модератора:</div>
            </div>
            <div>
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text mr-2">Опубликован</span>
                  <input
                    type="checkbox"
                    checked={Boolean(store.isApproved)}
                    class="checkbox checkbox-primary"
                    onChange$={() => (store.isApproved = !store.isApproved ? 1 : 0)}
                  />
                </label>
              </div>
            </div>
            <div class="ml-3">
              <div class="form-control">
                {store.audioSrc ? (
                  <div class="flex items-center gap-2">
                    <span class="label-text">Аудио загружено</span>
                    {isAdmin && (
                      <button
                        type="button"
                        class="btn btn-xs btn-outline btn-error"
                        disabled={deleteAudio.isRunning}
                        onClick$={() => deleteAudio.submit({ textId: store.textId })}
                      >
                        удалить
                      </button>
                    )}
                  </div>
                ) : (
                  <label class="label cursor-pointer flex-col items-start">
                    <span class="label-text mb-1">Аудио (mp3, до 2МБ)</span>
                    <input
                      type="file"
                      accept="audio/mpeg,.mp3"
                      class="file-input file-input-bordered file-input-sm w-full"
                      disabled={uploadAudio.isRunning}
                      onChange$={(_, el) => {
                        const file = el.files?.[0];
                        if (!file) return;

                        if (!/^audio\/(mpeg|mp3)$/.test(file.type)) {
                          alertsState.push({ bg: 'alert-error', text: 'Только mp3 файлы' });
                          return;
                        }
                        if (file.size > MAX_AUDIO_SIZE) {
                          alertsState.push({ bg: 'alert-error', text: 'Файл не должен превышать 2МБ' });
                          return;
                        }

                        uploadAudio.submit({ audio: file, textId: store.textId });
                      }}
                    />
                    {uploadAudio.isRunning && (
                      <span class="loading loading-spinner loading-xs mt-1"></span>
                    )}
                  </label>
                )}
              </div>
            </div>
            <div class="ml-3">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text mr-2">Обновить дату публикации</span>
                  <input
                    type="checkbox"
                    checked={Boolean(store.updateDate)}
                    onChange$={() => (store.updateDate = !store.updateDate ? 1 : 0)}
                    class="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>
          </FlexRow>
        )}

        {/* заголовок и тэги */}
        <FlexRow>
          <div class="w-full basis-1/2 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Название текста</span>
              </label>
              <input
                type="text"
                placeholder="Заголовок"
                class="input input-bordered w-full"
                value={store.title}
                onChange$={(e) => (store.title = e.target.value)}
              />
            </div>
          </div>

          <div class="w-full basis-1/2 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Тэги через запятую</span>
              </label>
              <input
                type="text"
                placeholder="Тэги"
                class="input input-bordered w-full"
                value={store.tags}
                onChange$={(e) => (store.tags = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* уровень и описание */}
        <FlexRow>
          <div class="w-full basis-1/4 ml-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Уровень</span>
              </label>
              <div class="rating rating-lg">
                {STARS_LVL.map((lvl) => (
                  <input
                    key={lvl}
                    type="radio"
                    name="rating-7"
                    class="mask mask-star-2 bg-orange-400"
                    checked={store.lvl === lvl}
                    value={store.lvl}
                    onClick$={() => (store.lvl = lvl)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div class="w-full basis-3/4 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Краткое описание</span>
              </label>
              <input
                type="text"
                placeholder="О чем текст"
                class="input input-bordered w-full"
                value={store.description}
                onChange$={(e) => (store.description = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* картинка, категория и источник */}
        <FlexRow>
          <div class="w-full basis-1/4 ml-3 pr-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Тема картинки</span>
              </label>
              <div class="join">
                <input
                  type="text"
                  placeholder="An English word"
                  class="input input-bordered w-full join-item"
                  bind:value={picTheme}
                />
                <button
                  class="btn join-item btn-primary rounded-r"
                  disabled={picsRequestsLeft.value <= 0}
                  onClick$={() => {
                    const latinLettersRegex = /^[A-Za-z]*$/;

                    if (picTheme.value && latinLettersRegex.test(picTheme.value)) {
                      getPics.submit({ picTheme: picTheme.value });
                      picsRequestsLeft.value--;
                    } else {
                      alertsState.push({
                        bg: 'alert-error',
                        text: 'Тема картинки должна быть на английском',
                      });
                    }
                  }}
                >
                  {arrorUturnDown}
                  <span class="ml-1">{picsRequestsLeft.value}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="w-full basis-1/4 mr-3 pl-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Категория</span>
              </label>
              <select
                class="select select-bordered w-full"
                onChange$={(e) => (store.categoryInd = +e.target.value)}
              >
                {CONSTANTS.textCategories.map((category, ind) => (
                  <option key={ind} value={ind} selected={store.categoryInd === ind}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class="w-full basis-1/2 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Источник текста</span>
              </label>
              <input
                type="text"
                placeholder="Автор, книга, журнал, сайт..."
                class="input input-bordered w-full"
                value={store.source}
                onChange$={(e) => (store.source = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* выбор картинки */}
        {Array.isArray(getPics.value) && getPics.value.length > 0 && (
          <TextThemePics pics={getPics.value} store={store} />
        )}
      </div>
    </div>
  );
});
