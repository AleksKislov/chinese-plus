import { shuffleArr } from "~/misc/helpers/tools/shuffle-arr";
import { arrorUturnDown, faceSadBigSvg, faceSmileBigSvg, thumbUpBigSvg } from "../common/media/svg";
import { type TestWord } from "~/routes/hsk/2/tests";
import {
  $,
  component$,
  useSignal,
  useStore,
  useTask$,
  type QwikKeyboardEvent,
  useStyles$,
} from "@builder.io/qwik";

type TypingGameProps = {
  words: TestWord[];
  level?: string;
};

type WrongStore = {
  answers: string[];
  num: number;
};

export const QUEST_NUM = 10;

export const TypingGame = component$(({ words, level }: TypingGameProps) => {
  useStyles$(shakeCss);
  const start = useSignal(false);
  const progress = useSignal(0);
  const questionNum = useSignal(1);
  const shuffled = useStore({ words });
  const corrects = useSignal(0);
  const resultWords = useSignal("");
  const wrongStore = useStore<WrongStore>({ answers: [], num: 0 });
  const question = useSignal(words[0]);
  const answer = useSignal("");
  const isWrong = useSignal(false);
  const isCorrect = useSignal(false);

  const setNewQuestion = $(() => {
    progress.value = 0;
    question.value = shuffled.words[questionNum.value];
    questionNum.value++;
    answer.value = "";
  });

  const skipQuestion = $(() => {
    wrongStore.answers.push(question.value.chinese);
    wrongStore.num++;
    isWrong.value = true;
    setTimeout(() => (isWrong.value = false), 1000);
    setNewQuestion();
  });

  useTask$(({ track }) => {
    track(() => question.value);

    if (questionNum.value > QUEST_NUM) {
      resultWords.value =
        corrects.value > 8 ? "Отличный результат!" : corrects.value > 5 ? "Неплохо!" : "Н-да уж...";
      start.value = false;
    }

    const id = setInterval(() => {
      if (!start.value || questionNum.value > QUEST_NUM) return;
      progress.value += 0.5;
      if (progress.value >= 100) skipQuestion();
    }, 100);
    return () => {
      progress.value = 0;
      clearInterval(id);
    };
  });

  const checkIt = $(() => {
    if (answer.value === question.value.chinese) {
      corrects.value++;
      wrongStore.answers.push("");
      setNewQuestion();
      isCorrect.value = true;
      setTimeout(() => (isCorrect.value = false), 1000);
      setTimeout(() => (answer.value = ""), 200);
    } else {
      isWrong.value = true;
      setTimeout(() => (isWrong.value = false), 1000);
      setTimeout(() => (answer.value = ""), 500);
    }
  });

  const setNewGame = $(() => {
    start.value = true;
    wrongStore.answers = [];
    wrongStore.num = 0;
    resultWords.value = "";
    questionNum.value = 1;
    answer.value = "";
    corrects.value = 0;
    progress.value = 0;
    shuffleArr(words);
    const newArr = words.slice(0, QUEST_NUM);
    shuffled.words = newArr;
    question.value = newArr[0];
  });

  return (
    shuffled.words && (
      <div class='card bg-base-200 text-base-content w-full mb-6'>
        <div class='card-body'>
          {start.value ? (
            <div>
              <div class='float-right'>
                <div
                  class='radial-progress text-error mr-3'
                  style={`--value:${progress.value}; --size:3rem;`}
                >
                  {Math.ceil(progress.value)}
                </div>

                <button class='btn btn-error btn-sm' onClick$={skipQuestion}>
                  Пропустить
                </button>
              </div>
              <div class='prose mb-3'>
                <h4 class='card-title'>
                  Вопрос {questionNum}/{QUEST_NUM}
                </h4>
              </div>
              <p class='text-sm mb-3' dangerouslySetInnerHTML={question.value?.translation}></p>

              <div class='form-control'>
                <div class='input-group w-full '>
                  <input
                    type='text'
                    class={`input input-bordered w-full ${isCorrect.value ? `border-success` : ""}`}
                    style={isWrong.value ? `animation: shake 0.2s ease-in-out 0s 2` : ""}
                    placeholder='汉字'
                    bind:value={answer}
                    onKeyDown$={(e: QwikKeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") return setTimeout(checkIt);
                    }}
                    autoComplete='off'
                  />
                  <button class='btn btn-success' type='button' onClick$={checkIt}>
                    {arrorUturnDown}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div class='prose mb-2'>
                <h3 class='card-title'>
                  {questionNum.value > QUEST_NUM ? (
                    "Результат"
                  ) : level ? (
                    <>
                      Успей напечатать <small>[ур. {level}]</small>
                    </>
                  ) : (
                    "Успей напечатать"
                  )}
                </h3>
              </div>
              {questionNum.value > QUEST_NUM && (
                <div class='flex justify-center mb-3'>
                  <div class=''>
                    {corrects.value > 8
                      ? thumbUpBigSvg
                      : corrects.value < 6
                      ? faceSadBigSvg
                      : faceSmileBigSvg}
                  </div>
                  <div class='mx-4 text-center'>
                    <div class='text-2xl text-neutral-content'>
                      <h4>Верно</h4>
                    </div>
                    <p class='text-success'>
                      <strong>{corrects.value}</strong>
                    </p>
                  </div>
                  <div class='text-center'>
                    <div class='text-2xl text-neutral-content'>
                      <h4>Ошибки</h4>
                    </div>
                    <p class='h2 text-error'>
                      <strong>{wrongStore.num}</strong>
                    </p>
                  </div>
                </div>
              )}
              {words && words.length < QUEST_NUM ? (
                <p>
                  Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                  знания
                </p>
              ) : (
                <div>
                  <button class='btn btn-sm btn-info mr-2' onClick$={setNewGame}>
                    {questionNum.value > QUEST_NUM ? "Еще раз" : "Старт"}
                  </button>
                  <span>
                    {questionNum.value > QUEST_NUM
                      ? `${resultWords.value} ${
                          wrongStore.answers.filter((x) => Boolean(x)).length > 0
                            ? "Нужно повторить "
                            : ""
                        } ${wrongStore.answers.filter((x) => Boolean(x)).join(", ")}`
                      : "Впишите нужные слова на время"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div class='flex justify-center'>
          {[...new Array(QUEST_NUM)].map((x, ind) => (
            <div
              key={ind}
              class={`badge mx-2 mb-2 border border-base-300 ${
                wrongStore.answers.length > ind
                  ? wrongStore.answers[ind]
                    ? "bg-error"
                    : "bg-success"
                  : start.value && questionNum.value === ind + 1
                  ? "bg-warning"
                  : "bg-neutral-content"
              }`}
            >
              {" "}
            </div>
          ))}
        </div>
      </div>
    )
  );
});

export const shakeCss = `
@keyframes shake {
  0% {
    margin-left: 0rem;
    border-color: rgb(251 113 133);
  }
  25% {
    margin-left: 0.5rem;
    border-color: rgb(251 113 133);
  }
  75% {
    margin-left: -0.5rem;
    border-color: rgb(251 113 133);
  }
  100% {
    margin-left: 0rem;
    border-color: rgb(251 113 133);
  }
}
`;
