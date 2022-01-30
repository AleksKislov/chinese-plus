import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  removeWord,
  setModalWord,
  loadUserWordsLen,
  addWord,
  loadUserWords,
} from "../../actions/userWords";
import { parseRussian } from "../../actions/helpers";
import { sanitizer } from "../../utils/sanitizer";

const WordsItem = ({
  removeWord,
  lexicon,
  hideFlag,
  setModalWord,
  loadUserWordsLen,
  loadUserWords,
  addWord,
  fromSearch,
  isAuthenticated,
  userWords,
}) => {
  const [clicked, setClicked] = useState(false);
  // const [russian, setRussian] = useState(" ");

  const { chinese, pinyin, translation } = lexicon;

  useEffect(() => {
    if (isAuthenticated) loadUserWords();
  }, [isAuthenticated]);

  const russian = parseRussian(translation);

  useEffect(() => {
    if (fromSearch && userWordsInclude(lexicon)) setClicked(true);
  }, [userWords]);

  function userWordsInclude({ chinese }) {
    return userWords.some((x) => x.chinese === chinese);
  }

  const trashWord = () => {
    if (fromSearch) return;

    removeWord(chinese);
    setTimeout(() => {
      loadUserWordsLen();
    }, 100);
  };

  const showModal = (e) => {
    lexicon.russian = lexicon.translation;
    setModalWord(lexicon);
  };

  const updateVocabulary = async (word) => {
    if (!word) return;

    if (clicked) {
      setClicked(false);
      await removeWord(word.chinese);
    } else {
      setClicked(true);
      await addWord({
        pinyin: lexicon.pinyin,
        russian: lexicon.translation,
        chinese: lexicon.chinese,
      });
    }
    setTimeout(() => {
      loadUserWords();
      loadUserWordsLen();
    }, 100);
  };

  const moreButton = (
    <button
      className='btn btn-sm btn-info'
      onClick={(e) => showModal(e)}
      data-toggle='modal'
      data-target='#exampleModal'
    >
      Больше
    </button>
  );

  return (
    <tr>
      <td>
        <h4>{!hideFlag.chinese && chinese}</h4>
      </td>
      <td>{!hideFlag.pinyin && pinyin}</td>
      <td
        dangerouslySetInnerHTML={{ __html: sanitizer(!hideFlag.translation ? russian : "") }}
      ></td>
      <td>{moreButton}</td>
      {
        // for /search page
        fromSearch ? (
          <td>
            <button
              className={`btn btn-sm btn-${clicked ? "warning" : "info"} mr-1`}
              onClick={(e) => updateVocabulary(lexicon)}
            >
              {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
            </button>
          </td>
        ) : (
          <td>
            <button className='btn btn-sm btn-warning' onClick={(e) => trashWord(e)}>
              <i className='fas fa-trash-alt'></i>
            </button>
          </td>
        )
      }
    </tr>
  );
};

WordsItem.propTypes = {
  lexicon: PropTypes.object.isRequired,
  removeWord: PropTypes.func.isRequired,
  // loadLengths: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userWords: state.userwords.userwords,
});

export default connect(mapStateToProps, {
  removeWord,
  setModalWord,
  loadUserWordsLen,
  addWord,
  loadUserWords,
})(WordsItem);
