import {
  component$,
  type Signal,
  useContext,
  useSignal,
  useVisibleTask$,
  $,
} from '@builder.io/qwik';
import { parseRussian } from '~/misc/helpers/translation';
import { userContext } from '~/root';
import { moreInfoSvg } from '../media/svg';
import { EditWordBtn } from './edit-word-btn';
import { OwnWordBtn } from './own-word-btn';
import { globalAction$ } from '@builder.io/qwik-city';
import { getWordsForTooltips } from '~/routes/read/texts/[id]';

export const editWordModalId = 'editWordModalId';
export const moreInfoModalId = 'moreInfoModalId';

type WordTooltipProps = {
  word: string | DictWord;
  hasReddened?: boolean; // only for video subs
  currentWord: Signal<DictWord | null>;
};

export const useGetWordFullTranslation = globalAction$((params): Promise<(string | DictWord)[]> => {
  return getWordsForTooltips([params.chineseWord as string]);
});

export const WordTooltip = component$(({ word, hasReddened, currentWord }: WordTooltipProps) => {
  const getFullTranslation = useGetWordFullTranslation();
  const isRightSide = useSignal(false);
  const isScreenCenter = useSignal(false);
  const userState = useContext(userContext);
  const { loggedIn } = userState;
  const showTooltip = useSignal(false);

  useVisibleTask$(({ track }) => {
    const val = track(() => getFullTranslation.value);
    const translation = (val?.[0] as DictWord).russian;
    if (translation && currentWord) {
      setCurrentWord(word as DictWord, translation);
    }
  });

  const setCurrentWord = $((word: DictWord, translation?: string) => {
    currentWord.value = null;
    setTimeout(() => {
      currentWord.value = word;
      if (translation) currentWord.value.russian = translation;
    });
  });

  let isUserWord = false;
  if (typeof word !== 'string') {
    isUserWord = loggedIn && userState.words?.some((w) => w.chinese === word.chinese);
  }

  return (
    <div
      class={`dropdown dropdown-bottom ${
        isRightSide.value && !isScreenCenter.value ? 'dropdown-end' : ''
      }`}
    >
      <label
        onMouseEnter$={(ev) => {
          isRightSide.value = screen.width / 2 < ev.x;
          isScreenCenter.value = screen.width / 3 < ev.x && 2 * (screen.width / 3) > ev.x;
        }}
        tabIndex={0}
        onClick$={() => {
          // currentWord.value = word as DictWord;
          setCurrentWord(word as DictWord);
          showTooltip.value = true;
        }}
        class={`rounded cursor-pointer hover:bg-info hover:text-info-content ${
          isUserWord ? 'bg-success text-success-content' : ''
        } ${hasReddened ? 'text-error' : ''}`}
      >
        {typeof word !== 'string' ? word.chinese : word}
      </label>
      {typeof word !== 'string' && (
        <div
          tabIndex={0}
          class={`rounded-box dropdown-content card card-compact bg-base-100 text-base-content border-info border w-64 p-1 shadow z-30 ${
            showTooltip.value ? '' : 'hidden'
          } ${isScreenCenter.value && isRightSide.value ? '-right-14' : ''}
          ${isScreenCenter.value && !isRightSide.value ? '-left-14' : ''} 
          `}
        >
          <div class="card-body text-left">
            <label
              class="btn btn-sm btn-circle btn-ghost absolute right-1 top-1"
              onClick$={() => (showTooltip.value = false)}
            >
              ✕
            </label>
            <div class={'flex flex-row mb-2'}>
              <div class={'text-2xl mr-2'}>{word.chinese}</div>
              <div class={'text-lg text-info'}>{word.pinyin}</div>
            </div>
            <div
              class={'text-sm mb-2'}
              dangerouslySetInnerHTML={parseRussian(word.russian, false)}
            ></div>

            <div class={'flex flex-row justify-between'}>
              <div>
                <div class="tooltip tooltip-info tooltip-bottom" data-tip={'Больше информации'}>
                  <label
                    for={moreInfoModalId}
                    class={'btn btn-sm btn-info mr-1'}
                    onClick$={() => {
                      getFullTranslation.submit({ chineseWord: word.chinese });
                    }}
                  >
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
