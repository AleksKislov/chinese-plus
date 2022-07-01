import React from "react";

const HideButtons = ({ hideFlag, onClick }) => {
  return (
    <div>
      <span className='mr-1'>Скрыть</span>
      <span className='btn-group mb-2' role='group'>
        <button
          className={`btn btn-sm btn-${hideFlag.chinese ? "" : "outline-"}info`}
          type='button'
          onClick={(e) => onClick(e)}
          id='cn'
        >
          Иероглифы
        </button>
        <button
          type='button'
          className={`btn btn-sm btn-${hideFlag.pinyin ? "" : "outline-"}info`}
          onClick={(e) => onClick(e)}
          id='py'
        >
          Пиньинь
        </button>
        <button
          type='button'
          className={`btn btn-sm btn-${hideFlag.translation ? "" : "outline-"}info`}
          onClick={(e) => onClick(e)}
          id='ru'
        >
          Перевод
        </button>
      </span>
    </div>
  );
};

export default HideButtons;
