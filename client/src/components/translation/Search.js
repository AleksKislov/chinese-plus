import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
// import axios from "axios";
import WordsItem from "../texts/WordsItem";
import WordModal from "../translation/WordModal";
import { markUpRussianText, segmenter, getWords } from "../../actions/helpers";
import {
  // puppeteerFunc,
  addWord,
  removeWord,
  loadUserWords,
  loadUserWordsLen,
  setModalEditWord,
} from "../../actions/userWords";
import HanziWriter from "hanzi-writer";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import { Helmet } from "react-helmet";
import "react-chat-widget/lib/styles.css";
import { sanitizer } from "../../utils/sanitizer";
import WordEditModal from "./WordEditModal";
// import "./style.css";
// import { Widget, addResponseMessage } from "react-chat-widget";

const writerSettings = {
  width: 60,
  height: 60,
  padding: 0,
  showOutline: true,
  radicalColor: "#168F16",
  delayBetweenLoops: 3000,
};

const Search = ({
  history,
  match,
  addWord,
  loadUserWords,
  loadUserWordsLen,
  isAuthenticated,
  userWords,
  removeWord,
  setModalEditWord,
  modalWordToEdit,
  // dictResponse
  // puppeteerFunc
}) => {
  const [clicked, setClicked] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [wordFromSearch, setWordFromSearch] = useState(null);
  const [wordsFromSearch, setWordsFromSearch] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  useEffect(() => {
    if (match.params.chinese) {
      document.getElementById("searchInput").value = match.params.chinese;
      showSearchResult();
    }
    // console.log("汉语是世界上最难学的一个语言");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userWords && wordFromSearch && userWordsInclude(wordFromSearch)) {
      setClicked(true);
    }
  }, [userWords, wordFromSearch]);

  function userWordsInclude({ chinese }) {
    return userWords.some((x) => x.chinese === chinese);
  }

  useEffect(() => {
    if (isAuthenticated) loadUserWords();
  }, [isAuthenticated]);

  const showSearchResult = async () => {
    setClicked(false);
    const words = document.getElementById("searchInput").value.trim();
    const showCharDiv = document.getElementById("showCharDiv");
    showCharDiv.innerHTML = "";

    if (!words.length) return history.push(`/search`);

    history.push(`/search/${words}`);
    setSearchLoading(true);

    const isChinese =
      /\p{Script=Han}/u.test(words) && !(/[а-яА-ЯЁё]/.test(words) || /[A-Za-z0-9]/.test(words));

    if (!isChinese) {
      showCharDiv.innerHTML =
        "<p class='text-danger'>Пока поддерживается только китайско-русский перевод, приносим извинения за неудобства.</p>";
      setWordFromSearch(null);
      setWordsFromSearch(null);
      return setSearchLoading(false);
    }

    [...words].forEach((word) => {
      const writer = HanziWriter.create("showCharDiv", word, writerSettings);
      writer.loopCharacterAnimation();
    });

    let allwords = await segmenter(words);
    allwords = allwords.filter((word) => /\p{Script=Han}/u.test(word));
    const wordsFromDB = await getWords(allwords);

    const newArr = allwords.map((word) => {
      for (let i = 0; i < wordsFromDB.length; i++) {
        if (word === wordsFromDB[i].chinese) return wordsFromDB[i];
      }
      return word;
    });

    if (newArr.length === 1) {
      setWordFromSearch(newArr[0]);
      setWordsFromSearch(null);
      // await puppeteerFunc(newArr[0].chinese);
      // console.log(dictResponse);
    } else {
      setWordFromSearch(null);
      setWordsFromSearch(newArr);
    }
    setSearchLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    showSearchResult();
  };

  const showMoreButton = () => {
    const examples = document.getElementsByClassName("tippyExsShow");

    if (showExamples) {
      Array.from(examples).forEach((el) => {
        el.classList.add("tippyExs");
      });
      setShowExamples(false);
    } else {
      Array.from(examples).forEach((el) => {
        el.classList.remove("tippyExs");
      });
      setShowExamples(true);
    }
  };

  const hideChinese = (e) => {
    setHideFlag({
      chinese: !hideFlag.chinese,
      translation: hideFlag.translation,
      pinyin: hideFlag.pinyin,
    });
    e.target.innerHTML = !hideFlag.chinese ? "Скрыто" : "Иероглифы";
  };

  const hidePinyin = (e) => {
    setHideFlag({
      pinyin: !hideFlag.pinyin,
      translation: hideFlag.translation,
      chinese: hideFlag.chinese,
    });
    e.target.innerHTML = !hideFlag.pinyin ? "Скрыто" : "Пиньинь";
  };

  const hideFanyi = (e) => {
    setHideFlag({
      translation: !hideFlag.translation,
      chinese: hideFlag.chinese,
      pinyin: hideFlag.pinyin,
    });
    e.target.innerHTML = !hideFlag.translation ? "Скрыто" : "Перевод";
  };

  const updateVocabulary = async (word) => {
    if (!word) return;

    if (clicked) {
      setClicked(false);
      await removeWord(word.chinese);
    } else {
      setClicked(true);
      await addWord(word);
    }
    setTimeout(() => {
      loadUserWords();
      loadUserWordsLen();
    }, 100);
  };

  // const handleNewUserMessage = async (msg) => {
  //   try {
  //     const { data } = await axios.get("/gcloud/dialogflow?text=" + msg);
  //     if (data) addResponseMessage(data.response);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Китайско-русский словарь | Chinese+</title>
      </Helmet>
      <WordEditModal />

      <div className='row'>
        <div className='col-sm-8'>
          <div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className='form-group'>
                <h3 className='control-label'>Китайско-русский словарь</h3>
                <label>
                  <i>
                    база данных с{" "}
                    <a href='https://bkrs.info/' target='_blank' rel='noopener noreferrer'>
                      БКРС
                    </a>
                  </i>
                </label>
                <div className='form-group'>
                  <div className='input-group mb-3'>
                    <input
                      type='text'
                      className='form-control'
                      id='searchInput'
                      placeholder='汉字。。。'
                      autoComplete='off'
                    />
                    <div className='input-group-append' id='searchButton'>
                      <button className='btn btn-primary' type='submit'>
                        <i className='fas fa-search'></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className='col-sm-4'>
          {
            // <div className='card text-white bg-primary mb-3'>
            //   <div className='card-body'>
            //     <h4 className='card-title'>Чат с AI</h4>
            //     <p className='card-text'>
            //       Внизу справа - чат с AI. Поддерживаемые темы будут расширяться.
            //     </p>
            //   </div>
            // </div>
          }
        </div>
      </div>

      <div id='showCharDiv'></div>

      {!searchLoading ? (
        <div id='searchResultDiv'>
          {wordFromSearch && (
            <Fragment>
              <Fragment>
                <Tippy
                  content={
                    clicked ? (
                      <span>Убрать слово из вокабуляра</span>
                    ) : (
                      <span>Добавить слово в вокабуляр</span>
                    )
                  }
                >
                  <button
                    className={`btn btn-sm btn-${clicked ? "warning" : "info"}`}
                    onClick={() => updateVocabulary(wordFromSearch)}
                  >
                    {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
                  </button>
                </Tippy>

                <Tippy
                  content={<span>{showExamples ? "Скрыть примеры" : "Показать примеры"}</span>}
                >
                  <button
                    className='btn btn-sm btn-info mx-1'
                    id='showMoreButton'
                    onClick={showMoreButton}
                  >
                    {showExamples ? "Меньше" : "Больше"}
                  </button>
                </Tippy>

                <Tippy content={<span>Отредактировать слово</span>}>
                  <button
                    className='btn btn-sm btn-warning'
                    onClick={() => setModalEditWord(wordFromSearch)}
                    data-toggle='modal'
                    data-target='#editWordModal'
                  >
                    <i className='far fa-edit'></i>
                  </button>
                </Tippy>
              </Fragment>

              {wordFromSearch && (
                <h4 className='mt-2'>
                  {wordFromSearch.chinese} {wordFromSearch.pinyin}
                </h4>
              )}

              <div
                className='mb-3'
                dangerouslySetInnerHTML={{
                  __html:
                    wordFromSearch && sanitizer(markUpRussianText(wordFromSearch.russian, true)),
                }}
              ></div>
            </Fragment>
          )}

          {wordsFromSearch && (
            <Fragment>
              <WordModal />

              <table className='table table-hover mb-3'>
                <thead>
                  <tr className='table-info'>
                    <th>
                      <button
                        type='button'
                        className='btn btn-light btn-sm'
                        onClick={(e) => hideChinese(e)}
                      >
                        Иероглифы
                      </button>
                    </th>
                    <th>
                      <button
                        type='button'
                        className='btn btn-light btn-sm'
                        onClick={(e) => hidePinyin(e)}
                      >
                        Пиньинь
                      </button>
                    </th>
                    <th style={{ width: "60%" }}>
                      <button
                        type='button'
                        className='btn btn-light btn-sm'
                        onClick={(e) => hideFanyi(e)}
                      >
                        Перевод
                      </button>
                    </th>
                    <th>Примеры</th>
                    <th>Изучать</th>
                  </tr>
                </thead>
                <tbody>
                  {wordsFromSearch.map((word) => (
                    <WordsItem
                      key={word._id}
                      lexicon={{
                        chinese: word.chinese,
                        pinyin: word.pinyin,
                        translation: word.russian,
                      }}
                      fromSearch={true}
                      hideFlag={hideFlag}
                    />
                  ))}
                </tbody>
              </table>
            </Fragment>
          )}
        </div>
      ) : (
        <Spinner />
      )}

      {
        // <Widget
        //   handleNewUserMessage={handleNewUserMessage}
        //   title='AI-чат Buyilehu'
        //   subtitle='Пообщайтесь с AI на китайском'
        //   senderPlaceHolder='Ваше сообщение...'
        // />
      }
    </Fragment>
  );
};

Search.propTypes = {};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userWords: state.userwords.userwords,
  modalWordToEdit: state.userwords.modalWordToEdit,
  // dictResponse: state.userwords.dictResponse
});

export default connect(mapStateToProps, {
  loadUserWords,
  loadUserWordsLen,
  addWord,
  removeWord,
  setModalEditWord,
  // puppeteerFunc
})(Search);
