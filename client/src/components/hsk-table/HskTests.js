import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loadTestLexicon } from "../../actions/hskTable";
import PropTypes from "prop-types";
import { myAudioURL } from "../../constants/urls.json";
import { Helmet } from "react-helmet";

const HskTests = ({ lexicons, loadTestLexicon, loading }) => {
  const [level, setLevel] = useState("hsk1");

  let translationDiv = document.querySelector("#translation");
  let pinyinDiv = document.querySelector("#pinyin");
  let audioDiv = document.querySelector("#audio");

  useEffect(() => {
    loadTestLexicon(level.charAt(3));
    setTimeout(() => {
      if (!loading && translationDiv) {
        init();
      }
    }, 500);
  }, [loading, translationDiv]);

  const init = () => {
    view.displayQuestions(translationDiv, lexicons);
    view.displayOptions(translationDiv, lexicons);

    view.displayPinyinQuestions(pinyinDiv, lexicons);
    view.displayPinyinOptions(pinyinDiv, lexicons);

    view.displayAudioQuestionsAndOptions(audioDiv, lexicons);
  };

  const view = {
    //display random answer options including 1 correct answer
    displayOptions(objArr, questionsArr) {
      const formControls = objArr.getElementsByClassName("form-control");
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const questionBank = questionsArr.map(e => e.chinese);

      for (let i = 0; i < formControls.length; i++) {
        formControls[i].innerHTML = "<option>Выберите правильный вариант</option>";

        //grab innerText of question
        let question = inputGroupText[i].innerHTML;
        let rightIndex = questionBank.indexOf(question);

        //create arr for options and put right answer in
        let options = [];
        options.push(questionsArr[rightIndex].translation);

        //put other 4 options in
        for (let j = 1; j < 5; j++) {
          let randInd = Math.trunc(Math.random() * questionsArr.length);

          if (randInd !== rightIndex) {
            options.push(questionsArr[randInd].translation);
          }
        }

        model.shuffle(options);

        for (let k = 0; k < options.length; k++) {
          let elem = document.createElement("option");
          elem.innerHTML = options[k];
          formControls[i].appendChild(elem);
        }
      }
    },

    // display random questions for chinese characters
    displayQuestions(objArr, questionsArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");

      for (let i = 0; i < inputGroupText.length; i++) {
        inputGroupText[i].innerHTML =
          questionsArr[Math.trunc(Math.random() * questionsArr.length)].chinese;

        //refresh its color
        inputGroupText[i].style.backgroundColor = "#f0f0f0";
        inputGroupText[i].style.color = "#555";
        inputGroupText[i].style.borderColor = "#ced4da";
      }
    },

    // display random questions for pinyin
    displayPinyinQuestions(objArr, questionsArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");

      for (let i = 0; i < inputGroupText.length; i++) {
        inputGroupText[i].innerHTML =
          questionsArr[Math.trunc(Math.random() * questionsArr.length)].pinyin;

        //refresh its color
        inputGroupText[i].style.backgroundColor = "#f0f0f0";
        inputGroupText[i].style.color = "#555";
        inputGroupText[i].style.borderColor = "#ced4da";
      }
    },

    displayPinyinOptions(objArr, questionsArr) {
      const formControls = objArr.getElementsByClassName("form-control");
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const questionBank = questionsArr.map(e => e.pinyin);

      for (let i = 0; i < formControls.length; i++) {
        formControls[i].innerHTML = "<option>Выберите правильный вариант</option>";

        //grab innerText of question
        let question = inputGroupText[i].innerHTML;
        let rightIndex = questionBank.indexOf(question);

        //create arr for options and put right answer in
        let options = [];
        options.push(questionsArr[rightIndex].translation);

        //put other 4 options in
        for (let j = 1; j < 5; j++) {
          let randInd = Math.trunc(Math.random() * questionsArr.length);

          if (randInd !== rightIndex) {
            options.push(questionsArr[randInd].translation);
          }
        }

        model.shuffle(options);

        for (let k = 0; k < options.length; k++) {
          let elem = document.createElement("option");
          elem.innerHTML = options[k];
          formControls[i].appendChild(elem);
        }
      }
    },

    displayAudioQuestionsAndOptions(objArr, questionsArr) {
      const audioButtons = objArr.getElementsByClassName("btn-secondary");
      const formControls = objArr.getElementsByClassName("form-control");

      const arrLen = audioButtons.length;
      model.audioAnswers = [];
      let answers = [];

      for (let i = 0; i < arrLen; i++) {
        const randInd = Math.trunc(Math.random() * questionsArr.length);
        answers.push(randInd);

        audioButtons[i].outerHTML = audioButtons[i].outerHTML;

        // console.log("in view" + level);
        //add random audio to buttons
        audioButtons[i].addEventListener("click", () => {
          const audio = new Audio(myAudioURL + level + "/" + randInd + ".mp3");
          audio.play();
        });

        //refresh its color
        audioButtons[i].style.backgroundColor = "#f0f0f0";
        audioButtons[i].style.color = "#555";
        audioButtons[i].style.borderColor = "#ced4da";
      }

      model.audioAnswers = answers;

      //add options
      for (let i = 0; i < formControls.length; i++) {
        formControls[i].innerHTML = "<option>Выберите правильный вариант</option>";

        //right index
        let rightIndex = parseInt(answers[i]);

        //create arr for options and put right answer in
        let options = [];
        options.push(questionsArr[rightIndex].translation);

        //put other 4 options in
        for (let j = 1; j < 5; j++) {
          let randIndex = Math.trunc(Math.random() * questionsArr.length);

          if (randIndex !== rightIndex) {
            options.push(questionsArr[randIndex].translation);
          }
        }

        model.shuffle(options);

        for (let k = 0; k < options.length; k++) {
          let elem = document.createElement("option");
          elem.innerHTML = options[k];
          formControls[i].appendChild(elem);
        }
      }
    }
  };

  const model = {
    shuffle(arr) {
      for (let i = 0; i < arr.length; i++) {
        let randInd = Math.trunc(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[randInd];
        arr[randInd] = temp;
      }

      return arr;
    },

    audioAnswers: []
  };

  const controller = {
    checkTranslate(objArr, questionsArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const questionBank = questionsArr.map(e => e.chinese);
      const answerBank = questionsArr.map(e => e.translation);
      const formControls = objArr.getElementsByClassName("form-control");

      for (let i = 0; i < inputGroupText.length; i++) {
        let correctInd = questionBank.indexOf(inputGroupText[i].innerHTML);
        let answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;
        let answerInd = answerBank.indexOf(answer);

        if (formControls[i].selectedIndex !== 0) {
          if (correctInd === answerInd) {
            inputGroupText[i].style.backgroundColor = "#2bad7e";
            inputGroupText[i].style.color = "white";
            inputGroupText[i].style.borderColor = "#2b8a67";
          } else {
            inputGroupText[i].style.backgroundColor = "#c73636";
            inputGroupText[i].style.color = "white";
            inputGroupText[i].style.borderColor = "#b02323";
          }
        }
      }
    },

    checkPinyin(objArr, questionsArr) {
      const inputGroupText = objArr.getElementsByClassName("input-group-text");
      const questionBank = questionsArr.map(e => e.pinyin);
      const answerBank = questionsArr.map(e => e.translation);
      const formControls = objArr.getElementsByClassName("form-control");

      for (let i = 0; i < inputGroupText.length; i++) {
        let correctInd = questionBank.indexOf(inputGroupText[i].innerHTML);
        let answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;
        let answerInd = answerBank.indexOf(answer);

        if (formControls[i].selectedIndex !== 0) {
          if (correctInd === answerInd) {
            inputGroupText[i].style.backgroundColor = "#2bad7e";
            inputGroupText[i].style.color = "white";
            inputGroupText[i].style.borderColor = "#2b8a67";
          } else {
            inputGroupText[i].style.backgroundColor = "#c73636";
            inputGroupText[i].style.color = "white";
            inputGroupText[i].style.borderColor = "#b02323";
          }
        }
      }
    },

    checkAudio(objArr, questionsArr) {
      const answerBank = questionsArr.map(e => e.translation);
      const formControls = objArr.getElementsByClassName("form-control");
      const audioButtons = objArr.getElementsByClassName("btn-secondary");

      for (let i = 0; i < model.audioAnswers.length; i++) {
        let correctInd = model.audioAnswers[i];
        let answer = formControls[i].options[formControls[i].selectedIndex].innerHTML;
        let answerInd = answerBank.indexOf(answer);

        if (formControls[i].selectedIndex !== 0) {
          if (correctInd === answerInd) {
            audioButtons[i].style.backgroundColor = "#2bad7e";
            audioButtons[i].style.color = "white";
            audioButtons[i].style.borderColor = "#2b8a67";
          } else {
            audioButtons[i].style.backgroundColor = "#c73636";
            audioButtons[i].style.color = "white";
            audioButtons[i].style.borderColor = "#b02323";
          }
        }
      }
    }
  };

  const refreshButton = mycase => {
    switch (mycase) {
      case 1:
        view.displayQuestions(translationDiv, lexicons);
        view.displayOptions(translationDiv, lexicons);
        break;
      case 2:
        view.displayPinyinQuestions(pinyinDiv, lexicons);
        view.displayPinyinOptions(pinyinDiv, lexicons);
        break;
      case 3:
        window.location.reload(false);
        break;
      default:
        window.location.reload(false);
        break;
    }
  };

  const checkButton = mycase => {
    switch (mycase) {
      case 1:
        controller.checkTranslate(translationDiv, lexicons);

        break;
      case 2:
        controller.checkPinyin(pinyinDiv, lexicons);

        break;
      case 3:
        controller.checkAudio(audioDiv, lexicons);
        break;
      default:
        break;
    }
  };

  const onClick = e => {
    let hsk_level = e.currentTarget.getElementsByTagName("a")[0].innerHTML;

    setLevel(hsk_level.toLowerCase());
    loadTestLexicon(hsk_level.toLowerCase().charAt(3));
    makeLinkActive(Number(hsk_level.charAt(3)) - 1, "list-group-item-action");
  };

  const makeLinkActive = (item, class_name) => {
    const listItems = document.getElementsByClassName(class_name);
    const activeItem = document.getElementsByClassName("activeHSK");

    // if num === 0, then it is hsk item, == 1, => it is page item
    const num = class_name === "page-item" ? 1 : 0;
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
              onClick={e => onClick(e)}
            >
              <Link to='#!' className='card-link'>
                HSK1
              </Link>
            </li>
            <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
              <Link to='#!' className='card-link'>
                HSK2
              </Link>
            </li>
            <li className='list-group-item  list-group-item-action' onClick={e => onClick(e)}>
              <Link to='#!' className='card-link'>
                HSK3
              </Link>
            </li>
            <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
              <Link to='#!' className='card-link'>
                HSK4
              </Link>
            </li>
            <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
              <Link to='#!' className='card-link'>
                HSK5
              </Link>
            </li>
            <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
              <Link to='#!' className='card-link'>
                HSK6
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='col-sm-9'>
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
  marginRight: "0.5rem"
};

HskTests.propTypes = {
  lexicons: PropTypes.array.isRequired
};

const mapPropsToState = state => ({
  lexicons: state.hskTable.testLexicon,
  loading: state.hskTable.loading
});

export default connect(mapPropsToState, { loadTestLexicon })(HskTests);
