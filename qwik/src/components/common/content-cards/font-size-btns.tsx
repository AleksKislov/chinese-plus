import { component$, type Signal } from '@builder.io/qwik';
import { FontSizeBtns, type FontSizeBtnsUnion } from './content-page-card';

const FONT_SIZE_TIPS = ['Мелкий шрифт', 'Средний шрифт', 'Крупный шрифт'];

type FontSizeBtnGroupProps = { fontSizeSig: Signal<FontSizeBtnsUnion> };

export const FontSizeBtnGroup = component$(({ fontSizeSig }: FontSizeBtnGroupProps) => {
  const fontSizeBtns: FontSizeBtnsUnion[] = [FontSizeBtns.sm, FontSizeBtns.md, FontSizeBtns.lg];

  return (
    <div class="text-base-content">
      <span class={'font-bold text-sm'}>Шрифт: </span>
      <div class="btn-group ml-1">
        {fontSizeBtns.map((txt, ind) => (
          <button
            key={ind}
            class={`btn btn-sm btn-outline btn-info inline-flex tooltip tooltip-info tooltip-bottom ${
              txt === fontSizeSig.value ? 'btn-active' : ''
            }`}
            data-tip={FONT_SIZE_TIPS[ind]}
            onClick$={() => {
              fontSizeSig.value = txt;
            }}
          >
            {txt}
          </button>
        ))}
      </div>
    </div>
  );
});
