import { useEffect } from "react";

type TableOrCardsBtnsProps = {
  setDisplayCards: Function;
  displayCards: boolean;
};

export default function TableOrCardsBtns({ setDisplayCards, displayCards }: TableOrCardsBtnsProps) {
  useEffect(() => {
    if (+localStorage.displayCards) {
      setDisplayCards(true);
    } else {
      setDisplayCards(false);
    }
  }, [displayCards]);

  return (
    <div className=''>
      <span className='btn-group mb-2 float-end' role='group'>
        <button className={`btn btn-sm btn-outline-info disabled`} type='button'>
          Отображать:
        </button>
        <button
          className={`btn btn-sm btn-${displayCards ? "outline-" : ""}info`}
          type='button'
          onClick={() => {
            localStorage.setItem("displayCards", "0");
            setDisplayCards(false);
          }}
        >
          Таблицей
        </button>

        <button
          type='button'
          className={`btn btn-sm btn-${displayCards ? "" : "outline-"}info`}
          onClick={() => {
            localStorage.setItem("displayCards", "1");
            setDisplayCards(true);
          }}
        >
          Карточками
        </button>
      </span>
    </div>
  );
}
