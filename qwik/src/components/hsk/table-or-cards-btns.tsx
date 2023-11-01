import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { type DisplayCardsStore } from "./hsk-table";

export const TableOrCardsBtns = component$(
  ({ displayCards }: { displayCards: DisplayCardsStore }) => {
    useVisibleTask$(() => {
      displayCards.bool = !!+localStorage.displayCards;
    });

    return (
      <div class={"sm:float-right float-left mb-2"}>
        <span class={"mr-1 font-bold"}>Отображать: </span>
        <div class='btn-group'>
          <button
            class={`btn btn-sm btn-info lowercase ${displayCards.bool ? "btn-outline" : ""}`}
            type='button'
            onClick$={() => {
              localStorage.setItem("displayCards", "0");
              displayCards.bool = false;
            }}
          >
            Таблицей
          </button>

          <button
            type='button'
            class={`btn btn-sm btn-info lowercase ${displayCards.bool ? "" : "btn-outline"}`}
            onClick$={() => {
              localStorage.setItem("displayCards", "1");
              displayCards.bool = true;
            }}
          >
            Карточками
          </button>
        </div>
      </div>
    );
  }
);
