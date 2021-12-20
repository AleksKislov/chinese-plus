import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loadLexicon } from "../../actions/hskTable";
import PropTypes from "prop-types";

const TableCard = ({ loadLexicon }) => {
  const onClick = e => {
    const hsk_level = e.currentTarget.getElementsByTagName("a")[0].innerHTML.charAt(3);
    loadLexicon(hsk_level, 0);
    makeLinkActive(hsk_level - 1, "list-group-item-action");
  };

  const makeLinkActive = (item, class_name) => {
    const listItems = document.getElementsByClassName(class_name);
    const activeItem = document.getElementsByClassName("activeHSK");

    // if num === 0, then it is hsk item, == 1, => it is page item
    const num = class_name === "page-item" ? 1 : 0;
    activeItem[num].classList.remove("activeHSK");
    listItems[item].classList.add("activeHSK");
  };

  return (
    <div className='card bg-light mb-3'>
      <div className='card-body'>
        <h4 className='card-title'>Слова HSK</h4>
        <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>

        <p className='card-text'>
          Все 5000 слов HSK, отсортированные по уровням сложности: от 1 до 6.
        </p>
      </div>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item list-group-item-action activeHSK' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK1 <span className='badge badge-pill badge-warning float-right'>150</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK2 <span className='badge badge-pill badge-warning float-right'>150</span>
          </Link>
        </li>
        <li className='list-group-item  list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK3 <span className='badge badge-pill badge-warning float-right'>300</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK4 <span className='badge badge-pill badge-warning float-right'>600</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK5 <span className='badge badge-pill badge-warning float-right'>1300</span>
          </Link>
        </li>
        <li className='list-group-item list-group-item-action' onClick={e => onClick(e)}>
          <Link to='#!' className='card-link'>
            HSK6 <span className='badge badge-pill badge-warning float-right'>2500</span>
          </Link>
        </li>
      </ul>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item '>
          <Link to='#!' className='card-link'>
            Всего слов <span className='badge badge-pill badge-warning float-right'>5000</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

TableCard.propTypes = {
  loadLexicon: PropTypes.func.isRequired
};

export default connect(null, { loadLexicon })(TableCard);
