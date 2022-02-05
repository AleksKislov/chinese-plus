import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { hskInfo } from "../../constants/consts.json";
import CardInfo from "./CardInfo";
// import { loadLexicon } from "../../actions/hskTable";

const NewHskTableCard = ({ level, setLevel, isOldHsk, isForTests }) => {
  const infoToUse = isOldHsk ? hskInfo.oldLevelSize : hskInfo.bandSize;

  const levels = Object.keys(infoToUse);
  const allWordsNum = levels.map((lvl) => infoToUse[lvl]).reduce((prev, cur) => prev + cur);

  return (
    <div className='card bg-light mb-3'>
      <CardInfo isForTests={isForTests} isOldHsk={isOldHsk} />

      <ul className='list-group list-group-flush'>
        {levels.map((lvl) => (
          <li
            className={`list-group-item list-group-item-action ${level === lvl ? "activeHSK" : ""}`}
            key={lvl}
          >
            <Link to={lvl} className='card-link' onClick={(e) => setLevel(lvl)}>
              {isOldHsk ? "HSK" : "Band"} {lvl}{" "}
              <span className='badge badge-pill badge-warning float-right'>{infoToUse[lvl]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item'>
          <span className='text-success'>
            Всего слов{" "}
            <span className='badge badge-pill badge-warning float-right'>{allWordsNum}</span>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default connect(null, {})(NewHskTableCard);
