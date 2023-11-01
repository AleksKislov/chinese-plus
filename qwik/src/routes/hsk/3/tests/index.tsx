import { component$, useStore, useTask$, $, type QwikChangeEvent } from "@builder.io/qwik";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { TableCard } from "~/components/hsk/table-card";
import { type DocumentHead, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { type NewHskWordType } from "../table";
import { ApiService } from "~/misc/actions/request";
import { playSvg } from "~/components/common/media/svg";
import CONST_URLS from "~/misc/consts/urls";
import { TypingGame } from "~/components/hsk/typing-game";

import {
  type TestWord,
  type QuestionType,
  type QuestionStore,
  type AnswerStore,
  collectOptions,
  checkAnswers,
  QuestKinds,
} from "../../2/tests";

import { parseRussian } from "~/misc/helpers/translation";

// get 150 words
export const getTestWords = routeLoader$(async (ev): Promise<TestWord[]> => {
  const lvl = ev.query.get("lvl") || "1";
  const res = await ApiService.get(`/api/newhskwords/all?hsk_level=${lvl}`, undefined, []);
  return res.map(({ cn: chinese, lvl: level, py: pinyin, id, ru }: NewHskWordType) => ({
    id,
    level,
    chinese,
    pinyin,
    translation: parseRussian(ru, false),
  }));
});

export default component$(() => {
  const QUEST_NUM = 5;
  const OPTIONS_NUM = 5;

  const loc = useLocation();
  const testWords = getTestWords();

  const questionStore = useStore<QuestionStore>({ chars: null, pinyin: null, audio: null });
  const answerStore = useStore<AnswerStore>({ chars: {}, pinyin: {}, audio: {} });

  useTask$(({ track }) => {
    track(() => testWords.value);
    questionStore.chars = testWords.value.slice(0, QUEST_NUM);
    questionStore.pinyin = testWords.value.slice(QUEST_NUM, QUEST_NUM * 2);
    questionStore.audio = testWords.value.slice(QUEST_NUM * 2, QUEST_NUM * 3);

    return () => {
      for (const key in QuestKinds) {
        if (Object.prototype.hasOwnProperty.call(QuestKinds, key)) {
          questionStore[key as QuestionType] = null;
          answerStore[key as QuestionType] = {};
        }
      }
    };
  });

  const setAnswer = $(
    (e: QwikChangeEvent<HTMLSelectElement>, answerId: number, qType: QuestionType) => {
      const tgt = e.target;
      answerStore[qType][answerId] = answerId === +tgt.value;
    }
  );

  const questions = [
    {
      type: QuestKinds.chars,
      title: "иероглифов",
    },
    {
      type: QuestKinds.pinyin,
      title: "пиньиня",
    },
    {
      type: QuestKinds.audio,
      title: "иероглифов",
    },
  ];

  const getQuestionBtn = (word: TestWord, type: QuestionType) => {
    if (type === QuestKinds.audio) return playSvg;
    if (type === QuestKinds.pinyin) return <div class={"lowercase"}>{word.pinyin}</div>;
    return word.chinese;
  };

  return (
    <>
      <PageTitle txt={"Тесты на знание HSK 2.0"} />
      <FlexRow>
        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get("lvl") || "1"}
            isOldHsk={false}
            isForTests={true}
          />
        </Sidebar>

        <MainContent>
          <TypingGame words={testWords.value} level={loc.url.searchParams.get("lvl") || "1"} />

          {questions.map(({ type, title }) => (
            <>
              <div class='prose mb-2'>
                <h4>Выберите верный перевод для {title}</h4>
              </div>

              <div class='form-control mb-2'>
                {questionStore[type as QuestionType] &&
                  questionStore[type as QuestionType]!.map((word) => (
                    <div class='input-group mb-1 w-full' key={word.id}>
                      <button
                        class='btn sm:w-1/12 w-1/4 hover:text-neutral-content'
                        id={`${type}_${word.id}`}
                        onClick$={() => {
                          if (type !== QuestKinds.audio) return;
                          playAudio(word.id, word.level);
                        }}
                      >
                        {getQuestionBtn(word, type as QuestionType)}
                      </button>

                      <select
                        class='select select-bordered sm:w-11/12 w-3/4'
                        onChange$={(e) => setAnswer(e, word.id, type as QuestionType)}
                      >
                        <option disabled selected>
                          Выбрать ответ
                        </option>
                        {collectOptions(testWords.value, word, OPTIONS_NUM).map((opt) => (
                          <option
                            value={opt.id}
                            key={opt.id}
                            dangerouslySetInnerHTML={opt.translation}
                          ></option>
                        ))}
                      </select>
                    </div>
                  ))}
              </div>

              <button
                type='button'
                class='btn btn-info btn-sm'
                onClick$={() =>
                  checkAnswers(answerStore[type as QuestionType], type as QuestionType)
                }
              >
                Проверить
              </button>
              {type !== QuestKinds.audio && <hr class='h-px my-8' />}
            </>
          ))}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const playAudio = (id: number, lvl: string) => {
  new Audio(`${CONST_URLS.myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
};

export const head: DocumentHead = {
  title: "Chinese+ Тесты HSK 3.0",
  meta: [
    {
      name: "description",
      content:
        "Короткие тесты на звание лексики нового HSK 3.0. Проверьте чтение, знание пиньиня, напечатайте иероглифы на скорость.",
    },
  ],
};
