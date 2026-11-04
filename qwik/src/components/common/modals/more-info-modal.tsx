import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { type NewHskWordType } from '~/routes/hsk/3/table/[...lvl]';
import { getWordTranslation } from '~/misc/actions/dictionary/get-translation';
import { type DictTranslationResponse } from '../translation/types';
import {
  DictWordTranslation,
  type ParsedWordTranslation,
} from '../translation/dict-word-translation';
import { ShowHideBtn } from './show-hide-btn';
import { Loader } from '../ui/loader';

/**
 * Modal word of a dictionary word, undefined while there is none. Callers pass their
 * `currentWord.value`, which goes null between two tooltips: built inline, `x.value._id` would
 * throw when the modal's task re-reads the word in that moment.
 */
export const toMoreInfoWord = (word: DictWord | null | undefined): NewHskWordType | undefined =>
  word
    ? {
        _id: word._id,
        cn: word.chinese,
        py: word.pinyin,
        senses: word.senses,
        dictId: word._id,
        lvl: 'unknown',
        id: 0,
      }
    : undefined;

// `dictId` - dictionary entry of the word: its full parsed translation and examples are loaded
// while the modal is open; until then (and for words without one) `senses` / `ru` are shown.
// `word` may be unset: the modal can be rendered before a word is picked (see NewHskTable)
export const MoreInfoModal = component$((props: { word?: NewHskWordType; modalId: string }) => {
  const { word, modalId } = props;
  const showExamples = useSignal(true);
  const isOpen = useSignal(false);
  const requestedId = useSignal('');
  const loaded = useSignal<DictTranslationResponse | null>(null);
  const isLoading = useSignal(false);

  // tracks the word, not the click: a row's "more" label opens the modal before its click
  // handler sets the new word
  useTask$(({ track }) => {
    const open = track(() => isOpen.value);
    const dictId = String(track(() => props.word?.dictId) || '');
    if (open && dictId && requestedId.value !== dictId) {
      requestedId.value = dictId;
      isLoading.value = true;
      getWordTranslation(dictId)
        .catch(() => null)
        .then((res) => {
          // a later word may have been picked meanwhile
          if (requestedId.value !== dictId) return;
          loaded.value = res;
          isLoading.value = false;
        });
    }
  });

  const translation = loaded.value?.translation;
  const parsed: ParsedWordTranslation | null =
    translation && word?.dictId && translation.wordId === String(word.dictId)
      ? { senses: translation.senses, examples: loaded.value?.examples || [] }
      : word?.senses?.length
      ? { senses: word.senses, examples: [] }
      : null;

  return (
    <div class="text-base-content">
      <input
        type="checkbox"
        id={modalId}
        class="modal-toggle"
        onChange$={(_, el) => (isOpen.value = el.checked)}
      />
      <label class="modal text-left" for={modalId}>
        <label class="modal-box relative border border-info" for="">
          <label for={modalId} class="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>

          {word && (
            <>
              <div class={'flex flex-row mb-2'}>
                <div class={'text-2xl mr-2'}>{word.cn}</div>
                <div class={'text-lg'}>{word.py}</div>
              </div>

              <ShowHideBtn showExamples={showExamples} />
              {isLoading.value && <Loader size="sm" />}
              <DictWordTranslation
                ru={word.ru}
                parsed={parsed}
                showExamples={showExamples.value}
                py={word.py}
              />
            </>
          )}
        </label>
      </label>
    </div>
  );
});
