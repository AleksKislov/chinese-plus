import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { loadUserWords } from "../../actions/userWords";
import WordsItem from "../texts/WordsItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";
import { Link } from "react-router-dom";
import TypingGame from "./TypingGame";
// import Tippy from "@tippyjs/react";
import { users } from "../../constants/consts.json";
import HideButtons from "../hsk-table/HideButtons";

const UserWords = ({ loadUserWords, words, wordsLoading }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const [allWordsLen, setAllWordsLen] = useState(0);

  useEffect(() => {
    if (words && Array.isArray(words)) setAllWordsLen(words.length);
  }, [words]);

  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadUserWords();
    // eslint-disable-next-line
  }, []);

  const onClick = (e) => {
    const id = e.target.id;

    if (id === "ru") {
      setHideFlag({
        translation: !hideFlag.translation,
        chinese: hideFlag.chinese,
        pinyin: hideFlag.pinyin,
      });
    }
    if (id === "py") {
      setHideFlag({
        pinyin: !hideFlag.pinyin,
        translation: hideFlag.translation,
        chinese: hideFlag.chinese,
      });
    }
    if (id === "cn") {
      setHideFlag({
        chinese: !hideFlag.chinese,
        translation: hideFlag.translation,
        pinyin: hideFlag.pinyin,
      });
    }
  };

  return wordsLoading && words ? (
    <Spinner />
  ) : (
    <div className='row'>
      <WordModal />
      <WordEditModal />

      <div className='col-sm-3'>
        <div className='card border-primary mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Мой Лексикон</h4>
            <h6 className='card-subtitle mb-2 text-muted'>слова для повторения</h6>
            <p className='card-text'>
              Добавляйте сюда любые китайские слова из <Link to='/texts'>текстов</Link>,{" "}
              <Link to='/books'>книг</Link> и <Link to='/search'>словаря</Link>
            </p>
          </div>
          <ul className='list-group list-group-flush'>
            <li className='list-group-item list-group-item-action'>
              <Link to='#!' className='card-link'>
                Все слова{" "}
                <span className='badge badge-pill badge-warning float-right'>
                  {allWordsLen} / {users.vocabSize}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='col-sm-9'>
        <TypingGame words={words} testStarted={setTestStarted} />

        {!testStarted && (
          <Fragment>
            <HideButtons hideFlag={hideFlag} onClick={onClick} />

            <table className='table table-hover table-responsive'>
              <thead style={{ visibility: "collapse" }}>
                <tr>
                  <th style={{ width: "15%" }}></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {words.map((word) => (
                  <WordsItem key={word._id} lexicon={word} hideFlag={hideFlag} />
                ))}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>
    </div>
  );
};

UserWords.propTypes = {
  words: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  words: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
});

export default connect(mapStateToProps, { loadUserWords })(UserWords);
