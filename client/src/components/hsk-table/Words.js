import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { loadWords } from "../../actions/hskTable";
import WordsItem from "./WordsItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import WordsCard from "./WordsCard";
import TypingGame from "../userWords/TypingGame";
import HideButtons from "../hsk-table/HideButtons";
import FlipCardsGrid from "./FlipCardsGrid";
import TableOrCardsButtons from "./TableOrCardsButton";

const Words = ({ loadWords, words, wordsLoading }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    loadWords();
    // eslint-disable-next-line
  }, []);

  const [displayCards, setDisplayCards] = useState(false);

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
      <div className='col-sm-3'>
        <WordsCard />
      </div>

      <div className='col-sm-9'>
        <TypingGame words={words} testStarted={setTestStarted} />

        {!testStarted && (
          <Fragment>
            <TableOrCardsButtons setDisplayCards={setDisplayCards} displayCards={displayCards} />

            {displayCards ? (
              <FlipCardsGrid words={words} />
            ) : (
              <Fragment>
                <HideButtons hideFlag={hideFlag} onClick={onClick} />
                <table className='table table-hover table-responsive'>
                  <tbody>
                    {words.map((word) => (
                      <WordsItem key={word._id} lexicon={word} hideFlag={hideFlag} />
                    ))}
                  </tbody>
                </table>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};

Words.propTypes = {
  words: PropTypes.array.isRequired,
  loadWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  words: state.hskTable.words,
  wordsLoading: state.hskTable.wordsLoading,
});

export default connect(mapStateToProps, { loadWords })(Words);
