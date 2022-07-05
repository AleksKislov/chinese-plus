import React, { Fragment, useState, useEffect } from "react";
import TableItem from "./TableItem";
import HideButtons from "./HideButtons";
import FlipCardsGrid from "./FlipCardsGrid";
import TableOrCardsButtons from "./TableOrCardsButton";

const TablePlate = ({ lexicons, userWords }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const [displayCards, setDisplayCards] = useState(false);

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
      <TableOrCardsButtons setDisplayCards={setDisplayCards} displayCards={displayCards} />
      {displayCards ? (
        <FlipCardsGrid words={lexicons} />
      ) : (
        <Fragment>
          <HideButtons hideFlag={hideFlag} onClick={onClick} />
          <table className='table table-hover table-responsive'>
            <thead style={{ visibility: "collapse" }}>
              <tr>
                <th></th>
                <th style={{ width: "15%" }}></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
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
        </Fragment>
      )}
    </Fragment>
  );
};

export default TablePlate;
