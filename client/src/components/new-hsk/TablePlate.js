import React, { useState, Fragment } from "react";
import WordsItem from "./WordsItem";
import WordModal from "../translation/WordModal";

const TablePlate = ({ lexicons }) => {
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
    <Fragment>
      <WordModal />
      <table className='table table-hover mb-3'>
        <thead>
          <tr className='table-info'>
            <th>
              <button
                type='button'
                className='btn btn-light btn-sm'
                onClick={(e) => hideChinese(e)}
              >
                Иероглифы
              </button>
            </th>
            <th>
              <button type='button' className='btn btn-light btn-sm' onClick={(e) => hidePinyin(e)}>
                Пиньинь
              </button>
            </th>
            <th style={{ width: "60%" }}>
              <button type='button' className='btn btn-light btn-sm' onClick={(e) => hideFanyi(e)}>
                Перевод
              </button>
            </th>
            <th>Примеры</th>
          </tr>
        </thead>
        <tbody>
          {lexicons.map((word) => (
            <WordsItem
              key={word._id}
              lexicon={{
                chinese: word.cn,
                pinyin: word.py,
                translation: word.ru,
              }}
              hideFlag={hideFlag}
            />
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default TablePlate;
