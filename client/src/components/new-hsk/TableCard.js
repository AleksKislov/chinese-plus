import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { hskInfo } from "../../constants/consts.json";
// import { loadLexicon } from "../../actions/hskTable";

const NewHskTableCard = ({ level, setLevel }) => {
  const bands = ["1", "2", "3", "4", "5", "6", "789"];
  const allWordsNum = bands.map((band) => hskInfo.bandSize[band]).reduce((prev, cur) => prev + cur);

  // const onClick = (e) => {
  //   const hsk_level = e.currentTarget.getElementsByTagName("a")[0].innerHTML.charAt(3);
  //   // loadLexicon(hsk_level, 0);
  //   makeLinkActive(hsk_level - 1, "list-group-item-action");
  // };

  // const makeLinkActive = (item, className) => {
  //   const listItems = document.getElementsByClassName(className);
  //   const activeItem = document.getElementsByClassName("activeHSK");

  //   // if num === 0, then it is hsk item, == 1, => it is page item
  //   const num = className === "page-item" ? 1 : 0;
  //   activeItem[num].classList.remove("activeHSK");
  //   listItems[item].classList.add("activeHSK");
  // };

  return (
    <div className='card bg-light mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Слова HSK 3.0</h4>
        <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>

        <p className='card-text'>
          Все слова нового HSK v3.0, отсортированные по уровням сложности (aka band): от 1 до 7-8-9
          (последние 3 уровня не разделяют).
        </p>
      </div>
      <ul className='list-group list-group-flush'>
        {bands.map((band) => (
          <li
            className={`list-group-item list-group-item-action ${
              level === band ? "activeHSK" : ""
            }`}
            onClick={(e) => setLevel(band)}
            key={band}
          >
            <Link to='#!' className='card-link'>
              Band {band}{" "}
              <span className='badge badge-pill badge-warning float-right'>
                {hskInfo.bandSize[band]}
              </span>
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
