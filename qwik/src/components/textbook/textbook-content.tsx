import { component$, useSignal } from '@builder.io/qwik';
import { type TextbookType } from '~/routes/start/textbook';
import { playSvg } from '../common/media/svg';
import { editWordModalId, moreInfoModalId, WordTooltip } from '../common/tooltips/word-tooltip';
import { MoreInfoModal } from '../common/modals/more-info-modal';
import { EditWordModal } from '../common/modals/edit-word-modal';
import CONST_URLS from '~/misc/consts/urls';

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

export const playAudio = (band: string, link: string) => {
  new Audio(`${CONST_URLS.myAudioURL}textbooks/${band}/${link}.mp3`).play();
};

export const TextbookContent = component$(({ topics }: { topics: TextbookType[] }) => {
  const currentWord = useSignal<DictWord | null>(null);

  const ALPHABET_MAP: Record<number, string> = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
    8: 'i',
    9: 'j',
  };

  const bandLevel = topics?.[0]?.level ?? '1';
  return (
    <>
      <div class="prose">
        <h2>HSK v3.0 уровень {bandLevel}</h2>
      </div>
      {topics.map((topic) => (
        <details
          key={topic._id}
          class="collapse bg-base-100 border border-base-300 my-2 overflow-visible"
        >
          <summary class="collapse-title font-semibold text-lg my-2">
            {topic.ind + 1}. {topic.topic}
          </summary>
          <div class="collapse-content">
            {topic.content.map((item, idx) => (
              <div key={idx} class="mt-4">
                <p class="font-semibold">
                  <span class="badge badge-primary">{ALPHABET_MAP[idx]}</span> {item.desc}
                </p>
                <ul class="list bg-base-100">
                  {item.examples.map((example, exIdx) => (
                    <li key={exIdx} class="list-row">
                      <div class="flex flex-col my-2">
                        <div class="flex flex-row justify-between">
                          <div class="text-xl mb-1">
                            {example.cn?.map((word, i) => (
                              <WordTooltip
                                key={i}
                                word={word}
                                currentWord={currentWord}
                                hasReddened={undefined}
                              />
                            ))}
                          </div>
                          <button
                            class="btn btn-info btn-sm"
                            onClick$={() => {
                              playAudio(bandLevel, example.audio);
                            }}
                          >
                            {playSvg}
                          </button>
                        </div>
                        <p class="text-lg italic">{example.py}</p>
                        <p class="text-base">{example.ru}</p>
                      </div>
                      {topic.content.length - 1 === idx &&
                      exIdx === item.examples.length - 1 ? null : (
                        <div class="divider"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ))}

      {!currentWord.value ? null : (
        <div>
          <EditWordModal word={currentWord.value} modalId={editWordModalId} />
          <MoreInfoModal
            word={{
              _id: currentWord.value._id,
              cn: currentWord.value.chinese,
              py: currentWord.value.pinyin,
              ru: currentWord.value.russian,
              lvl: 'unknown',
              id: 0,
            }}
            modalId={moreInfoModalId}
          />
        </div>
      )}
    </>
  );
});
