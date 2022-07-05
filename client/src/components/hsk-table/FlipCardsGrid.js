import React, { useState, useEffect, Fragment } from "react";
import FlipCard from "./FlipCard";

const FlipCardsGrid = ({ words }) => {
  const [pinyinAbove, setPinyinAbove] = useState(false);

  useEffect(() => {
    if (+localStorage.pinyinAbove) {
      setPinyinAbove(true);
    } else {
      setPinyinAbove(false);
    }
  });
  return (
    <Fragment>
      <div>
        <span className='mr-1'>Сверху показывать </span>
        <span className='btn-group mb-2' role='group'>
          <button
            className={`btn btn-sm btn-${pinyinAbove ? "outline-" : ""}info`}
            type='button'
            onClick={() => {
              localStorage.setItem("pinyinAbove", "0");
              setPinyinAbove(false);
            }}
          >
            Иероглифы
          </button>

          <button
            type='button'
            className={`btn btn-sm btn-${pinyinAbove ? "" : "outline-"}info`}
            onClick={() => {
              localStorage.setItem("pinyinAbove", "1");
              setPinyinAbove(true);
            }}
          >
            Пиньинь
          </button>
        </span>
      </div>
      <div className='row'>
        {words.map((word) => (
          <FlipCard word={word} key={word._id} pinyinAbove={pinyinAbove} />
        ))}
      </div>
    </Fragment>
  );
};

export default FlipCardsGrid;
