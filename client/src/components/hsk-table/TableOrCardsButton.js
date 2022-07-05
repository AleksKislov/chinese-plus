import React, { useEffect } from "react";

const TableOrCardsButtons = ({ setDisplayCards, displayCards }) => {
  useEffect(() => {
    if (+localStorage.displayCards) {
      setDisplayCards(true);
    } else {
      setDisplayCards(false);
    }
  }, [displayCards]);

  return (
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
  );
};

export default TableOrCardsButtons;
