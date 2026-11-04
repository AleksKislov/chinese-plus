import { component$, type Signal } from '@builder.io/qwik';
import { editWordModalId, moreInfoModalId } from '../common/tooltips/word-tooltip';
import { MoreInfoModal } from '../common/modals/more-info-modal';
import { EditWordModal } from '../common/modals/edit-word-modal';

// modals opened from the word tooltips of the examples
export const GrammarWordModals = component$(
  ({ currentWord }: { currentWord: Signal<DictWord | null> }) => {
    if (!currentWord.value) return null;
    const word = currentWord.value;

    return (
      <div>
        <EditWordModal word={word} modalId={editWordModalId} />
        <MoreInfoModal
          word={{
            _id: word._id,
            cn: word.chinese,
            py: word.pinyin,
            ru: word.russian,
            lvl: 'unknown',
            id: 0,
          }}
          modalId={moreInfoModalId}
        />
      </div>
    );
  },
);
