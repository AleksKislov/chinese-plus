import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadLexicon, loadWords } from "../../actions/hskTable";
import TablePlate from "./TablePlate.js";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import Pagination from "../new-hsk/Pagination";
import NewHskTableCard from "../new-hsk/TableCard";

import { Helmet } from "react-helmet";

const HskTable = ({ loadLexicon, lexicons, loading, words, loadWords, isAuthenticated, match }) => {
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

  useEffect(() => {
    if (isAuthenticated) loadWords();
  }, [isAuthenticated]);

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Таблица слов HSK с озвучкой | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <NewHskTableCard level={level} setLevel={setLevel} isOldHsk={true} />
      </div>

      <div className='col-sm-9'>
        <Pagination level={level} setLimit={setLimit} curPage={limit} isOldHsk={true} />

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
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, { loadLexicon, loadWords })(HskTable);
