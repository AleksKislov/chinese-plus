import { component$, useSignal, type Signal } from "@builder.io/qwik";
import { FontSizeMap, FontSizeBtns } from "../common/content-cards/content-page-card";
import { FontSizeBtnGroup } from "../common/content-cards/font-size-btns";
import { EditWordModal } from "../common/modals/edit-word-modal";
import { MoreInfoModal } from "../common/modals/more-info-modal";
import { editWordModalId, moreInfoModalId, WordTooltip } from "../common/tooltips/word-tooltip";
import { HideBtnsEnum, HideButtons } from "../hsk/hide-buttons";
import { PlayerState } from "~/routes/watch/videos/[id]";

type SubsProps = {
  hideBtnsSig: Signal<string[]>;
  ru: string;
  py: string;
  main: (string | DictWord)[];
  curWordInd: number;
  playerState: Signal<number>;
  isPaused: Signal<boolean>;
};
export const Subs = component$(
  ({ hideBtnsSig, ru, py, main, curWordInd, playerState, isPaused }: SubsProps) => {
    const currentWord = useSignal<DictWord | undefined>(undefined);
    const fontSizeSig = useSignal(FontSizeBtns.md);

    return (
      <div>
        <div class='card card-compact w-full bg-neutral border border-neutral-focus mb-3'>
          <div class='card-body items-center text-center'>
            {!hideBtnsSig.value.includes(HideBtnsEnum.cn) && (
              <div
                class={`flex ${FontSizeMap[fontSizeSig.value]}`}
                onMouseEnter$={() => {
                  if (playerState.value === PlayerState.playing) {
                    isPaused.value = true;
                  }
                }}
                onMouseLeave$={() => {
                  if (isPaused.value && playerState.value === PlayerState.paused) {
                    isPaused.value = false;
                  }
                }}
              >
                {main &&
                  main.map((word, ind) => (
                    <WordTooltip
                      key={ind}
                      word={word}
                      hasReddened={ind <= curWordInd}
                      currentWord={currentWord}
                    />
                  ))}
              </div>
            )}
            {!hideBtnsSig.value.includes(HideBtnsEnum.py) && (
              <p class={"text-lg text-info"}>{py}</p>
            )}
            {!hideBtnsSig.value.includes(HideBtnsEnum.ru) && <p>{ru}</p>}
          </div>
        </div>
        <div class={"grid lg:grid-cols-2 grid-cols-1 gap-2"}>
          <HideButtons hideBtnsSig={hideBtnsSig} />
          <div class={"sm:justify-self-end"}>
            <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
          </div>
        </div>
        {!currentWord.value ? null : (
          <>
            <EditWordModal word={currentWord.value} modalId={editWordModalId} />
            <MoreInfoModal
              word={{
                _id: currentWord.value._id,
                cn: currentWord.value.chinese,
                py: currentWord.value.pinyin,
                ru: currentWord.value.russian,
                lvl: "unknown",
                id: 0,
              }}
              modalId={moreInfoModalId}
            />
          </>
        )}
      </div>
    );
  }
);
