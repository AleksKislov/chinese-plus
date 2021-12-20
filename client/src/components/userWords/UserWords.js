import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadUserWords } from "../../actions/userWords";
import WordsItem from "../texts/WordsItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import WordModal from "../translation/WordModal";
import { Link } from "react-router-dom";
import TypingGame from "./TypingGame";
import Tippy from "@tippyjs/react";

const UserWords = ({ loadUserWords, words, wordsLoading }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false
  });

  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadUserWords();
    // eslint-disable-next-line
  }, []);

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

  return wordsLoading && words ? (
    <Spinner />
  ) : (
    <div className='row'>
      <WordModal />

      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Мой Лексикон</h4>
            <h6 className='card-subtitle mb-2 text-muted'>слова для повторения</h6>
            <p className='card-text'>
              Добавляйте сюда любые китайские слова из <Link to='/texts'>текстов</Link>,{" "}
              <Link to='/books'>книг</Link> и <Link to='/search'>словаря</Link>
            </p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <TypingGame words={words} testStarted={setTestStarted} />

        {!testStarted && (
          <table className='table table-hover table-responsive'>
            <thead>
              <tr className='table-info'>
                <th>
                  <Tippy placement='bottom' content='Скрыть иероглифы'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hideChinese(e)}
                    >
                      Иероглифы
                    </button>
                  </Tippy>
                </th>
                <th>
                  <Tippy placement='bottom' content='Скрыть пиньинь'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hidePinyin(e)}
                    >
                      Пиньинь
                    </button>
                  </Tippy>
                </th>
                <th style={{ width: "60%" }}>
                  <Tippy placement='bottom' content='Скрыть перевод'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hideFanyi(e)}
                    >
                      Перевод
                    </button>
                  </Tippy>
                </th>
                <th>Примеры</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {words.map(word => (
                <WordsItem key={word._id} lexicon={word} hideFlag={hideFlag} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

UserWords.propTypes = {
  words: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  words: state.userwords.userwords,
  wordsLoading: state.userwords.loading
});

export default connect(mapStateToProps, { loadUserWords })(UserWords);
