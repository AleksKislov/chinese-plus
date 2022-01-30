import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadWords } from "../../actions/hskTable";
import { Helmet } from "react-helmet";
import axios from "axios";
import TablePlate from "./TablePlate.js";

const SearchHSK = ({ words, loadWords, isAuthenticated }) => {
  const [lexicons, setLexicons] = useState(null);
  const [chineseWord, setChineseWord] = useState("");

  useEffect(() => {
    if (isAuthenticated) loadWords();
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLexicons(null);

    if (!chineseWord) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const body = JSON.stringify({ chinese: chineseWord });
      const { data } = await axios.post("/api/lexicon/search", body, config);
      if (data.length > 0) setLexicons(data);
    } catch (err) {
      console.log(err);
    }
  };

  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const hideChinese = (e) => {
    setHideFlag({
      chinese: !hideFlag.chinese,
      translation: hideFlag.translation,
      pinyin: hideFlag.pinyin,
    });
    e.target.innerHTML = !hideFlag.chinese ? "Скрыто" : "Иероглифы";
  };

  const hidePinyin = (e) => {
    setHideFlag({
      pinyin: !hideFlag.pinyin,
      translation: hideFlag.translation,
      chinese: hideFlag.chinese,
    });
    e.target.innerHTML = !hideFlag.pinyin ? "Скрыто" : "Пиньинь";
  };

  const hideFanyi = (e) => {
    setHideFlag({
      translation: !hideFlag.translation,
      chinese: hideFlag.chinese,
      pinyin: hideFlag.pinyin,
    });
    e.target.innerHTML = !hideFlag.translation ? "Скрыто" : "Перевод";
  };

  return (
    <div className='row'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Поиск слов HSK с озвучкой | Chinese+</title>
      </Helmet>

      <div className='col-sm-3'>
        <div className='card bg-light mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Поиск слов HSK</h4>
            <h6 className='card-subtitle mb-2 text-muted'>Вся лексика</h6>

            <p className='card-text'>Найдите нужные вам слова HSK (любые из 5 000 слов)</p>
          </div>
        </div>
      </div>

      <div className='col-sm-9'>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <small className='form-text text-muted'>китайское слово + Enter</small>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                placeholder='汉字。。。'
                autoComplete='off'
                onInput={(e) => setChineseWord(e.target.value)}
              />
              <div className='input-group-append' id='searchButton'>
                <button className='btn btn-primary' type='submit' onClick={onSubmit}>
                  <i className='fas fa-search'></i>
                </button>
              </div>
            </div>
          </div>
        </form>

        {lexicons && <TablePlate lexicons={lexicons} userWords={words} />}
      </div>
    </div>
  );
};

const mapPropsToState = (state) => ({
  words: state.hskTable.words, // words selected by user
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapPropsToState, { loadWords })(SearchHSK);
