import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadLexicon, loadWords } from "../../actions/hskTable";
import TablePlate from "./TablePlate.js";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import Pagination from "./Pagination";
import TableCard from "./TableCard";
import { Helmet } from "react-helmet";

const HskTable = ({
  loadLexicon,
  lexicons,
  loading,
  words,
  loadWords,
  pagesNumber,
  isAuthenticated,
}) => {
  useEffect(() => {
    loadLexicon(1, 0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadWords();
    makeLinkActive(0);
  }, [isAuthenticated, pagesNumber]);

  const makeLinkActive = (activeInd) => {
    const items = document.getElementsByClassName("page-item");

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("active");
    }

    items[activeInd].classList.add("active");
  };

  const clickPage = (e) => {
    const hskLevel = document
      .getElementsByClassName("activeHSK")[0]
      .getElementsByTagName("a")[0]
      .innerHTML.charAt(3);

    const limit = Number(e.target.innerHTML) - 1;
    loadLexicon(hskLevel, limit);
    makeLinkActive(limit);
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
            onClick={(e) => clickPage(e)}
          >
            <li className='page-item active'>
              <a className='page-link' href='#!'>
                1
              </a>
            </li>
            <Pagination pagesNumber={pagesNumber} />
          </ul>
        </div>

        {loading && lexicons ? <Spinner /> : <TablePlate lexicons={lexicons} userWords={words} />}
      </div>
    </div>
  );
};

HskTable.propTypes = {
  lexicons: PropTypes.array.isRequired,
  loadLexicon: PropTypes.func,
  loading: PropTypes.bool,
  words: PropTypes.array.isRequired,
  loadWords: PropTypes.func.isRequired,
};

const mapPropsToState = (state) => ({
  lexicons: state.hskTable.lexicons,
  loading: state.hskTable.loading,
  words: state.hskTable.words,
  pagesNumber: state.hskTable.pagesNumber,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, { loadLexicon, loadWords })(HskTable);
