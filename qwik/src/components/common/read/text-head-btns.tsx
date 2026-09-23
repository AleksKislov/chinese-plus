import { component$, type Signal } from '@builder.io/qwik';
import { FontSizeBtnGroup } from '../content-cards/font-size-btns';
import { type FontSizeBtnsUnion } from '../content-cards/content-page-card';
import { translationSvg } from '../media/svg';

type TxtHeadBtnsProps = {
  fontSizeSig: Signal<FontSizeBtnsUnion>;
  showTranslation: Signal<boolean>;
  showPinyin: Signal<boolean>;
};

export const TextHeadBtns = component$(
  ({ fontSizeSig, showTranslation, showPinyin }: TxtHeadBtnsProps) => {
    return (
      <div class={'flex justify-between w-full'}>
        <div class={'pt-1'}>
          <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
        </div>
        <div class={'pt-1'}>
          <div class="btn-group ml-1">
            <button
              class={`btn btn-sm btn-outline btn-info ${showPinyin.value ? 'btn-active' : ''}`}
              onClick$={() => (showPinyin.value = !showPinyin.value)}
            >
              pinyin
            </button>
            <button
              class={`btn btn-sm btn-outline btn-info ${showTranslation.value ? 'btn-active' : ''}`}
              onClick$={() => (showTranslation.value = !showTranslation.value)}
            >
              {translationSvg}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
