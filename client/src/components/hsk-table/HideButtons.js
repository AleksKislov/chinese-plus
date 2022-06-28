import React from "react";

const HideButtons = ({ hideFlag, onClick }) => {
  return (
    <div>
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
  );
};

export default HideButtons;
