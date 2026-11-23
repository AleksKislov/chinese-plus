import { component$, type Signal } from '@builder.io/qwik';
import { FontSizeBtnGroup } from '../content-cards/font-size-btns';
import { type FontSizeBtnsUnion } from '../content-cards/content-page-card';
import { translationSvg } from '../media/svg';

// shared with other pinyin toggles (routes/segment)
export const PINYIN_TIP = 'Показать / скрыть пиньинь над иероглифами';
export const TRANSLATION_TIP = 'Показать / скрыть перевод';

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
              class={`btn btn-sm btn-outline btn-info inline-flex tooltip tooltip-info tooltip-bottom normal-case ${
                showPinyin.value ? 'btn-active' : ''
              }`}
              data-tip={PINYIN_TIP}
              aria-label={PINYIN_TIP}
              onClick$={() => (showPinyin.value = !showPinyin.value)}
            >
              pinyin
            </button>
            <button
              class={`btn btn-sm btn-outline btn-info inline-flex tooltip tooltip-info tooltip-left ${
                showTranslation.value ? 'btn-active' : ''
              }`}
              data-tip={TRANSLATION_TIP}
              aria-label={TRANSLATION_TIP}
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
