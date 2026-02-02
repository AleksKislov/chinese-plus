import { component$, useSignal } from '@builder.io/qwik';
import { type TextbookType } from '~/routes/start/textbook';
import { playSvg } from '../common/media/svg';
import { editWordModalId, moreInfoModalId, WordTooltip } from '../common/tooltips/word-tooltip';
import { MoreInfoModal } from '../common/modals/more-info-modal';
import { EditWordModal } from '../common/modals/edit-word-modal';

export type DisplayCardsStore = { bool: boolean };
export type PinyinAboveStore = { bool: boolean };

export const TextbookContent = component$(({ topics }: { topics: TextbookType[] }) => {
  const currentWord = useSignal<DictWord | null>(null);

  return (
    <>
      <div class="prose">
        <h2>HSK v3.0 уровень {topics?.[0]?.level}</h2>
      </div>
      {topics.map((topic) => (
        <div
          key={topic._id}
          class="collapse collapse-arrow bg-base-100 border border-base-300 my-2"
        >
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div class="collapse-title font-semibold my-2">
            {topic.ind + 1}. {topic.topic}
          </div>
          <div class="collapse-content">
            {topic.content.map((item, idx) => (
              <div key={idx} class="">
                <p>{item.desc}</p>
                <ul class="list bg-base-100 rounded-box shadow-md">
                  <li class="py-2 text-xs opacity-60 tracking-wide">Примеры:</li>

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
                          <button class="btn btn-info btn-sm">{playSvg}</button>
                        </div>
                        <p class="text-lg italic">{example.py}</p>
                        <p class="text-base">{example.ru}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

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
        </div>
      ))}
    </>
  );
});
