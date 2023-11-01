import { component$ } from "@builder.io/qwik";
import { type PinyinAboveStore } from "./hsk-table";

export const FlipCardsButtons = component$(({ pinyinAbove }: { pinyinAbove: PinyinAboveStore }) => {
  return (
    <div class={"float-left mb-2"}>
      <span class={"mr-1 font-bold"}>Показывать сверху: </span>

      <div class='btn-group'>
        <button
          class={`btn btn-sm btn-info lowercase ${pinyinAbove.bool ? "btn-outline" : ""}`}
          type='button'
          onClick$={() => {
            localStorage.setItem("pinyinAbove", "0");
            pinyinAbove.bool = false;
          }}
        >
          Иероглифы
        </button>

        <button
          type='button'
          class={`btn btn-sm btn-info lowercase ${pinyinAbove.bool ? "" : "btn-outline"}`}
          onClick$={() => {
            localStorage.setItem("pinyinAbove", "1");
            pinyinAbove.bool = true;
          }}
        >
          Пиньинь
        </button>
      </div>
    </div>
  );
});
