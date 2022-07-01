import React, { Fragment, useState, useEffect } from "react";
import TableItem from "./TableItem";
import HideButtons from "./HideButtons";
import FlipCardsGrid from "./FlipCardsGrid";

const TablePlate = ({ lexicons, userWords }) => {
  const [hideFlag, setHideFlag] = useState({
    chinese: false,
    pinyin: false,
    translation: false,
  });

  const [displayCards, setDisplayCards] = useState(false);

  useEffect(() => {
    if (+localStorage.displayCards) {
      setDisplayCards(true);
    } else {
      setDisplayCards(false);
    }
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
      <div>
        <span className='mr-1'>Отображать как </span>
        <span className='btn-group mb-2' role='group'>
          <button
            className={`btn btn-sm btn-${displayCards ? "outline-" : ""}info`}
            type='button'
            onClick={() => {
              localStorage.setItem("displayCards", "0");
              setDisplayCards(false);
            }}
          >
            Таблицу
          </button>

          <button
            type='button'
            className={`btn btn-sm btn-${displayCards ? "" : "outline-"}info`}
            onClick={() => {
              localStorage.setItem("displayCards", "1");
              setDisplayCards(true);
            }}
          >
            Карточки
          </button>
        </span>
      </div>
      {displayCards ? (
        <FlipCardsGrid words={lexicons} />
      ) : (
        <Fragment>
          <HideButtons hideFlag={hideFlag} onClick={onClick} />
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
      )}
    </Fragment>
  );
};

export default TablePlate;
