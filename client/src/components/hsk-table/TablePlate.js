import React, { useState } from "react";
import TableItem from "./TableItem";
import Tippy from "@tippyjs/react";

const TablePlate = ({ lexicons, userWords }) => {
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
    <table className='table table-hover table-responsive'>
      <thead>
        <tr className='table-info'>
          <th className='text-center'>
            <i className='fab fa-slack-hash'></i>
          </th>
          <th>
            <Tippy placement='bottom' content='Скрыть иероглифы'>
              <button
                type='button'
                className='btn btn-light btn-sm'
                onClick={(e) => hideChinese(e)}
              >
                Иероглифы
              </button>
            </Tippy>
          </th>
          <th>
            <Tippy placement='bottom' content='Скрыть пиньинь'>
              <button type='button' className='btn btn-light btn-sm' onClick={(e) => hidePinyin(e)}>
                Пиньинь
              </button>
            </Tippy>
          </th>
          <th style={{ width: "70%" }}>
            <Tippy placement='bottom' content='Скрыть перевод'>
              <button type='button' className='btn btn-light btn-sm' onClick={(e) => hideFanyi(e)}>
                Перевод
              </button>
            </Tippy>
          </th>
          <th>
            <div className='text-center'>
              <i className='fas fa-headphones'></i>
            </div>
          </th>
          <th className='text-center'>
            <i className='fas fa-plus'></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {lexicons.map((lexicon) => (
          <TableItem
            key={lexicon._id}
            lexicon={lexicon}
            selected={userWords.some((word) => word.word_id === lexicon.word_id)}
            hideFlag={hideFlag}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TablePlate;
