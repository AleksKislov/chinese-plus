import { component$, type Signal } from "@builder.io/qwik";
import { FontSizeBtns, type FontSizeBtnsUnion } from "./content-page-card";

type FontSizeBtnGroupProps = { fontSizeSig: Signal<FontSizeBtnsUnion> };

export const FontSizeBtnGroup = component$(({ fontSizeSig }: FontSizeBtnGroupProps) => {
  const fontSizeBtns: FontSizeBtnsUnion[] = [FontSizeBtns.sm, FontSizeBtns.md, FontSizeBtns.lg];

  return (
    <div class='text-base-content'>
      <span class={"font-bold"}>Шрифт: </span>
      <div class='btn-group ml-1'>
        {fontSizeBtns.map((txt, ind) => (
          <button
            key={ind}
            class={`btn btn-sm btn-outline btn-info ${
              txt === fontSizeSig.value ? "btn-active" : ""
            }`}
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
