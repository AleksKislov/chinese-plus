import React, { useEffect, useState, Fragment } from "react";
import Head from "next/head";
import Layout from "../../components/layout/layout";
import consts from "../../constants/consts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faPlay } from "@fortawesome/free-solid-svg-icons";

const myAudioURL = process.env.myAudioURL;

const PinyinTests = () => {
  console.log("nnenen", myAudioURL);
  const { pinyinArr } = consts;

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  let [answers, setAnswers] = useState([]);

  const audioButtons = document.getElementsByClassName("btn-secondary");

  function refresh() {
    let answersArr = [];
    for (let i = 0; i < audioButtons.length; i++) {
      let randInd = Math.trunc(Math.random() * pinyinArr.length);

      answersArr.push(pinyinArr[randInd]);
      setAnswers(answersArr);
      //add random audio to buttons
      audioButtons[i].addEventListener("click", () => {
        const audio = new Audio(`${myAudioURL}pinyin/${pinyinArr[randInd]}.mp3`);
        audio.play();
      });

      //refresh its color
      audioButtons[i].style.backgroundColor = "#f0f0f0";
      audioButtons[i].style.color = "#555";
      audioButtons[i].style.borderColor = "#ced4da";
    }
  }

  const answerInput = document.getElementsByClassName("form-control");

  function checkAnswers() {
    for (let i = 0; i < answerInput.length; i++) {
      if (answerInput[i].value.trim().toLowerCase() === answers[i]) {
        answerInput[i].value = answerInput[i].value.trim();
        audioButtons[i].style.backgroundColor = "#2bad7e";
        audioButtons[i].style.color = "white";
        audioButtons[i].style.borderColor = "#2b8a67";
        answerInput[i].classList.remove("is-invalid");
        answerInput[i].classList.add("is-valid");
      } else if (answerInput[i].value === "") {
      } else {
        audioButtons[i].style.backgroundColor = "#c73636";
        audioButtons[i].style.color = "white";
        audioButtons[i].style.borderColor = "#b02323";
        answerInput[i].classList.remove("is-valid");
        answerInput[i].classList.add("is-invalid");
      }
    }
  }

  const showAllAnswers = () => {
    for (let i = 0; i < answerInput.length; i++) {
      answerInput[i].value = answers[i];
      audioButtons[i].style.backgroundColor = "#2bad7e";
      audioButtons[i].style.color = "white";
      audioButtons[i].style.borderColor = "#2b8a67";
      answerInput[i].classList.remove("is-invalid");
      answerInput[i].classList.add("is-valid");
    }
  };

  const answerButtons = (
    <div className='pinyinButtons'>
      <button
        type='button'
        className='btn btn-primary btn-sm'
        id='audioCheck'
        onClick={() => checkAnswers()}
        style={buttonStyle}
      >
        Проверка
      </button>
      <button
        type='button'
        className='btn btn-primary btn-sm'
        id='audioAnswers'
        onClick={() => showAllAnswers()}
        style={buttonStyle}
      >
        Показать Ответы
      </button>
      <button
        type='button'
        className='btn btn-primary btn-sm'
        id='audioButton'
        onClick={() => init()}
        style={buttonStyle}
      >
        <FontAwesomeIcon icon={faSyncAlt} />
      </button>
    </div>
  );

  return (
    <Fragment>
      <Head>
        <meta charSet='utf-8' />
        <title>Тесты на пиньинь | Chinese+</title>
      </Head>
      <Layout>
        <div className='row'>
          <div className='col-sm-3'>
            <div className='card border-primary mb-3'>
              <div className='card-body'>
                <h4 className='card-title'>Пиньинь</h4>
                <p className='card-text'>
                  Пиньинь - первое, чем нужно овладеть изучающим китайский язык.{" "}
                </p>
                <p className='card-text'>
                  Проверьте насколько хорошо вы понимаете на слух звуки и тоны китайского языка.
                </p>
              </div>
            </div>
          </div>
          <div className='col-sm-9'>
            <h3>Тест на владение пиньинем</h3>
            <small>
              Введите соответствующий пиньинь для аудио в виде [латынь][цифра], например,{" "}
              <span className='text-info'>huang2</span> или <span className='text-info'>lv4</span>
            </small>

            <div id='audio' className='questions row'>
              {Array.from({ length: 3 }).map((_, ind) => (
                <div className='col-sm-4' key={ind}>
                  {Array.from({ length: 4 }).map((_, ind) => (
                    <div className='input-group' key={ind}>
                      <button className='btn btn-secondary'>
                        <FontAwesomeIcon icon={faPlay} />
                      </button>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Введите пиньинь'
                      ></input>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {answerButtons}
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

const buttonStyle = {
  marginRight: "0.5rem",
};

export default PinyinTests;
