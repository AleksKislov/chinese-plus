import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadTestLexicon, setLoading } from "../../actions/hskTable";
import PropTypes from "prop-types";
import { myAudioURL } from "../../constants/urls.json";
import { Helmet } from "react-helmet";
import TypingGame from "../userWords/TypingGame";

const HskTests = ({ lexicons, loadTestLexicon, loading, setLoading, match }) => {
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

  useEffect(() => {
    if (match.params.level) {
      setLevel(match.params.level);
      loadTestLexicon(match.params.level);
      makeLinkActive(Number(match.params.level) - 1, "list-group-item-action");
    } else {
      setLevel("1");
      loadTestLexicon("1");
      makeLinkActive(0, "list-group-item-action");
    }
    setTimeout(() => {
      if (!loading && translationDiv) init();
    });
  }, [loading, level, translationDiv]);

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

  const changeHskLevel = (e) => {
    const hskLevel = e.currentTarget.getElementsByTagName("a")[0].innerHTML;
    setLoading();
    setLevel(hskLevel.charAt(3));
    loadTestLexicon(hskLevel.charAt(3));
  };

  const makeLinkActive = (item, className) => {
    const listItems = document.getElementsByClassName(className);
    const activeItem = document.getElementsByClassName("activeHSK");

    // if num === 0, then it is hsk item, == 1, => it is page item
    const num = className === "page-item" ? 1 : 0;
    activeItem[num].classList.remove("activeHSK");
    listItems[item].classList.add("activeHSK");
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Тесты на слова HSK | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>HSK Quizes</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Короткие тесты</h6>
            <p className='card-text'>
              Проверьте насколько хорошо вы знаете лексику HSK для разных уровней сложности.
              Проверка на иероглифы, пиньинь и слух.
            </p>
          </div>
          <ul className='list-group list-group-flush'>
            <li
              className='list-group-item list-group-item-action activeHSK'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='1' className='card-link'>
                HSK1
              </Link>
            </li>
            <li
              className='list-group-item list-group-item-action'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='2' className='card-link'>
                HSK2
              </Link>
            </li>
            <li
              className='list-group-item  list-group-item-action'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='3' className='card-link'>
                HSK3
              </Link>
            </li>
            <li
              className='list-group-item list-group-item-action'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='4' className='card-link'>
                HSK4
              </Link>
            </li>
            <li
              className='list-group-item list-group-item-action'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='5' className='card-link'>
                HSK5
              </Link>
            </li>
            <li
              className='list-group-item list-group-item-action'
              onClick={(e) => changeHskLevel(e)}
            >
              <Link to='6' className='card-link'>
                HSK6
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='col-sm-9'>
        <TypingGame words={lexicons} testStarted={() => {}} level={level} />

        <h3>Выберите подходящий вариант для...</h3>

        <div id='translation' className='questions'>
          <h5>... иероглифов</h5>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='translationCheck'
            onClick={() => checkButton(1)}
            style={buttonStyle}
          >
            Проверить
          </button>
          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='translationButton'
            onClick={() => refreshButton(1)}
          >
            <i className='fas fa-sync-alt'></i>
          </button>
        </div>

        <hr />

        <div id='pinyin' className='questions'>
          <h5>... пиньиня</h5>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <div className='input-group-text'>@</div>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='pinyinCheck'
            onClick={() => checkButton(2)}
            style={buttonStyle}
          >
            Проверить
          </button>

          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='pinyinButton'
            onClick={() => refreshButton(2)}
          >
            <i className='fas fa-sync-alt'></i>
          </button>
        </div>

        <hr />

        <div id='audio' className='questions'>
          <h5>... аудио</h5>

          <div className='input-group'>
            <button className='btn btn-secondary'>
              <i className='fas fa-play'></i>
            </button>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <button className='btn btn-secondary'>
              <i className='fas fa-play'></i>
            </button>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <button className='btn btn-secondary'>
              <i className='fas fa-play'></i>
            </button>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <button className='btn btn-secondary'>
              <i className='fas fa-play'></i>
            </button>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <div className='input-group'>
            <button className='btn btn-secondary'>
              <i className='fas fa-play'></i>
            </button>

            <select className='form-control'>
              <option>Выберите правильный вариант</option>
            </select>
          </div>

          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='audioCheck'
            onClick={() => checkButton(3)}
            style={buttonStyle}
          >
            Проверить
          </button>

          <button
            type='button'
            className='btn btn-primary btn-sm'
            id='audioButton'
            onClick={() => refreshButton(3)}
          >
            <i className='fas fa-sync-alt'></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  marginRight: "0.5rem",
};

HskTests.propTypes = {
  lexicons: PropTypes.array.isRequired,
};

const mapPropsToState = (state) => ({
  lexicons: state.hskTable.testLexicon,
  loading: state.hskTable.loading,
});

export default connect(mapPropsToState, { loadTestLexicon, setLoading })(HskTests);
