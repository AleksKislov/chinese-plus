import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadLexicon, loadWords } from "../../actions/hskTable";
import TableItem from "./TableItem";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import Pagination from "./Pagination";
import TableCard from "./TableCard";
import { Helmet } from "react-helmet";
import Tippy from "@tippyjs/react";

const HskTable = ({
  loadLexicon,
  lexicons,
  loading,
  words,
  loadWords,
  pagesNumber,
  isAuthenticated
}) => {
  useEffect(() => {
    loadLexicon(1, 0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadWords();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false
  });

  const makeLinkActive = (item, class_name) => {
    const listItems = document.getElementsByClassName(class_name);
    const activeItem = document.querySelector(".pagination").getElementsByClassName("active");

    // console.log(activeItem);
    // if num === 0, then it is hsk item, == 1, => it is page item
    // const num = class_name === "page-item" ? 1 : 0;
    activeItem[0].classList.remove("active");
    listItems[item].classList.add("active");
  };

  const clickPage = e => {
    const hsk_level = document
      .getElementsByClassName("activeHSK")[0]
      .getElementsByTagName("a")[0]
      .innerHTML.charAt(3);

    // console.log(hsk_level);

    const limit = Number(e.target.innerHTML) - 1;
    loadLexicon(hsk_level, limit);
    makeLinkActive(limit, "page-item");
  };

  const hideChinese = e => {
    setHideFlag({
      chinese: !hideFlag.chinese,
      translation: hideFlag.translation,
      pinyin: hideFlag.pinyin
    });
    e.target.innerHTML = !hideFlag.chinese ? "Скрыто" : "Иероглифы";
  };

  const hidePinyin = e => {
    setHideFlag({
      pinyin: !hideFlag.pinyin,
      translation: hideFlag.translation,
      chinese: hideFlag.chinese
    });
    e.target.innerHTML = !hideFlag.pinyin ? "Скрыто" : "Пиньинь";
  };

  const hideFanyi = e => {
    setHideFlag({
      translation: !hideFlag.translation,
      chinese: hideFlag.chinese,
      pinyin: hideFlag.pinyin
    });
    e.target.innerHTML = !hideFlag.translation ? "Скрыто" : "Перевод";
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Таблица слов HSK с озвучкой | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <TableCard />
      </div>

      <div className='col-sm-9'>
        <div>
          <ul
            className='pagination justify-content-center pagination-sm'
            onClick={e => clickPage(e)}
          >
            <li className='page-item active'>
              <a className='page-link' href='#!'>
                1
              </a>
            </li>
            <Pagination pagesNumber={pagesNumber} />
          </ul>
        </div>

        {loading && lexicons ? (
          <Spinner />
        ) : (
          <table className='table table-hover table-responsive'>
            <thead>
              <tr className='table-info'>
                <th>#</th>
                <th>
                  <Tippy placement='bottom' content='Скрыть иероглифы'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hideChinese(e)}
                    >
                      Иероглифы
                    </button>
                  </Tippy>
                </th>
                <th>
                  <Tippy placement='bottom' content='Скрыть пиньинь'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hidePinyin(e)}
                    >
                      Пиньинь
                    </button>
                  </Tippy>
                </th>
                <th style={{ width: "70%" }}>
                  <Tippy placement='bottom' content='Скрыть перевод'>
                    <button
                      type='button'
                      className='btn btn-light btn-sm'
                      onClick={e => hideFanyi(e)}
                    >
                      Перевод
                    </button>
                  </Tippy>
                </th>
                <th>
                  <div className='text-center'>
                    <i className='fas fa-headphones'></i>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {lexicons.map(lexicon => (
                <TableItem
                  key={lexicon._id}
                  lexicon={lexicon}
                  selected={words.some(word => word.word_id === lexicon.word_id)}
                  hideFlag={hideFlag}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

HskTable.propTypes = {
  lexicons: PropTypes.array.isRequired,
  loadLexicon: PropTypes.func,
  loading: PropTypes.bool,
  words: PropTypes.array.isRequired,
  loadWords: PropTypes.func.isRequired
};

const mapPropsToState = state => ({
  lexicons: state.hskTable.lexicons,
  loading: state.hskTable.loading,
  words: state.hskTable.words,
  pagesNumber: state.hskTable.pagesNumber,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapPropsToState, { loadLexicon, loadWords })(HskTable);
