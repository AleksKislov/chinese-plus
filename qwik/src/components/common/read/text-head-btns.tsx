import { component$, type Signal } from '@builder.io/qwik';
import { FontSizeBtnGroup } from '../content-cards/font-size-btns';
import { type FontSizeBtnsUnion } from '../content-cards/content-page-card';

type TxtHeadBtnsProps = {
  fontSizeSig: Signal<FontSizeBtnsUnion>;
  showTranslation: Signal<boolean>;
};

export const TextHeadBtns = component$(({ fontSizeSig, showTranslation }: TxtHeadBtnsProps) => {
  return (
    <div class={'flex justify-between w-full'}>
      <div class={'pt-1'}>
        <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
      </div>
      <div>
        <label class="label cursor-pointer">
          <span class="label-text mr-3 font-bold">
            {showTranslation.value ? 'Без перевода' : 'С переводом'}
          </span>

          <input
            type="checkbox"
            class="toggle toggle-accent"
            checked={!showTranslation.value}
            onClick$={() => (showTranslation.value = !showTranslation.value)}
          />
        </label>
      </div>
    </div>
  );
});
