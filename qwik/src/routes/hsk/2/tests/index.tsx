import { component$, useStore, useTask$, $, type QwikChangeEvent } from "@builder.io/qwik";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { TableCard } from "~/components/hsk/table-card";
import { type DocumentHead, routeLoader$, useLocation } from "@builder.io/qwik-city";
import { type OldHskWordType } from "../table";
import { ApiService } from "~/misc/actions/request";
import { shuffleArr } from "~/misc/helpers/tools/shuffle-arr";
import { getRandElem } from "~/misc/helpers/tools";
import { playSvg } from "~/components/common/media/svg";
import CONST_URLS from "~/misc/consts/urls";
import { TypingGame } from "~/components/hsk/typing-game";

export type TestWord = {
  chinese: string;
  level: string;
  id: number;
  pinyin: string;
  translation: string;
};

export const QuestKinds = {
  chars: "chars",
  pinyin: "pinyin",
  audio: "audio",
};

export type QuestionType = "chars" | "pinyin" | "audio";

// get 150 words
export const getTestWords = routeLoader$(async (ev): Promise<TestWord[]> => {
  const lvl = ev.query.get("lvl") || "1";
  const res = await ApiService.get(`/api/lexicon/all?hsk_level=${lvl}`, undefined, []);
  return res.map(({ chinese, level, word_id: id, pinyin, translation }: OldHskWordType) => ({
    chinese,
    level,
    id,
    pinyin,
    translation,
  }));
});

export type QuestionStore = {
  chars: null | TestWord[];
  pinyin: null | TestWord[];
  audio: null | TestWord[];
};

export type AnswersObj = { [x: number]: boolean };

export type AnswerStore = {
  chars: AnswersObj;
  pinyin: AnswersObj;
  audio: AnswersObj;
};

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
            isOldHsk={true}
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

              <div class='form-control mb-2 text-base-content'>
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

export function collectOptions(
  words: TestWord[],
  answer: TestWord,
  OPTIONS_NUM: number
): TestWord[] {
  const arr: TestWord[] = [];
  arr[0] = answer;
  while (arr.length < OPTIONS_NUM) {
    const randOpt = getRandElem(words)!;
    if (!arr.some((x) => x.id === randOpt.id)) {
      arr.push(randOpt);
    }
  }
  shuffleArr(arr);
  return arr;
}

export const checkAnswers = (answers: AnswersObj, q: QuestionType) => {
  const successClasses = ["bg-success", "text-success-content"];
  const errClasses = ["bg-error", "text-error-content"];
  for (const wordId in answers) {
    if (!Object.prototype.hasOwnProperty.call(answers, wordId)) continue;

    const questNode = document.getElementById(`${q}_${wordId}`);
    questNode?.classList.remove(...successClasses, ...errClasses);

    answers[wordId]
      ? questNode?.classList.add(...successClasses)
      : questNode?.classList.add(...errClasses);
  }
};

export const playAudio = (id: number, lvl: string) => {
  const firstIdPerLvl: { [key: string]: number } = {
    1: 0,
    2: 150,
    3: 300,
    4: 600,
    5: 1200,
    6: 2500,
  };
  new Audio(`${CONST_URLS.myAudioURL}hsk${lvl}/${id - 1 - firstIdPerLvl[lvl]}.mp3`).play();
};

export const head: DocumentHead = {
  title: "Chinese+ Тесты HSK 2.0",
  meta: [
    {
      name: "description",
      content:
        "Короткие тесты на звание лексики HSK 2.0. Проверьте слух, чтение, знание пиньиня, напечатайте иероглифы на скорость.",
    },
  ],
};
