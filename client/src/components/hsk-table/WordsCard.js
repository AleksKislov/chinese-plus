import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loadWords, loadWordsByLevel, loadLengths } from "../../actions/hskTable";
import PropTypes from "prop-types";

const WordsCard = ({ loadWords, loadWordsByLevel, allWordsLen, hskLen }) => {
  const onClick = e => {
    let hsk_level = e.currentTarget.getElementsByTagName("a")[0];
    if (hsk_level) {
      hsk_level = hsk_level.innerHTML.charAt(3);

      if (parseInt(hsk_level)) {
        loadWordsByLevel(hsk_level);
      } else {
        hsk_level = 7;
        loadWords();
      }

      makeLinkActive(hsk_level - 1);
    }
  };

  const makeLinkActive = item => {
    const listItems = document.getElementsByClassName("list-group-item-action");
    const activeItem = document.getElementsByClassName("activeHSK");

    if (activeItem[0]) activeItem[0].classList.remove("activeHSK");

    listItems[item].classList.add("activeHSK");
  };

  return (
    <div className='card bg-light mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Мой HSK</h4>
        <h6 className='card-subtitle mb-2 text-muted'>лексика HSK для повторения</h6>
        <p className='card-text'>
          Добавляйте сюда любые слова из <Link to='/hsk-table'>списков</Link> HSK, чтобы повторить
          их отдельно.
        </p>
      </div>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK1 <span className='badge badge-pill badge-warning float-right'>{hskLen[0]}</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK2 <span className='badge badge-pill badge-warning float-right'>{hskLen[1]}</span>
          </Link>
        </li>
        <li className='list-group-item  list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK3 <span className='badge badge-pill badge-warning float-right'>{hskLen[2]}</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK4 <span className='badge badge-pill badge-warning float-right'>{hskLen[3]}</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK5 <span className='badge badge-pill badge-warning float-right'>{hskLen[4]}</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK6 <span className='badge badge-pill badge-warning float-right'>{hskLen[5]}</span>
          </Link>
        </li>

        <li className='list-group-item list-group-item-action activeHSK' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            Все слова{" "}
            <span className='badge badge-pill badge-warning float-right'>{allWordsLen}</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

WordsCard.propTypes = {
  loadWords: PropTypes.func.isRequired,
  loadWordsByLevel: PropTypes.func.isRequired,
  allWordsLen: PropTypes.number.isRequired,
  hskLen: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  allWordsLen: state.hskTable.allWordsLen,
  hskLen: state.hskTable.hskLen
});

export default connect(mapStateToProps, { loadWords, loadWordsByLevel, loadLengths })(WordsCard);
