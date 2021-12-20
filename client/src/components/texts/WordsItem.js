import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  removeWord,
  setModalWord,
  loadUserWordsLen,
  addWord,
  loadUserWords
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
  addWord
}) => {
  let { chinese, pinyin, translation, fromSearch } = lexicon;

  const [clicked, setClicked] = useState(false);

  const onClick = e => {
    // console.log(e.target.tagName);
    if (!fromSearch) {
      // const tagName = e.target.tagName;

      // if (tagName !== "BUTTON") {
      removeWord(chinese);

      setTimeout(() => {
        loadUserWordsLen();
      }, 100);
      // }
    }
  };

  let russian = parseRussian(translation);

  const showModal = e => {
    lexicon.russian = lexicon.translation;
    setModalWord(lexicon);
  };

  const updateVocabulary = async () => {
    if (!clicked) {
      setClicked(true);
      await addWord({
        pinyin: lexicon.pinyin,
        russian: lexicon.translation,
        chinese: lexicon.chinese
      });
      setTimeout(() => {
        loadUserWords();
        loadUserWordsLen();
      }, 100);
    }
  };

  const moreButton = (
    <button
      className='btn btn-sm btn-info'
      onClick={e => showModal(e)}
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
      {// for /search page
      fromSearch ? (
        <td>
          <button className='btn btn-sm btn-info' onClick={e => updateVocabulary(e)}>
            {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
          </button>
        </td>
      ) : (
        <td>
          <button className='btn btn-sm btn-warning' onClick={e => onClick(e)}>
            <i className='fas fa-trash-alt'></i>
          </button>
        </td>
      )}
    </tr>
  );
};

WordsItem.propTypes = {
  lexicon: PropTypes.object.isRequired,
  removeWord: PropTypes.func.isRequired
  // loadLengths: PropTypes.func.isRequired
};

export default connect(null, {
  removeWord,
  setModalWord,
  loadUserWordsLen,
  addWord,
  loadUserWords
})(WordsItem);
