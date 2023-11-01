import { component$, type Signal } from "@builder.io/qwik";
import CONSTANTS from "~/misc/consts/consts";

export const EmojiSelect = component$(({ emoji }: { emoji: Signal<string> }) => {
  return (
    <div class={`dropdown dropdown-bottom dropdown-left`}>
      <label tabIndex={0} class={`cursor-pointer`}>
        😀
      </label>
      <div
        tabIndex={0}
        class={`rounded-box dropdown-content card card-compact bg-base-300 w-40 p-1 shadow`}
      >
        <div class='card-body text-center'>
          <span>
            {CONSTANTS.commentEmojis.map((emo, ind) => (
              <span
                class='mx-1 my-1 cursor-pointer text-xl'
                key={ind}
                onClick$={() => (emoji.value = emo)}
              >
                {emo}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
});
