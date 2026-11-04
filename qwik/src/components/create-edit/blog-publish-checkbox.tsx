import { component$ } from '@builder.io/qwik';
import { FlexRow } from '../common/layout/flex-row';

type BlogPublishCheckboxProps = {
  store: { isApproved?: 0 | 1 };
};

export const BlogPublishCheckbox = component$(({ store }: BlogPublishCheckboxProps) => {
  return (
    <FlexRow>
      <div>
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
  );
});
