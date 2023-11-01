import { component$, useContext, useSignal } from "@builder.io/qwik";
import { useGetPics, type NewTextStore } from "~/routes/(content)/create/text";
import { FlexRow } from "../common/layout/flex-row";
import CONSTANTS from "~/misc/consts/consts";
import { arrorUturnDown } from "../common/media/svg";
import { TextThemePics } from "./text-theme-pics";
import { alertsContext } from "~/root";

type OtherTextFieldsProps = {
  store: NewTextStore;
};

/**
 * @desc заголовок, уровень, описание, тэги, тема картинки, категория, источник
 */
export const OtherTextFields = component$(({ store }: OtherTextFieldsProps) => {
  const alertsState = useContext(alertsContext);
  const STARS_LVL = [1, 2, 3];
  const picTheme = useSignal("");
  const getPics = useGetPics();
  const alreadyGotPics = useSignal(false);

  return (
    <div
      tabIndex={0}
      class={`collapse collapse-arrow border border-base-300 bg-base-200 text-base-content`}
    >
      <input type='checkbox' />
      <div class='collapse-title text-xl px-7'>
        Нужен только текст и перевод. Клик здесь, чтобы заполнить остальные необязательные поля
      </div>

      <div class={`collapse-content`}>
        {/* заголовок и тэги */}
        <FlexRow>
          <div class='w-full basis-1/2 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Название текста</span>
              </label>
              <input
                type='text'
                placeholder='Заголовок'
                class='input input-bordered w-full'
                value={store.title}
                onChange$={(e) => (store.title = e.target.value)}
              />
            </div>
          </div>

          <div class='w-full basis-1/2 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Тэги через запятую</span>
              </label>
              <input
                type='text'
                placeholder='Тэги'
                class='input input-bordered w-full'
                value={store.tags}
                onChange$={(e) => (store.tags = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* уровень и описание */}
        <FlexRow>
          <div class='w-full basis-1/4 ml-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Уровень</span>
              </label>
              <div class='rating rating-lg'>
                {STARS_LVL.map((lvl) => (
                  <input
                    key={lvl}
                    type='radio'
                    name='rating-7'
                    class='mask mask-star-2 bg-orange-400'
                    checked={store.lvl === lvl}
                    onClick$={() => (store.lvl = lvl)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div class='w-full basis-3/4 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Краткое описание</span>
              </label>
              <input
                type='text'
                placeholder='О чем текст'
                class='input input-bordered w-full'
                value={store.description}
                onChange$={(e) => (store.description = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* картинка, категория и источник */}
        <FlexRow>
          <div class='w-full basis-1/4 ml-3 pr-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Тема картинки</span>
              </label>
              <div class='join'>
                <input
                  type='text'
                  placeholder='An English word'
                  class='input input-bordered w-full join-item'
                  bind:value={picTheme}
                />
                <button
                  class='btn join-item btn-primary rounded-r'
                  disabled={alreadyGotPics.value}
                  onClick$={() => {
                    const latinLettersRegex = /^[A-Za-z]*$/;

                    if (picTheme.value && latinLettersRegex.test(picTheme.value)) {
                      getPics.submit({ picTheme: picTheme.value });
                      alreadyGotPics.value = true;
                    } else {
                      alertsState.push({
                        bg: "alert-error",
                        text: "Тема картинки должна быть на английском",
                      });
                    }
                  }}
                >
                  {arrorUturnDown}
                </button>
              </div>
            </div>
          </div>
          <div class='w-full basis-1/4 mr-3 pl-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Категория</span>
              </label>
              <select
                class='select select-bordered w-full'
                onChange$={(e) => (store.categoryInd = +e.target.value)}
              >
                {CONSTANTS.textCategories.map((category, ind) => (
                  <option key={ind} value={ind}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class='w-full basis-1/2 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Источник текста</span>
              </label>
              <input
                type='text'
                placeholder='Автор, книга, журнал, сайт...'
                class='input input-bordered w-full'
                value={store.source}
                onChange$={(e) => (store.source = e.target.value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* картинки */}
        {Array.isArray(getPics.value) && getPics.value.length > 0 && (
          <TextThemePics pics={getPics.value} store={store} />
        )}
      </div>
    </div>
  );
});
