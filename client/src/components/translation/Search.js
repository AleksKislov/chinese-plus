import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import WordsItem from "../texts/WordsItem";
import WordModal from "../translation/WordModal";
import {
  // puppeteerFunc,
  addWord,
  // removeWord,
  loadUserWords,
  loadUserWordsLen
} from "../../actions/userWords";
import HanziWriter from "hanzi-writer";
import Spinner from "../layout/Spinner";
import Tippy from "@tippyjs/react";
import { Helmet } from "react-helmet";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import "./style.css";
import { sanitizer } from "../../utils/sanitizer";

const Search = ({
  history,
  match,
  addWord,
  loadUserWords,
  loadUserWordsLen,
  isAuthenticated
  // dictResponse
  // puppeteerFunc
}) => {
  useEffect(() => {
    if (match.params.chinese) {
      document.getElementById("searchInput").value = match.params.chinese;
      showSearchResult();
    }
    // console.log("汉语是世界上最难学的一个语言");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadUserWords();
  }, [isAuthenticated]);

  const [clicked, setClicked] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [wordFromSearch, setWordFromSearch] = useState(null);
  const [wordsFromSearch, setWordsFromSearch] = useState(null);
  const [showExamples, setShowExamples] = useState(true);
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false
  });

  const getWords = async words => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    let res;
    try {
      res = await axios.post("/api/dictionary/allwords", words, config);
    } catch (err) {
      console.log(err);
    }
    return res.data;
  };

  const showSearchResult = async () => {
    setSearchLoading(true);

    const searchedWords = document.getElementById("searchInput");

    let words = searchedWords.value.trim();
    if (words.length === 0) {
      history.push(`/search`);
    } else {
      history.push(`/search/${words}`);
    }

    const showCharDiv = document.getElementById("showCharDiv");
    showCharDiv.innerHTML = "";

    const segmenter = async text => {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      let res;
      try {
        res = await axios.post("/api/dictionary/segmenter", { text }, config);
      } catch (err) {
        console.log(err);
      }
      return res.data;
    };

    if (/\p{Script=Han}/u.test(words) && !(/[а-яА-ЯЁё]/.test(words) || /[A-Za-z0-9]/.test(words))) {
      for (let i = 0; i < words.length; i++) {
        const writer = HanziWriter.create("showCharDiv", words[i], {
          width: 60,
          height: 60,
          padding: 0,
          showOutline: true,
          radicalColor: "#168F16",
          delayBetweenLoops: 3000
        });
        writer.loopCharacterAnimation();
      }
    } else {
      showCharDiv.innerHTML =
        "<p class='text-danger'>Пока поддерживается только китайско-русский перевод, приносим извинения за неудобства.</p>";
      setSearchLoading(false);
      return;
    }

    // searchedWords.value = "";

    let allwords = await segmenter(words);
    allwords = allwords.filter(word => /\p{Script=Han}/u.test(word));

    const wordsFromDB = await getWords(allwords);

    // console.log(wordsFromDB);
    let newArr = allwords.map(word => {
      for (let i = 0; i < wordsFromDB.length; i++) {
        if (word === wordsFromDB[i].chinese) {
          return wordsFromDB[i];
        }
      }
      return word;
    });

    // console.log({ newArr });
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

  const onSubmit = async e => {
    e.preventDefault();
    showSearchResult();
  };

  const markUpRussianText = text => {
    if (text) {
      return text
        .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, "")
        .replace(/\[b\]/g, "<span class='tippyBold'>")
        .replace(/\[\/b\]/g, "</span>")
        .replace(/\[c\]/g, "<span class='tippyColor'>")
        .replace(/\[\/c\]/g, "</span>")
        .replace(/\[p\]/g, "<span class='tippyColor tippyItalic'>")
        .replace(/\[\/p\]/g, "</span>")
        .replace(/\[i\]/g, "<span class='tippyItalic'>")
        .replace(/\[\/i\]/g, "</span>")
        .replace(/\[m1\]/g, "<span class='tippyParagraph'>")
        .replace(/\[m\d\]/g, "<span class='tippyExample'>")
        .replace(/\[\/m\]/g, "</span>")
        .replace(/\[\*\]\[ex\]/g, "<div class='tippyExsShow'>")
        .replace(/\[\/ex\]\[\/\*\]/g, "</div>")
        .replace(/\\\[(.{1,})\\\]/g, "($1)")
        .replace(/\[ref\]/g, "<span class='text-info'>")
        .replace(/\[\/ref\]/g, "</span>");
    } else {
      return " ";
    }
  };

  const showMoreButton = () => {
    const examples = document.getElementsByClassName("tippyExsShow");

    if (showExamples) {
      Array.from(examples).forEach(el => {
        el.classList.add("tippyExs");
      });
      setShowExamples(false);
    } else {
      Array.from(examples).forEach(el => {
        el.classList.remove("tippyExs");
      });
      setShowExamples(true);
    }
  };

  const hideChinese = e => {
    setHideFlag({
      chinese: !hideFlag.chinese,
      translation: hideFlag.translation,
      pinyin: hideFlag.pinyin
    });
    e.target.innerHTML = !hideFlag.chinese ? "Скрыто" : "Иероглифы";
  };

  const hidePinyin = e => {
    setHideFlag({
      pinyin: !hideFlag.pinyin,
      translation: hideFlag.translation,
      chinese: hideFlag.chinese
    });
    e.target.innerHTML = !hideFlag.pinyin ? "Скрыто" : "Пиньинь";
  };

  const hideFanyi = e => {
    setHideFlag({
      translation: !hideFlag.translation,
      chinese: hideFlag.chinese,
      pinyin: hideFlag.pinyin
    });
    e.target.innerHTML = !hideFlag.translation ? "Скрыто" : "Перевод";
  };

  const updateVocabulary = async word => {
    // console.log(word);
    if (!clicked) {
      setClicked(true);
      await addWord(word);
      setTimeout(() => {
        loadUserWords();
        loadUserWordsLen();
      }, 100);
    }
  };

  const handleNewUserMessage = async newMessage => {
    // console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API

    let res;
    try {
      res = await axios.get("/api/dialogflow?text=" + newMessage);

      if (res) {
        // console.log(res.data.response);
        addResponseMessage(res.data.response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Китайско-русский словарь | Chinese+</title>
      </Helmet>

      <div className='row'>
        <div className='col-sm-8'>
          <div>
            <form onSubmit={e => onSubmit(e)}>
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
          <div className='card text-white bg-primary mb-3'>
            <div className='card-body'>
              <h4 className='card-title'>Чат с AI</h4>
              <p className='card-text'>
                Внизу справа - чат с AI. Поддерживаемые темы будут расширяться.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id='showCharDiv'></div>

      {!searchLoading ? (
        <div id='searchResultDiv'>
          {wordFromSearch && (
            <Fragment>
              <Fragment>
                <Tippy content={<span>Добавить слово в вокабуляр</span>}>
                  <button
                    className='btn btn-sm btn-info mr-1'
                    onClick={() => updateVocabulary(wordFromSearch)}
                  >
                    {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
                  </button>
                </Tippy>

                <Tippy
                  content={<span>{showExamples ? "Скрыть примеры" : "Показать примеры"}</span>}
                >
                  <button
                    className='btn btn-sm btn-warning'
                    id='showMoreButton'
                    onClick={showMoreButton}
                  >
                    {showExamples ? "Меньше" : "Больше"}
                  </button>
                </Tippy>

                {
                  // for pulling audio using puppeteer from another site
                  //   dictResponse && (
                  //   <button
                  //     className='btn btn-sm btn-warning ml-2'
                  //     dangerouslySetInnerHTML={{
                  //       __html: dictResponse
                  //     }}
                  //   ></button>
                  // )
                }
              </Fragment>

              <h4 className='mt-2'>{wordFromSearch && wordFromSearch.pinyin}</h4>
              <div
                className='mb-3'
                dangerouslySetInnerHTML={{
                  __html: wordFromSearch && sanitizer(markUpRussianText(wordFromSearch.russian))
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
                        onClick={e => hideChinese(e)}
                      >
                        Иероглифы
                      </button>
                    </th>
                    <th>
                      <button
                        type='button'
                        className='btn btn-light btn-sm'
                        onClick={e => hidePinyin(e)}
                      >
                        Пиньинь
                      </button>
                    </th>
                    <th style={{ width: "60%" }}>
                      <button
                        type='button'
                        className='btn btn-light btn-sm'
                        onClick={e => hideFanyi(e)}
                      >
                        Перевод
                      </button>
                    </th>
                    <th>Примеры</th>
                    <th>Изучать</th>
                  </tr>
                </thead>
                <tbody>
                  {wordsFromSearch.map(word => (
                    <WordsItem
                      key={word._id}
                      lexicon={{
                        chinese: word.chinese,
                        pinyin: word.pinyin,
                        translation: word.russian,
                        fromSearch: true
                      }}
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

      <Widget
        handleNewUserMessage={handleNewUserMessage}
        title='AI-чат Buyilehu'
        subtitle='Пообщайтесь с AI на китайском'
        senderPlaceHolder='Ваше сообщение...'
      />
    </Fragment>
  );
};

Search.propTypes = {};

const mapStateToProps = state => ({
  loading: state.userwords.loading,
  isAuthenticated: state.auth.isAuthenticated
  // dictResponse: state.userwords.dictResponse
});

export default connect(mapStateToProps, {
  loadUserWords,
  loadUserWordsLen,
  addWord
  // puppeteerFunc
})(Search);
