import React, { useEffect, useState, Fragment } from "react";
import Head from "next/head";
import Layout from "../components/layout/layout";
import consts from "../constants/consts";

const myAudioURL = process.env.myAudioURL;

const PinyinTests = () => {
  console.log("nnenen", myAudioURL);
  const { pinyinArr } = consts;

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  let [answers, setAnswers] = useState([]);

  function init() {
    // display layout
    const audioId = document.getElementById("audio");
    audioId.innerHTML = "";
    // answers = [];
    setAnswers([]);

    let column = document.createElement("div");
    column.setAttribute("class", "col-sm-4");

    let column2 = document.createElement("div");
    column2.setAttribute("class", "col-sm-4");

    let column3 = document.createElement("div");
    column3.setAttribute("class", "col-sm-4");

    let quantityOfquestions = 12;

    function createCol(col) {
      for (let index = 0; index < quantityOfquestions / 3; index++) {
        let questionForm = document.createElement("div");
        questionForm.setAttribute("class", "input-group");
        questionForm.innerHTML =
          '<button class="btn btn-secondary"><i class="fas fa-play"></i></button><input type="text" class="form-control" placeholder="Введите пиньинь">';
        col.appendChild(questionForm);
      }
    }

    createCol(column);
    createCol(column2);
    createCol(column3);

    audioId.appendChild(column);
    audioId.appendChild(column2);
    audioId.appendChild(column3);

    refresh();
  }

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
              <div className='col-sm-4'>
                <div className='input-group'></div>
              </div>
              <div className='col-sm-4'>
                <div className='input-group'></div>
              </div>
              <div className='col-sm-4'>
                <div className='input-group'></div>
              </div>
            </div>

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
                <i className='fas fa-sync-alt'></i>
              </button>
            </div>
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
