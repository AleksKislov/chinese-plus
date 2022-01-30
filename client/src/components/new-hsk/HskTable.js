import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { loadLexicon, loadWords } from "../../actions/hskTable";
import TablePlate from "./TablePlate.js";
import Spinner from "../layout/Spinner";
import Pagination from "../hsk-table/Pagination";
import NewHskTableCard from "./TableCard";
import { Helmet } from "react-helmet";
import axios from "axios";

const NewHskTable = ({
  // loadLexicon,
  // loadWords,
  // lexicons,
  // loading,
  // words,
  // pagesNumber,
  isAuthenticated,
}) => {
  const [lexicons, setLexicons] = useState(null);
  const [level, setLevel] = useState("1");

  // const [lexicons, setLexicons] = useState(null);

  useEffect(() => {
    loadLexicon(level, 0);
    // eslint-disable-next-line
  }, [level]);

  async function loadLexicon(lvl, limit) {
    setLexicons(null);

    try {
      const { data } = await axios.get(`/api/newhskwords?hsk_level=${lvl}&limit=${limit}`);
      if (data.length > 0) setLexicons(data);
    } catch (err) {
      console.log(err);
    }
  }

  // useEffect(() => {
  //   if (isAuthenticated) loadWords();
  //   makeLinkActive(0);
  // }, [isAuthenticated, pagesNumber]);

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
        <title>Таблица слов HSK 3.0 | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <NewHskTableCard level={level} setLevel={setLevel} />
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
            <Pagination pagesNumber={1} />
          </ul>
        </div>

        {!lexicons ? <Spinner /> : <TablePlate lexicons={lexicons} />}
      </div>
    </div>
  );
};

const mapPropsToState = (state) => ({
  // lexicons: state.hskTable.lexicons,
  // loading: state.hskTable.loading,
  // words: state.hskTable.words,
  // pagesNumber: state.hskTable.pagesNumber,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, {})(NewHskTable);
