import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { loadWords } from "../../actions/hskTable";
import { Helmet } from "react-helmet";
import axios from "axios";
import SearchForm from "../hsk-table/SearchForm";
import TablePlate from "./TablePlate.js";

const SearchNewHSK = ({ isAuthenticated }) => {
  const [lexicons, setLexicons] = useState(null);
  const [chineseWord, setChineseWord] = useState("");

  useEffect(() => {
    // if (isAuthenticated) loadWords();
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLexicons(null);

    if (chineseWord) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        const body = JSON.stringify({ chinese: chineseWord });
        const { data } = await axios.post("/api/newhskwords/search", body, config);
        if (data.length > 0) setLexicons(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Поиск слов HSK 3.0 | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <div className='card border-primary mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Поиск слов HSK 3.0</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>

            <p className='card-text'>
              Найдите нужные вам слова нового HSK 3.0
              <br />1 band - 500 слов
              <br />2 band - 772 слова
              <br />3 band - 973 слова
              <br />4 band - 1000 слов
              <br />5 band - 1071 слово
              <br />6 band - 1140 слов
              <br />
              7,8,9 bands - 5636 слов
            </p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <SearchForm onSubmit={onSubmit} setChineseWord={setChineseWord} />

        {lexicons && <TablePlate lexicons={lexicons} />}
      </div>
    </div>
  );
};

const mapPropsToState = (state) => ({
  // words: state.hskTable.words,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, {})(SearchNewHSK);
