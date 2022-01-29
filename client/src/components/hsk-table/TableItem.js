import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addWord, removeWord, loadLengths } from "../../actions/hskTable";
import { myAudioURL } from "../../constants/urls.json";

const TableItem = ({ addWord, lexicon, selected, removeWord, loadLengths, hideFlag }) => {
  let { word_id, level, chinese, pinyin, translation } = lexicon;

  const onClick = (e) => {
    if (selected) {
      removeWord(word_id);
      setTimeout(() => {
        loadLengths();
      }, 100);
    } else {
      addWord({ word_id, level, chinese, pinyin, translation });
      setTimeout(() => {
        loadLengths();
      }, 100);
    }
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
    <tr className={selected ? "table-active" : ""}>
      <td>{word_id}</td>
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
        <button
          className={selected ? "btn btn-sm btn-warning" : "btn btn-sm btn-info"}
          onClick={(e) => onClick(e)}
        >
          {selected ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
        </button>
      </td>
    </tr>
  );
};

TableItem.propTypes = {
  lexicon: PropTypes.object.isRequired,
  addWord: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  removeWord: PropTypes.func.isRequired,
};

export default connect(null, { addWord, removeWord, loadLengths })(TableItem);
