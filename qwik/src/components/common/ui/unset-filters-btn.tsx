import { component$, type Signal } from "@builder.io/qwik";
import type { MarkedSignalUnion, SortByType } from "~/routes/read/texts/all";

type UnsetFiltersBtnProps = {
  levelSignal?: Signal<string>;
  categorySignal: Signal<string>;
  skipSignal?: Signal<number>;
  audioSignal?: Signal<string>;
  sortSignal?: Signal<boolean>;
  sortBy?: Signal<SortByType>;
  markedSignal?: Signal<MarkedSignalUnion>;
  tagInput?: Signal<string>;
  chosenTag?: Signal<string>;
};

export const UnsetFiltersBtn = component$(
  ({
    levelSignal,
    categorySignal,
    skipSignal,
    audioSignal,
    sortSignal,
    sortBy,
    markedSignal,
    tagInput,
    chosenTag,
  }: UnsetFiltersBtnProps) => {
    return (
      <button
        class={`btn btn-sm btn-outline btn-info h-full`}
        type='button'
        onClick$={() => {
          categorySignal.value = "";
          if (skipSignal) skipSignal.value = 0;
          if (levelSignal) levelSignal.value = "0";
          if (audioSignal) audioSignal.value = "0";
          if (sortSignal) sortSignal.value = false;
          if (sortBy) sortBy.value = "date";
          if (markedSignal) markedSignal.value = "all";
          if (tagInput) tagInput.value = "";
          if (chosenTag) chosenTag.value = "";
        }}
      >
        Сбросить
      </button>
    );
  }
);
