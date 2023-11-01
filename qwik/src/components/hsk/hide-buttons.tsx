import { component$, type Signal } from "@builder.io/qwik";

type HideBtnsProps = {
  hideBtnsSig: Signal<string[]>;
};

export enum HideBtnsEnum {
  cn = "Иероглифы",
  ru = "Перевод",
  py = "Пиньинь",
}

export const HideButtons = component$(({ hideBtnsSig }: HideBtnsProps) => {
  const btns = [HideBtnsEnum.cn, HideBtnsEnum.py, HideBtnsEnum.ru];

  return (
    <div class='float-left mb-2 text-base-content'>
      <span class={"font-bold mr-1"}>Скрыть: </span>

      <div class='btn-group'>
        {btns.map((txt: string, ind: number) => (
          <button
            key={ind}
            class={`btn btn-sm btn-outline btn-info lowercase ${
              hideBtnsSig.value.includes(txt) ? "btn-active" : ""
            }`}
            onClick$={() => {
              hideBtnsSig.value = hideBtnsSig.value.includes(txt)
                ? hideBtnsSig.value.filter((x) => x !== txt)
                : [...hideBtnsSig.value, txt];
            }}
          >
            {txt}
          </button>
        ))}
      </div>
    </div>
  );
});
