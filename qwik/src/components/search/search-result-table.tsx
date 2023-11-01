import { component$, useSignal } from "@builder.io/qwik";
import { MoreInfoModal } from "../common/modals/more-info-modal";
import { moreInfoModalId } from "../common/tooltips/word-tooltip";
import { HideButtons } from "../hsk/hide-buttons";
import { SearchResultRow } from "./search-result-row";

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

export const SearchResutlTable = component$(({ words }: { words: (string | DictWord)[] }) => {
  const hideBtnsSig = useSignal<string[]>([]);
  const currentWord = useSignal<DictWord | undefined>(undefined);

  return (
    <>
      <div class={"flow-root mt-3"}>
        <HideButtons hideBtnsSig={hideBtnsSig} />
      </div>

      <div class='overflow-x-auto'>
        <table class='table table-compact w-full overflow-hidden text-base-content'>
          <tbody>
            {words.map((word, ind) => (
              <SearchResultRow
                key={ind}
                word={word}
                hideBtnsSig={hideBtnsSig}
                currentWord={currentWord}
              />
            ))}
          </tbody>
        </table>
        {!currentWord.value ? null : (
          <>
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
    </>
  );
});
