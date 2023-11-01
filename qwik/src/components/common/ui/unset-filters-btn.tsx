import { component$, type Signal } from "@builder.io/qwik";

type UnsetFiltersBtnProps = {
  levelSignal?: Signal<string>;
  categorySignal: Signal<string>;
  skipSignal: Signal<number>;
  audioSignal?: Signal<string>;
};

export const UnsetFiltersBtn = component$(
  ({ levelSignal, categorySignal, skipSignal, audioSignal }: UnsetFiltersBtnProps) => {
    return (
      <button
        class={`btn btn-sm btn-outline btn-info h-full`}
        type='button'
        onClick$={() => {
          categorySignal.value = "";
          skipSignal.value = 0;
          if (levelSignal) levelSignal.value = "0";
          if (audioSignal) audioSignal.value = "0";
        }}
      >
        Сбросить
      </button>
    );
  }
);
