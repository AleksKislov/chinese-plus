import { shuffleArr } from "~/misc/helpers/tools/shuffle-arr";
import {
  $,
  type NoSerialize,
  component$,
  noSerialize,
  useSignal,
  useStore,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";
import HanziWriter from "hanzi-writer";
import { TypingGameIndicators } from "./typing-game-indicators";
import { TypingGameTitle } from "./typing-game-title";
import { type WrongStore, type TypingGameProps, QUEST_NUM } from "./typing-game";
import { TypingGameResults } from "./typing-game-results";

export const CalligraphyGame = component$(({ words, level }: TypingGameProps) => {
  const charSvgId = "charSvgId";
  const svgDivId = "svgDivId";
  const start = useSignal(false);
  const progress = useSignal(0);
  const questionNum = useSignal(1);
  const shuffled = useStore({ words });
  const corrects = useSignal(0);
  const resultWords = useSignal("");
  const wrongStore = useStore<WrongStore>({ answers: [] });
  const question = useSignal(words[0]);
  const hanziSignal = useSignal<NoSerialize<HanziWriter> | null>(null);
  const currentCharInd = useSignal(0);
  const wordFinished = useSignal(false);

  const setNewQuestion = $(() => {
    progress.value = 0;
    const wordLen = question.value.chinese.length;
    const isLastChar = wordLen - 1 === currentCharInd.value;
    wordFinished.value = false;
    if (isLastChar) {
      currentCharInd.value = 0;
      question.value = shuffled.words[questionNum.value];
      questionNum.value++;
    } else {
      currentCharInd.value++;
    }
  });

  const skipQuestion = $(() => {
    wrongStore.answers.push(question.value.chinese);
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

  useVisibleTask$(async ({ track }) => {
    const word = track(() => question.value);
    const charInd = track(() => currentCharInd.value);
    let char = "永";
    if (word) char = word.chinese[charInd];

    if (!hanziSignal.value) {
      hanziSignal.value = noSerialize(
        HanziWriter.create(charSvgId, char, {
          width: 300,
          height: 300,
          padding: 5,
          showCharacter: true,
          showOutline: false,
          showHintAfterMisses: 1,
          highlightOnComplete: true,
        })
      );
    } else {
      const charData = await HanziWriter.loadCharacterData(char).catch(console.log);
      const strokesNum = charData?.strokes?.length || 10;
      hanziSignal.value.setCharacter(char);
      hanziSignal.value.hideCharacter();
      hanziSignal.value.quiz({
        onComplete: (summary) => {
          const wordLen = word.chinese.length;
          const isLastChar = wordLen - 1 === charInd;
          const isCorrect = summary.totalMistakes / strokesNum < 0.3;

          if (isLastChar) wordFinished.value = true;

          if (isCorrect && isLastChar) {
            if (!wrongStore.answers.includes(word.chinese)) {
              corrects.value++;
              wrongStore.answers.push("");
            }
          } else {
            if (!wrongStore.answers.includes(word.chinese)) {
              wrongStore.answers.push(word.chinese);
            }
            console.log(wrongStore.answers);
          }

          setTimeout(setNewQuestion, 2000);
        },
      });
    }
  });

  const setNewGame = $(() => {
    wordFinished.value = false;
    start.value = true;
    wrongStore.answers = [];
    resultWords.value = "";
    questionNum.value = 1;
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
          <div class='grid grid-cols-1 md:grid-cols-2 gap-3'>
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
                <div class='flex mt-1'>
                  {[...question.value.chinese].map((char, ind) => (
                    <div
                      key={ind}
                      class='border border-info rounded-md mr-1 w-9 h-9 flex items-center justify-center'
                    >
                      {currentCharInd.value > ind || wordFinished.value ? char : ""}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <TypingGameTitle
                  questionNum={questionNum.value}
                  level={level}
                  isCalligraphy={true}
                />
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
                  <div class='mt-4'>
                    <p>
                      {questionNum.value > QUEST_NUM
                        ? `${resultWords.value} ${
                            wrongStore.answers.filter(Boolean).length > 0 ? "Нужно повторить " : ""
                          } ${wrongStore.answers.filter(Boolean).join(", ")}`
                        : "Нарисуйте нужные иероглифы на время"}
                    </p>
                    <button class='btn btn-sm btn-info mr-2 float-right' onClick$={setNewGame}>
                      {questionNum.value > QUEST_NUM ? "Еще раз" : "Старт"}
                    </button>
                  </div>
                )}
              </div>
            )}
            <div class='flex flex-col items-center' id={svgDivId}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='300'
                width='300'
                style={`background-color: #e5e5e5; opacity: .5`}
                viewBox='0 0 300 300'
                class='border border-gray-500'
                id={charSvgId}
              >
                <line x1='0' y1='0' x2='300' y2='300' stroke='#6b7280' />
                <line x1='300' y1='0' x2='0' y2='300' stroke='#6b7280' />
                <line x1='150' y1='0' x2='150' y2='300' stroke='#6b7280' />
                <line x1='0' y1='150' x2='300' y2='150' stroke='#6b7280' />
              </svg>
            </div>
          </div>
        </div>

        <TypingGameIndicators
          wrongAnswers={wrongStore.answers}
          questionNum={questionNum.value}
          isStarted={start.value}
        />
      </div>
    )
  );
});
