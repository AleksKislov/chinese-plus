import { component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";

import { HideButtons } from "./hide-buttons";
import { OldHskTableRow } from "./old-hsk-table-row";
import type { OldHskWordType, UserOldHskWordType } from "~/routes/hsk/2/table";
import { TableOrCardsBtns } from "./table-or-cards-btns";
import { FlipCards } from "./flip-cards";
import { FlipCardsButtons } from "./flip-cards-btns";

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

type OldHskTableType = {
  hskWords: OldHskWordType[];
  userHskWords: UserOldHskWordType[];
  isPrivate?: boolean;
};

export const OldHskTable = component$(({ hskWords, userHskWords, isPrivate }: OldHskTableType) => {
  const hideBtnsSig = useSignal<string[]>([]);
  const pinyinAbove = useStore<PinyinAboveStore>({ bool: false });
  const displayCardsStore = useStore<DisplayCardsStore>({ bool: false });

  useVisibleTask$(() => {
    pinyinAbove.bool = !!+localStorage.pinyinAbove;
  });

  return (
    <>
      <div class={"flow-root"}>
        {displayCardsStore.bool ? (
          <FlipCardsButtons pinyinAbove={pinyinAbove} />
        ) : (
          <HideButtons hideBtnsSig={hideBtnsSig} />
        )}
        <TableOrCardsBtns displayCards={displayCardsStore} />
      </div>
      {displayCardsStore.bool ? (
        <FlipCards words={hskWords as OldHskWordType[]} pinyinAbove={pinyinAbove} />
      ) : (
        <div class='overflow-x-auto'>
          <table class='table table-compact w-full overflow-hidden text-base-content'>
            <tbody>
              {hskWords.map((word) => (
                <OldHskTableRow
                  isPrivate={isPrivate}
                  key={word._id}
                  word={word as OldHskWordType}
                  hideBtnsSig={hideBtnsSig}
                  userSelected={
                    Array.isArray(userHskWords) &&
                    userHskWords.some((x) => x.word_id === (word as OldHskWordType).word_id)
                  }
                  userWordsLen={Array.isArray(userHskWords) ? userHskWords.length : 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
});
