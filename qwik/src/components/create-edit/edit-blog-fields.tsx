import { component$ } from '@builder.io/qwik';
import { FlexRow } from '../common/layout/flex-row';
import CONSTANTS from '~/misc/consts/consts';
import { type EditBlogStore } from '~/routes/(content)/edit/blog/[id]';

type EditBlogFieldsProps = {
  store: EditBlogStore;
  isAdmin: boolean;
};

export const EditBlogFields = component$(({ store, isAdmin }: EditBlogFieldsProps) => {
  return (
    <div class="collapse collapse-open border border-base-300 bg-base-200 text-base-content mb-3">
      <div class="collapse-content mt-4">
        {isAdmin && (
          <FlexRow>
            <div class="ml-3">
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text mr-2">Опубликован</span>
                  <input
                    type="checkbox"
                    checked={Boolean(store.isApproved)}
                    class="checkbox checkbox-primary"
                    onChange$={() => (store.isApproved = store.isApproved ? 0 : 1)}
                  />
                </label>
              </div>
            </div>
          </FlexRow>
        )}

        <FlexRow>
          <div class="w-full basis-1/2 mx-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Заголовок</span>
              </label>
              <input
                type="text"
                placeholder="Заголовок"
                class="input input-bordered w-full"
                value={store.title}
                onChange$={(e) => (store.title = (e.target as HTMLInputElement).value)}
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
                onChange$={(e) => (store.tags = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
        </FlexRow>

        <FlexRow>
          <div class="w-full basis-1/4 ml-3 pr-3">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">Категория</span>
              </label>
              <select
                class="select select-bordered w-full"
                onChange$={(e) => (store.category = (e.target as HTMLSelectElement).value)}
              >
                {(Object.keys(CONSTANTS.blogCategories) as Array<keyof typeof CONSTANTS.blogCategories>).map(
                  (key) => (
                    <option key={key} value={key} selected={key === store.category}>
                      {CONSTANTS.blogCategories[key]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </FlexRow>
      </div>
    </div>
  );
});
