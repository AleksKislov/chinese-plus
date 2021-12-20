import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadWords } from "../../actions/hskTable";
import TableItem from "./TableItem";
import { Helmet } from "react-helmet";
import Tippy from "@tippyjs/react";
import axios from "axios";

const SearchHSK = ({ words, loadWords, isAuthenticated }) => {
  const [lexicons, setLexicons] = useState(null);
  const [chineseWord, setChineseWord] = useState("");

  useEffect(() => {
    if (isAuthenticated) loadWords();
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const onSubmit = async e => {
    e.preventDefault();

    setLexicons(null);

    if (chineseWord) {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      try {
        const body = JSON.stringify({ chinese: chineseWord });
        const { data } = await axios.post("/api/lexicon/search", body, config);
        if (data.length > 0) setLexicons(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false
  });

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
        <form onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <small className='form-text text-muted'>китайское слово + Enter</small>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                placeholder='汉字。。。'
                autoComplete='off'
                onInput={e => setChineseWord(e.target.value)}
              />
              <div className='input-group-append' id='searchButton'>
                <button className='btn btn-primary' type='submit' onClick={onSubmit}>
                  <i className='fas fa-search'></i>
                </button>
              </div>
            </div>
          </div>
        </form>

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
            {lexicons &&
              lexicons.map(lexicon => (
                <TableItem
                  key={lexicon._id}
                  lexicon={lexicon}
                  selected={words.some(word => word.word_id === lexicon.word_id)}
                  hideFlag={hideFlag}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapPropsToState = state => ({
  words: state.hskTable.words,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapPropsToState, { loadWords })(SearchHSK);
