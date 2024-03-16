import { component$ } from "@builder.io/qwik";
import { FlexRow } from "../common/layout/flex-row";
import CONSTANTS from "~/misc/consts/consts";
import { type NewVideoStore } from "~/routes/(content)/create/video";
import { type EditVideoStore } from "~/routes/(content)/edit/video/[id]";

type OtherVideoFieldsProps = {
  store: NewVideoStore | EditVideoStore;
  isAdmin: boolean;
};

export const OtherVideoFields = component$(({ store, isAdmin }: OtherVideoFieldsProps) => {
  const STARS_LVL = [1, 2, 3];

  return (
    <div tabIndex={0} class={`collapse collapse-arrow border border-base-300 bg-base-200`}>
      <input type='checkbox' />
      <div class='collapse-title text-xl px-7'>Необязательные поля</div>

      <div class={`collapse-content`}>
        {isAdmin && (
          <FlexRow>
            <div class='form-control'>
              <div class='mx-4 label'>Для админа:</div>
            </div>
            <div>
              <div class='form-control'>
                <label class='label cursor-pointer'>
                  <span class='label-text mr-2'>Опубликован</span>
                  <input
                    type='checkbox'
                    checked={Boolean(store.isApproved)}
                    class='checkbox checkbox-primary'
                    onChange$={() => (store.isApproved = !store.isApproved ? 1 : 0)}
                  />
                </label>
              </div>
            </div>
          </FlexRow>
        )}
        {/* заголовок и описание */}
        <FlexRow>
          <div class='w-full basis-1/2 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Название видео</span>
              </label>
              <input
                type='text'
                placeholder='Заголовок'
                class='input input-bordered w-full'
                value={store.title}
                onChange$={(e) => (store.title = (e.target as HTMLTextAreaElement).value)}
              />
            </div>
          </div>
          <div class='w-full basis-1/2 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Краткое описание</span>
              </label>
              <input
                type='text'
                placeholder='О чем видео'
                class='input input-bordered w-full'
                value={store.desc}
                onChange$={(e) => (store.desc = (e.target as HTMLTextAreaElement).value)}
              />
            </div>
          </div>
        </FlexRow>

        {/* категория и тэги */}
        <FlexRow>
          <div class='w-full basis-1/4 mx-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Категория</span>
              </label>
              <select
                class='select select-bordered w-full'
                onChange$={(e) => (store.category = (e.target as HTMLTextAreaElement).value)}
              >
                {Object.entries(CONSTANTS.videoCategories).map(([engCategory, ruCategory], ind) => (
                  <option key={ind} value={engCategory} selected={store.category === engCategory}>
                    {ruCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div class='w-full basis-1/4 ml-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Уровень</span>
              </label>
              <div class='rating rating-lg mt-1'>
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
          <div class='w-full basis-1/2 mr-3'>
            <div class='form-control w-full'>
              <label class='label'>
                <span class='label-text'>Тэги через запятую</span>
              </label>
              <input
                type='text'
                placeholder='Тэги'
                class='input input-bordered w-full'
                value={store.tags}
                onChange$={(e) => (store.tags = (e.target as HTMLTextAreaElement).value)}
              />
            </div>
          </div>
        </FlexRow>
      </div>
    </div>
  );
});
