import React, { useState, Fragment } from "react";
import WordsItem from "./WordsItem";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";
import HideButtons from "../hsk-table/HideButtons";

const TablePlate = ({ lexicons }) => {
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
      <WordModal />
      <WordEditModal />

      <HideButtons hideFlag={hideFlag} onClick={onClick} />
      <table className='table table-hover table-responsive'>
        <thead style={{ visibility: "collapse" }}>
          <th></th>
          <th style={{ width: "15%" }}></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          {lexicons.map((word) => (
            <WordsItem
              key={word._id}
              lexicon={{
                id: word.id,
                chinese: word.cn,
                pinyin: word.py,
                translation: word.ru,
                lvl: word.lvl,
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
