import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadTestLexicon, setLoading } from "../../actions/hskTable";
import { myAudioURL } from "../../constants/urls.json";
import { Helmet } from "react-helmet";
import TypingGame from "../userWords/TypingGame";
import TableCard from "./TableCard";

const NewHskTests = ({ lexicons, loadTestLexicon, loading, setLoading }) => {
  const [level, setLevel] = useState("1");
  const [audioAnswers, setAudioAnswers] = useState([]);
  const [pinyinAnswers, setPinyinAnswers] = useState([]);
  const [translationAnswers, setTranslationAnswers] = useState([]);

  const translationDiv = document.querySelector("#translation");
  const pinyinDiv = document.querySelector("#pinyin");
  const audioDiv = document.querySelector("#audio");

  const questProps = {
    chinese: "chinese",
    pinyin: "pinyin",
  };

  const MAX_OPTIONS = 5;

  const init = () => {
    View.displayCharQuestions(translationDiv);
    View.displayPinyinQuestions(pinyinDiv);
    View.displayAudioQuestions(audioDiv);
  };

  const View = {
    /**
     * @param {string} prop - "chinese" or "pinyin"
     * @returns {function}
     */
    displayAbstractQuestions(prop) {
      return (objArr) => {
        const inputGroupText = objArr.getElementsByClassName("input-group-text");
        const formControls = objArr.getElementsByClassName("form-control");
        const answers = [];

        for (let i = 0; i < inputGroupText.length; i++) {
          const randInd = Math.trunc(Math.random() * lexicons.length);
          answers.push(lexicons[randInd]);
          inputGroupText[i].innerHTML = answers[i][prop];
          this.setColor.default(inputGroupText[i]);
        }

        if (prop === questProps.chinese) setTranslationAnswers(answers);
        if (prop === questProps.pinyin) setPinyinAnswers(answers);

        this.displayOptions(formControls, answers);
      };
    },

    /**
     * @param {Array} formControls - array of nodes
     * @param {Array<{word_id,level,chinese,pinyin,translation}>} answers
     */
    displayOptions(formControls, answers) {
      for (let i = 0; i < formControls.length; i++) {
        formControls[i].innerHTML = "<option>Выберите правильный вариант</option>";

        // create arr for options and put right answer in
        const options = [];
        const rightAnswer = answers[i].translation;
        options.push(rightAnswer);

        while (options.length < MAX_OPTIONS) {
          const randInd = Math.trunc(Math.random() * lexicons.length);
          const option = lexicons[randInd].translation;
          const alreadyExists = options.includes(option);
          if (option !== rightAnswer && !alreadyExists) options.push(option);
        }

        shuffle(options);

        for (let k = 0; k < options.length; k++) {
          const elem = document.createElement("option");
          elem.innerHTML = options[k];
          formControls[i].appendChild(elem);
        }
      }
    },

    // display random questions for chinese characterss
    displayCharQuestions(objArr) {
      this.displayAbstractQuestions(questProps.chinese)(objArr);
    },

    // display random questions for pinyin
    displayPinyinQuestions(objArr) {
      this.displayAbstractQuestions(questProps.pinyin)(objArr);
    },

    displayAudioQuestions(objArr) {
      const audioButtons = objArr.getElementsByClassName("btn-secondary");
      const formControls = objArr.getElementsByClassName("form-control");

      const arrLen = audioButtons.length;
      let answers = [];

      for (let i = 0; i < arrLen; i++) {
        const randInd = Math.trunc(Math.random() * lexicons.length);
        answers.push(lexicons[randInd]);

        audioButtons[i].outerHTML = audioButtons[i].outerHTML;

        const firstIdPerLvl = {
          1: 0,
          2: 150,
          3: 300,
          4: 600,
          5: 1200,
          6: 2500,
        };

        // add random audio to buttons
        audioButtons[i].addEventListener("click", () => {
          const audio = new Audio(
            `${myAudioURL}hsk${level}/${answers[i].word_id - 1 - firstIdPerLvl[level]}.mp3`
          );
          audio.play();
        });

        this.setColor.default(audioButtons[i]);
      }

      setAudioAnswers(answers);

      // add options
      this.displayOptions(formControls, answers);
    },

    setColor: {
      red(elem) {
        elem.style.backgroundColor = "#c73636";
        elem.style.color = "white";
        elem.style.borderColor = "#b02323";
      },

      green(elem) {
        elem.style.backgroundColor = "#2bad7e";
        elem.style.color = "white";
        elem.style.borderColor = "#2b8a67";
      },

      default(elem) {
        elem.style.backgroundColor = "#f0f0f0";
        elem.style.color = "#555";
        elem.style.borderColor = "#ced4da";
      },
    },
  };

  function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
      let randInd = Math.trunc(Math.random() * arr.length);
      let temp = arr[i];
      arr[i] = arr[randInd];
      arr[randInd] = temp;
    }
  }

  const Controller = {
    checkTranslate(objArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const formControls = objArr.getElementsByClassName("form-control");

      for (let i = 0; i < inputGroupText.length; i++) {
        const answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;

        if (formControls[i].selectedIndex === 0) continue;

        if (answer === translationAnswers[i].translation) {
          View.setColor.green(inputGroupText[i]);
        } else {
          View.setColor.red(inputGroupText[i]);
        }
      }
    },

    checkPinyin(objArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const formControls = objArr.getElementsByClassName("form-control");

      for (let i = 0; i < inputGroupText.length; i++) {
        const answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;

        if (formControls[i].selectedIndex === 0) continue;

        if (answer === pinyinAnswers[i].translation) {
          View.setColor.green(inputGroupText[i]);
        } else {
          View.setColor.red(inputGroupText[i]);
        }
      }
    },

    checkAudio(objArr) {
      const formControls = objArr.getElementsByClassName("form-control");
      const audioButtons = objArr.getElementsByClassName("btn-secondary");

      for (let i = 0; i < audioAnswers.length; i++) {
        const correctInd = audioAnswers[i];
        const answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;

        if (formControls[i].selectedIndex === 0) continue;

        if (correctInd.translation === answer) {
          View.setColor.green(audioButtons[i]);
        } else {
          View.setColor.red(audioButtons[i]);
        }
      }
    },
  };

  const refreshButton = (num) => {
    switch (num) {
      case 1:
        View.displayCharQuestions(translationDiv);
        break;
      case 2:
        View.displayPinyinQuestions(pinyinDiv);
        break;
      default:
        window.location.reload(false);
        break;
    }
  };

  const checkButton = (num) => {
    switch (num) {
      case 1:
        return Controller.checkTranslate(translationDiv);
      case 2:
        return Controller.checkPinyin(pinyinDiv);
      case 3:
        return Controller.checkAudio(audioDiv);
    }
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тесты на слова HSK 3.0 | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <TableCard level={level} setLevel={setLevel} isOldHsk={false} isForTests={true} />
      </div>

      <div className='col-sm-9'>
        <TypingGame words={lexicons} testStarted={() => {}} level={level} />

        <p>пока только игра "Успей напечатать". Другие тесты добавим чуть позже</p>
      </div>
    </div>
  );
};

const buttonStyle = {
  marginRight: "0.5rem",
};

const mapPropsToState = (state) => ({
  lexicons: state.hskTable.testLexicon,
  loading: state.hskTable.loading,
});

export default connect(mapPropsToState, { loadTestLexicon, setLoading })(NewHskTests);