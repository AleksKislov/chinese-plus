import { shuffleArr } from '~/misc/helpers/tools/shuffle-arr';
import { arrorUturnDown } from '../common/media/svg';
import { type TestWord } from '~/routes/hsk/2/tests';
import {
  $,
  component$,
  useSignal,
  useStore,
  useTask$,
  type QwikKeyboardEvent,
  useStyles$,
} from '@builder.io/qwik';
import { TypingGameIndicators } from './typing-game-indicators';
import { TypingGameTitle } from './typing-game-title';
import { TypingGameResults } from './typing-game-results';

export type TypingGameProps = {
  words: TestWord[];
  level?: string;
};

export type WrongStore = {
  answers: string[];
};

export const QUEST_NUM = 10;

export const TypingGame = component$(({ words, level }: TypingGameProps) => {
  useStyles$(shakeCss);
  const start = useSignal(false);
  const progress = useSignal(0);
  const questionNum = useSignal(1);
  const shuffled = useStore({ words });
  const corrects = useSignal(0);
  const resultWords = useSignal('');
  const wrongStore = useStore<WrongStore>({ answers: [] });
  const question = useSignal(words[0]);
  const answer = useSignal('');
  const isWrong = useSignal(false);
  const isCorrect = useSignal(false);

  const setNewQuestion = $(() => {
    progress.value = 0;
    question.value = shuffled.words[questionNum.value];
    questionNum.value++;
    answer.value = '';
  });

  const skipQuestion = $(() => {
    wrongStore.answers.push(question.value.chinese);
    isWrong.value = true;
    setTimeout(() => (isWrong.value = false), 1000);
    setNewQuestion();
  });

  useTask$(({ track }) => {
    track(() => question.value);

    if (questionNum.value > QUEST_NUM) {
      resultWords.value =
        corrects.value > 8 ? 'Отличный результат!' : corrects.value > 5 ? 'Неплохо!' : 'Н-да уж...';
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
      wrongStore.answers.push('');
      setNewQuestion();
      isCorrect.value = true;
      setTimeout(() => (isCorrect.value = false), 1000);
      setTimeout(() => (answer.value = ''), 200);
    } else {
      isWrong.value = true;
      setTimeout(() => (isWrong.value = false), 1000);
      setTimeout(() => (answer.value = ''), 500);
    }
  });

  const setNewGame = $(() => {
    start.value = true;
    wrongStore.answers = [];
    resultWords.value = '';
    questionNum.value = 1;
    answer.value = '';
    corrects.value = 0;
    progress.value = 0;
    shuffleArr(words);
    const newArr = words.slice(0, QUEST_NUM);
    shuffled.words = newArr;
    question.value = newArr[0];
  });

  return (
    shuffled.words && (
      <div class="card bg-base-200 text-base-content w-full mb-6">
        <div class="card-body">
          {start.value ? (
            <div>
              <div class="float-right">
                <div
                  class="radial-progress text-error mr-3"
                  style={`--value:${progress.value}; --size:3rem;`}
                >
                  {Math.ceil(progress.value)}
                </div>

                <button class="btn btn-error btn-sm" onClick$={skipQuestion}>
                  Пропустить
                </button>
              </div>
              <div class="prose mb-3">
                <h4 class="card-title">
                  Вопрос {questionNum}/{QUEST_NUM}
                </h4>
              </div>
              <p class="text-sm mb-3" dangerouslySetInnerHTML={question.value?.translation}></p>

              <div class="form-control">
                <div class="input-group w-full ">
                  <input
                    type="text"
                    class={`input input-bordered w-full ${isCorrect.value ? `border-success` : ''}`}
                    style={isWrong.value ? `animation: shake 0.2s ease-in-out 0s 2` : ''}
                    placeholder="汉字"
                    bind:value={answer}
                    onKeyDown$={(e: QwikKeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') return setTimeout(checkIt);
                    }}
                    autoComplete="off"
                  />
                  <button class="btn btn-success" type="button" onClick$={checkIt}>
                    {arrorUturnDown}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <TypingGameTitle questionNum={questionNum.value} level={level} />
              <TypingGameResults
                wrongs={wrongStore.answers.filter(Boolean).length}
                corrects={corrects.value}
                questionNum={questionNum.value}
              />

              {words.length < QUEST_NUM ? (
                <p>
                  Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                  знания
                </p>
              ) : (
                <div class="mt-4">
                  <p>
                    {questionNum.value > QUEST_NUM
                      ? `${resultWords.value} ${
                          wrongStore.answers.filter(Boolean).length > 0 ? 'Нужно повторить ' : ''
                        } ${wrongStore.answers.filter(Boolean).join(', ')}`
                      : 'Впишите нужные слова на время'}
                  </p>
                  <button class="btn btn-sm btn-info mr-2 float-right" onClick$={setNewGame}>
                    {questionNum.value > QUEST_NUM ? 'Еще раз' : 'Старт'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <TypingGameIndicators wrongAnswers={wrongStore.answers} />
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
