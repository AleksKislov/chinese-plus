import React, { useState, useEffect } from "react";
import { parseRussian, shuffleArr } from "../../actions/helpers";
import { useInterval } from "../../actions/customHooks";
import badImg from "../../img/typingGame/001bad.png";
import okImg from "../../img/typingGame/003ok.png";
import goodImg from "../../img/typingGame/002positive.png";
import Tippy from "@tippyjs/react";

const TypingGame = ({ words, testStarted }) => {
  const [shuffledWords, setShuffledWords] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [start, setStart] = useState(false);
  useEffect(() => {
    testStarted(false);
    setShuffledWords(shuffleArr(words).slice(0, 10));
    // setNewGame();
  }, [words]);

  useEffect(() => {
    if (shuffledWords) setQuestion(shuffledWords[0]);
  }, [shuffledWords]);

  const [resultWords, setResultWords] = useState("");
  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);

  const [wrongAnswers, setWrongAnswers] = useState([]);

  useInterval(() => {
    if (start) {
      setProgress(progress + 0.5);
      if (progress >= 100) {
        skipQuestion();
      }
    }
  }, 100);

  const setNewQuestion = () => {
    setProgress(0);
    setQuestion(shuffledWords[questionNum]);
    setQuestionNum(questionNum + 1);
  };

  const skipQuestion = () => {
    setWrongAnswers([...wrongAnswers, question.chinese]);
    setNewQuestion();
    setWrong(wrong + 1);
  };

  useEffect(() => {
    if (questionNum > 10) {
      setResultWords(correct > 8 ? "Отличный результат!" : correct > 5 ? "Неплохо!" : "Н-да уж...");
      testStarted(false);
      setStart(false);
    }
  }, [questionNum]);

  const handleEnter = e => {
    if (e.key === "Enter") checkIt();
  };

  const checkIt = e => {
    if (answer === question.chinese) {
      setWrongAnswers([...wrongAnswers, false]);
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
    setQuestion("");
    setQuestionNum(1);
    setAnswer("");
    setCorrect(0);
    setWrong(0);
    setProgress(0);
    setShuffledWords(shuffleArr(words).slice(0, 10));
    setQuestion(shuffledWords[0]);
  };

  const gameDiv = (
    <div className=''>
      <div className='float-right' style={{ position: "absolute", right: "1.8em" }}>
        <button className='btn btn-danger btn-sm' onClick={skipQuestion}>
          Пропустить
        </button>
      </div>
      <h5 className='card-subtitle mb-2'>Вопрос {questionNum}/10</h5>
      <p
        className='card-text text-sm'
        dangerouslySetInnerHTML={{ __html: question && parseRussian(question.translation) }}
      ></p>
      <div className='row'>
        <div className='col-11'>
          <input
            className='form-control'
            type='text'
            placeholder='Ответ на кит. языке'
            id='answer'
            onChange={e => setAnswer(e.target.value)}
            value={answer}
            onKeyDown={e => handleEnter(e)}
            autoComplete='off'
          />
        </div>
        <div className='col-1' style={{ paddingLeft: "0" }}>
          <button className='btn btn-success' onClick={checkIt}>
            <i className='fas fa-level-down-alt enter-icon'></i>
          </button>
        </div>
      </div>
      <label className='col-form-label ml-1' htmlFor='answer'>
        <i className='fas fa-check-circle text-success'></i> {correct}{" "}
        <i className='fas fa-times-circle text-danger'></i> {wrong}
      </label>
    </div>
  );

  return (
    shuffledWords && (
      <div className='card bg-light mb-3'>
        <div className='gameLines'>
          <div className='answerLineGreen answerLine' style={{ width: "100%" }}></div>
          <div className='answerLineRed answerLine' style={{ width: `${progress}%` }}></div>
        </div>

        <div className='card-body'>
          {start ? (
            gameDiv
          ) : (
            <div className=''>
              <h4 className='card-title'>{questionNum > 10 ? "Результат" : "Тест"}</h4>
              {questionNum > 10 && (
                <div className='row mb-3 text-center'>
                  <div className='col-sm-4'>
                    <div className='typing-img'>
                      <img
                        src={correct > 8 ? goodImg : correct < 6 ? badImg : okImg}
                        alt='result image'
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
              {words && words.length < 10 ? (
                <p className='card-text'>
                  Наберите хотя бы 10 слов в список ниже, чтобы активировать тест и проверить свои
                  знания
                </p>
              ) : (
                <div className=''>
                  <button className='btn btn-info mr-2' onClick={() => setNewGame()}>
                    {questionNum > 10 ? "Еще раз" : "Старт"}
                  </button>
                  <span className='card-text'>
                    {questionNum > 10
                      ? `${resultWords} ${
                          wrongAnswers.filter(x => x).length > 0 ? "Нужно повторить " : ""
                        } ${wrongAnswers.filter(x => x)}`
                      : "Проверьте насколько хорошо вы знаете слова ниже"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='row d-flex justify-content-center'>
          {new Array(10).fill(1).map((x, ind) => (
            <div
              key={ind}
              className={`col-1 questionColorDiv ${
                wrongAnswers.length > ind
                  ? wrongAnswers[ind]
                    ? "question-danger"
                    : "question-success"
                  : "question-grey"
              }`}
            ></div>
          ))}
        </div>
      </div>
    )
  );
};

export default TypingGame;
