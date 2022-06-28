import React, { Fragment, useState } from "react";
import TableItem from "./TableItem";
import Tippy from "@tippyjs/react";

const TablePlate = ({ lexicons, userWords }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const onClick = (e) => {
    const id = e.target.id;

    if (id === "ru") {
      setHideFlag({
        translation: !hideFlag.translation,
        chinese: hideFlag.chinese,
        pinyin: hideFlag.pinyin,
      });
    }
    if (id === "py") {
      setHideFlag({
        pinyin: !hideFlag.pinyin,
        translation: hideFlag.translation,
        chinese: hideFlag.chinese,
      });
    }
    if (id === "cn") {
      setHideFlag({
        chinese: !hideFlag.chinese,
        translation: hideFlag.translation,
        pinyin: hideFlag.pinyin,
      });
    }
  };

  return (
    <Fragment>
      <div className=''>
        <span className='mr-1'>Скрыть</span>
        <span className='btn-group mb-1' role='group'>
          <button
            className={`btn btn-sm btn-${hideFlag.chinese ? "" : "outline-"}info`}
            type='button'
            id='cn'
            onClick={(e) => onClick(e)}
          >
            Иероглифы
          </button>
          <button
            type='button'
            className={`btn btn-sm btn-${hideFlag.pinyin ? "" : "outline-"}info`}
            id='py'
            onClick={(e) => onClick(e)}
          >
            Пиньинь
          </button>
          <button
            type='button'
            className={`btn btn-sm btn-${hideFlag.translation ? "" : "outline-"}info`}
            id='ru'
            onClick={(e) => onClick(e)}
          >
            Перевод
          </button>
        </span>
      </div>
      <table className='table table-hover table-responsive'>
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
    </Fragment>
  );
};

export default TablePlate;
