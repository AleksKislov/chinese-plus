import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadWords } from "../../actions/hskTable";
import WordsItem from "./WordsItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import WordsCard from "./WordsCard";
import Tippy from "@tippyjs/react";
import TypingGame from "../userWords/TypingGame";

const Words = ({ loadWords, words, wordsLoading }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false
  });
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadWords();
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
      <div className='col-sm-3'>
        <WordsCard />
      </div>

      <div className='col-sm-9'>
        <TypingGame words={words} testStarted={setTestStarted} />

        {!testStarted && (
          <table className='table table-hover table-responsive'>
            <thead>
              <tr className='table-info'>
                <th>#</th>
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
                <th style={{ width: "70%" }}>
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
                <th>
                  <div className='text-center'>
                    <i className='fas fa-headphones'></i>
                  </div>
                </th>
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

Words.propTypes = {
  words: PropTypes.array.isRequired,
  loadWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  words: state.hskTable.words,
  wordsLoading: state.hskTable.wordsLoading
});

export default connect(mapStateToProps, { loadWords })(Words);
