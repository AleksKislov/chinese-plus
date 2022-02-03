import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeWord, loadLengths } from "../../actions/hskTable";
import { myAudioURL } from "../../constants/urls.json";

const WordsItem = ({ removeWord, lexicon, loadLengths, hideFlag }) => {
  let { word_id, chinese, pinyin, translation, level } = lexicon;

  const onClick = () => {
    removeWord(word_id);
    setTimeout(() => {
      loadLengths();
    }, 10);
  };

  const playIt = (word_id, level) => {
    switch (level) {
      case 1:
        word_id = parseInt(word_id) - 1;
        break;
      case 2:
        word_id = parseInt(word_id) - 1 - 150;
        break;
      case 3:
        word_id = parseInt(word_id) - 1 - 300;
        break;
      case 4:
        word_id = parseInt(word_id) - 1 - 600;
        break;
      case 5:
        word_id = parseInt(word_id) - 1 - 1200;
        break;
      case 6:
        word_id = parseInt(word_id) - 1 - 2500;
        break;
      default:
        break;
    }

    new Audio(`${myAudioURL}hsk${level}/${word_id}.mp3`).play();
    return false;
  };

  return (
    <tr>
      <td>
        <small>{word_id}</small>
      </td>
      <td>
        <h4>{!hideFlag.chinese && chinese}</h4>
      </td>
      <td>{!hideFlag.pinyin && pinyin}</td>
      <td>{!hideFlag.translation && translation}</td>
      <td>
        <button className='btn btn-sm btn-info' onClick={() => playIt(word_id, level)}>
          <i className='fas fa-play'></i>
        </button>
      </td>
      <td>
        <button className='btn btn-sm btn-warning' onClick={() => onClick()}>
          <i className='fas fa-trash-alt'></i>
        </button>
      </td>
    </tr>
  );
};

WordsItem.propTypes = {
  lexicon: PropTypes.object.isRequired,
  removeWord: PropTypes.func.isRequired,
  loadLengths: PropTypes.func.isRequired,
};

export default connect(null, { removeWord, loadLengths })(WordsItem);
