import "./flip-cards.css";
import { component$, useSignal } from "@builder.io/qwik";
import { type OldHskWordType } from "~/routes/hsk/2/table";

export const FlipCard = component$(
  ({ word, pinyinAbove }: { word: OldHskWordType; pinyinAbove: boolean }) => {
    const { chinese, translation, pinyin } = word;
    const isClicked = useSignal(false);

    return (
      <div class='flip-card-outer prose'>
        <div
          class={`flip-card rounded-lg ${
            isClicked.value ? "flipCardMethod" : "border border-warning"
          }`}
          onClick$={() => (isClicked.value = !isClicked.value)}
        >
          <h3 class='flip-front text-center mt-12'>{pinyinAbove ? pinyin : chinese}</h3>

          <span class={`flip-back bg-primary px-2 rounded-lg leading-3 text-primary-content`}>
            <h4 class='text-primary-content'>{!pinyinAbove ? pinyin : chinese}</h4>
            <small>{translation}</small>
          </span>
        </div>
      </div>
    );
  }
);
