import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { hskInfo } from "../../constants/consts.json";
// import { loadLexicon } from "../../actions/hskTable";

const NewHskTableCard = ({ level, setLevel, isOldHsk }) => {
  const infoToUse = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;
  const cardText = isOldHsk
    ? "Все 5000 слов HSK, отсортированные по уровням сложности: от 1 до 6"
    : "Все слова нового HSK v3.0, отсортированные по уровням сложности (aka band): от 1 до 7-8-9 (последние 3 уровня не разделяют)";

  const levels = Object.keys(infoToUse);
  const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

  return (
    <div className='card bg-light mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Слова HSK 3.0</h4>
        <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>

        <p className='card-text'>{cardText}</p>
      </div>
      <ul className='list-group list-group-flush'>
        {levels.map((lvl) => (
          <li
            className={`list-group-item list-group-item-action ${level === lvl ? "activeHSK" : ""}`}
            onClick={(e) => setLevel(lvl)}
            key={lvl}
          >
            <Link to='#!' className='card-link'>
              {isOldHsk ? "HSK" : "Band"} {lvl}{" "}
              <span className='badge badge-pill badge-warning float-right'>{infoToUse[lvl]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item'>
          <Link to='#!' className='card-link'>
            Всего слов{" "}
            <span className='badge badge-pill badge-warning float-right'>{allWordsNum}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default connect(null, {})(NewHskTableCard);
