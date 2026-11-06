import { component$, useSignal } from '@builder.io/qwik';
import { MoreInfoModal, toMoreInfoWord } from '../common/modals/more-info-modal';
import { moreInfoModalId } from '../common/tooltips/word-tooltip';
import { HideButtons } from '../hsk/hide-buttons';
import { SearchResultRow } from './search-result-row';
import { type HskLevels } from '../hsk/hsk-level-badge';

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

type SearchResultTableProps = {
  words: (string | DictWord)[];
  hskLevels?: HskLevels;
};

export const SearchResutlTable = component$(({ words, hskLevels }: SearchResultTableProps) => {
  const hideBtnsSig = useSignal<string[]>([]);
  const currentWord = useSignal<DictWord | undefined>(undefined);

  return (
    <>
      <div class={'flow-root mt-3'}>
        <HideButtons hideBtnsSig={hideBtnsSig} />
      </div>

      <div class="overflow-x-auto">
        <table class="table table-compact w-full overflow-hidden text-base-content">
          <tbody>
            {words.map((word, ind) => (
              <SearchResultRow
                key={ind}
                word={word}
                hideBtnsSig={hideBtnsSig}
                currentWord={currentWord}
                hskLevel={hskLevels?.[typeof word === 'string' ? word : word.chinese]}
              />
            ))}
          </tbody>
        </table>
        {!currentWord.value ? null : (
          <>
            <MoreInfoModal word={toMoreInfoWord(currentWord.value)} modalId={moreInfoModalId} />
          </>
        )}
      </div>
    </>
  );
});
