import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// import { loadLexicon, loadWords } from "../../actions/hskTable";
import TablePlate from "./TablePlate.js";
import Spinner from "../layout/Spinner";
import Pagination from "./Pagination";
import NewHskTableCard from "./TableCard";
import { Helmet } from "react-helmet";
import axios from "axios";

const NewHskTable = ({
  // loadLexicon,
  // loadWords,
  // lexicons,
  // loading,
  // words,
  isAuthenticated,
  match,
}) => {
  const [lexicons, setLexicons] = useState(null);
  const [level, setLevel] = useState("1");
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    loadLexicon(level, limit);
  }, [limit]);

  useEffect(() => {
    setLimit(0);

    if (match.params.level) {
      setLevel(match.params.level);
      loadLexicon(match.params.level, 0);
    } else {
      setLevel("1");
      loadLexicon(level, 0);
    }
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
  // }, [isAuthenticated]);

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Таблица слов HSK 3.0 | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <NewHskTableCard level={level} setLevel={setLevel} isOldHsk={false} isForTests={false} />
      </div>

      <div className='col-sm-9'>
        <Pagination level={level} setLimit={setLimit} curPage={limit} isOldHsk={false} />

        {!lexicons ? <Spinner /> : <TablePlate lexicons={lexicons} />}
      </div>
    </div>
  );
};

const mapPropsToState = (state) => ({
  // lexicons: state.hskTable.lexicons,
  // loading: state.hskTable.loading,
  // words: state.hskTable.words,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, {})(NewHskTable);
