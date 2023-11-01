import { component$, useSignal } from "@builder.io/qwik";
import { HideButtons } from "./hide-buttons";
import { type NewHskWordType } from "~/routes/hsk/3/table";
import { NewHskTableRow } from "./new-hsk-table-row";
import { MoreInfoModal } from "../common/modals/more-info-modal";
import { moreInfoModalId } from "../common/tooltips/word-tooltip";

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

export const NewHskTable = component$(({ hskWords }: { hskWords: NewHskWordType[] }) => {
  const hideBtnsSig = useSignal<string[]>([]);
  const currentWord = useSignal<NewHskWordType | undefined>(undefined);

  return (
    <>
      <div class={"flow-root"}>
        <HideButtons hideBtnsSig={hideBtnsSig} />
      </div>

      <div class='overflow-x-auto'>
        <table class='table table-compact w-full overflow-hidden text-base-content'>
          <tbody>
            {hskWords.map((word) => (
              <NewHskTableRow
                key={word._id}
                word={word as NewHskWordType}
                hideBtnsSig={hideBtnsSig}
                currentWord={currentWord}
              />
            ))}
          </tbody>
        </table>
        {!currentWord.value ? null : (
          <>
            <MoreInfoModal word={currentWord.value as NewHskWordType} modalId={moreInfoModalId} />
          </>
        )}
      </div>
    </>
  );
});
