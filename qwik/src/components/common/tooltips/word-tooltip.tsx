import { component$, type Signal, useContext, useSignal } from "@builder.io/qwik";
import { parseRussian } from "~/misc/helpers/translation";
import { userContext } from "~/root";
import { moreInfoSvg } from "../media/svg";
import { EditWordBtn } from "./edit-word-btn";
import { OwnWordBtn } from "./own-word-btn";

export const editWordModalId = "editWordModalId";
export const moreInfoModalId = "moreInfoModalId";

type WordTooltipProps = {
  word: string | DictWord;
  hasReddened?: boolean; // only for video subs
  currentWord: Signal<DictWord | undefined>;
};

export const WordTooltip = component$(({ word, hasReddened, currentWord }: WordTooltipProps) => {
  const isRightSide = useSignal(false);
  const isScreenCenter = useSignal(false);
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const showTooltip = useSignal(false);
  let isUserWord = false;
  if (typeof word !== "string") {
    isUserWord = loggedIn && userState.words.some((w) => w.chinese === word.chinese);
  }

  return (
    <div
      class={`dropdown dropdown-bottom ${
        isRightSide.value && !isScreenCenter.value ? "dropdown-end" : ""
      }`}
    >
      <label
        onMouseEnter$={(ev) => {
          isRightSide.value = screen.width / 2 < ev.x;
          isScreenCenter.value = screen.width / 3 < ev.x && 2 * (screen.width / 3) > ev.x;
        }}
        tabIndex={0}
        onClick$={() => {
          currentWord.value = word as DictWord;
          showTooltip.value = true;
        }}
        class={`rounded cursor-pointer hover:bg-info hover:text-info-content ${
          isUserWord ? "bg-success text-success-content" : ""
        } ${hasReddened ? "text-error" : ""}`}
      >
        {typeof word !== "string" ? word.chinese : word}
      </label>
      {typeof word !== "string" && (
        <div
          tabIndex={0}
          class={`rounded-box dropdown-content card card-compact bg-neutral-focus text-neutral-content w-64 p-1 shadow z-30 ${
            showTooltip.value ? "" : "hidden"
          } ${isScreenCenter.value && isRightSide.value ? "-right-14" : ""}
          ${isScreenCenter.value && !isRightSide.value ? "-left-14" : ""} 
          `}
        >
          <div class='card-body text-left'>
            <label
              class='btn btn-sm btn-circle btn-ghost absolute right-1 top-1'
              onClick$={() => (showTooltip.value = false)}
            >
              ✕
            </label>
            <div class={"flex flex-row mb-2"}>
              <div class={"text-2xl mr-2"}>{word.chinese}</div>
              <div class={"text-lg text-info"}>{word.pinyin}</div>
            </div>
            <div
              class={"text-sm mb-2"}
              dangerouslySetInnerHTML={parseRussian(word.russian, false)}
            ></div>

            <div class={"flex flex-row justify-between"}>
              <div>
                <div class='tooltip tooltip-info tooltip-bottom' data-tip={"Больше информации"}>
                  <label for={moreInfoModalId} class={"btn btn-sm btn-info mr-1"}>
                    {moreInfoSvg}
                  </label>
                </div>
                <OwnWordBtn word={word} />
              </div>

              <EditWordBtn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
