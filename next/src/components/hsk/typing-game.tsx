import Image from "next/image";
import { useState, useEffect, KeyboardEvent } from "react";
import { shuffleArr } from "../../helpers/tools/shuffle-arr";
import { parseRussian } from "../../helpers/translation";
import { useInterval } from "../../helpers/ui";
import badImg from "../../../public/img/typing-game/001bad.png";
import okImg from "../../../public/img/typing-game/003ok.png";
import goodImg from "../../../public/img/typing-game/002positive.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faLevelDownAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

type TypingGameProps = {
  words: TestWord[] | null;
  testStarted: Function;
  level: string;
};

const QUEST_NUM = 10;

export default function TypingGame({ words, testStarted, level }: TypingGameProps) {
  const [shuffledWords, setShuffledWords] = useState<TestWord[] | null>(null);
  const [questionNum, setQuestionNum] = useState<number>(1);
  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    if (!words) return;
    testStarted(false);
    shuffleArr(words);
    const newArr = words.slice(0, QUEST_NUM);
    setShuffledWords(newArr);
    setQuestion(newArr[0]);
  }, [words]);

  const [resultWords, setResultWords] = useState("");
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState<TestWord | null>(null);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);

  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  useInterval(() => {
    if (!start) return;
    setProgress(progress + 0.5);
    if (progress >= 100) {
      skipQuestion();
    }
  }, 100);

  const setNewQuestion = () => {
    setProgress(0);
    setQuestion(shuffledWords![questionNum]);
    setQuestionNum(questionNum + 1);
  };

  const skipQuestion = () => {
    setWrongAnswers([...wrongAnswers, question!.chinese]);
    setNewQuestion();
    setWrong(wrong + 1);
  };

  useEffect(() => {
    if (questionNum > QUEST_NUM) {
      setResultWords(correct > 8 ? "Отличный результат!" : correct > 5 ? "Неплохо!" : "Н-да уж...");
      testStarted(false);
      setStart(false);
    }
  }, [questionNum]);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") checkIt();
  };

  const checkIt = () => {
    if (answer === question!.chinese) {
      setWrongAnswers([...wrongAnswers, ""]);
      setCorrect(correct + 1);
      setNewQuestion();
    }
    setAnswer("");
  };

  const setNewGame = () => {
    setWrongAnswers([]);
    setResultWords("");
    testStarted(true);
    setStart(true);
    setQuestion(null);
    setQuestionNum(1);
    setAnswer("");
    setCorrect(0);
    setWrong(0);
    setProgress(0);
    if (words) {
      shuffleArr(words);
      const newArr = words.slice(0, QUEST_NUM);
      setShuffledWords(newArr);
      setQuestion(newArr[0]);
    }
  };

  const gameDiv = (
    <div>
      <div className='float-end'>
        <button className='btn btn-danger btn-sm' onClick={skipQuestion}>
          Пропустить
        </button>
      </div>
      <h5 className='card-subtitle mb-2'>
        Вопрос {questionNum}/{QUEST_NUM}
      </h5>
      <p
        className='card-text text-sm'
        dangerouslySetInnerHTML={{
          __html: question ? parseRussian(question.translation, false) : "",
        }}
      ></p>
      <div className='row'>
        <div className='col-12'>
          <div className='input-group'>
            <input
              type='text'
              className='form-control'
              placeholder='Ответ на кит. языке'
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              onKeyDown={handleEnter}
              autoComplete='off'
            />
            <button className='btn btn-success' type='button' onClick={checkIt}>
              <FontAwesomeIcon icon={faLevelDownAlt} />
            </button>
          </div>
        </div>
      </div>
      <label className='ms-1 mt-1'>
        <FontAwesomeIcon icon={faCheckCircle} className='text-success' /> {correct}{" "}
        <FontAwesomeIcon icon={faTimesCircle} className='text-danger ms-2' /> {wrong}
      </label>
    </div>
  );

  return (
    shuffledWords && (
      <div className='card border-primary mb-3'>
        <div className='progress mx-1' style={{ height: "3px" }}>
          <div
            className='progress-bar bg-success'
            role='progressbar'
            style={{ width: `${100 - progress}%` }}
          ></div>
          <div
            className='progress-bar bg-danger'
            role='progressbar'
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className='card-body'>
          {start ? (
            gameDiv
          ) : (
            <div>
              <h4 className='card-title'>
                {questionNum > QUEST_NUM ? (
                  "Результат"
                ) : level ? (
                  <>
                    Успей напечатать <small className='text-muted'>[ур. {level}]</small>
                  </>
                ) : (
                  "Успей напечатать"
                )}
              </h4>
              {questionNum > QUEST_NUM && (
                <div className='row mb-3 text-center'>
                  <div className='col-sm-4'>
                    <div className='mt-2'>
                      <Image
                        width={64}
                        height={64}
                        src={correct > 8 ? goodImg : correct < 6 ? badImg : okImg}
                        alt='your result'
                      />
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <p className='card-text h5'>Верно</p>
                    <p className='card-text h2 text-success'>
                      <strong>{correct}</strong>
                    </p>
                  </div>
                  <div className='col-sm-4'>
                    <p className='card-text h5'>Ошибки</p>
                    <p className='card-text h2 text-danger'>
                      <strong>{wrong}</strong>
                    </p>
                  </div>
                </div>
              )}
              {words && words.length < QUEST_NUM ? (
                <p className='card-text'>
                  Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                  знания
                </p>
              ) : (
                <div>
                  <button className='btn btn-sm btn-info me-2' onClick={setNewGame}>
                    {questionNum > QUEST_NUM ? "Еще раз" : "Старт"}
                  </button>
                  <span className='card-text'>
                    {questionNum > QUEST_NUM
                      ? `${resultWords} ${
                          wrongAnswers.filter((x) => Boolean(x)).length > 0
                            ? "Нужно повторить "
                            : ""
                        } ${wrongAnswers.filter((x) => Boolean(x)).join(", ")}`
                      : "Проверьте насколько хорошо вы знаете эти слова. Впишите нужное китайское слово за 10 сек."}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='row d-flex justify-content-center'>
          {[...new Array(QUEST_NUM)].map((x, ind) => (
            <div
              key={ind}
              className={`col-1 badge rounded-pill ${
                wrongAnswers.length > ind
                  ? wrongAnswers[ind]
                    ? "bg-danger"
                    : "bg-success"
                  : "bg-secondary"
              }`}
            >
              {" "}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
