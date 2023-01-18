import { useState, useEffect } from "react";
import FlipCard from "./flip-card";

export default function FlipCards({ words }: { words: OldHskWordType[] }) {
  const [pinyinAbove, setPinyinAbove] = useState(false);

  useEffect(() => {
    if (+localStorage.pinyinAbove) {
      setPinyinAbove(true);
    } else {
      setPinyinAbove(false);
    }
  });
  return (
    <>
      <div>
        <span className='btn-group mb-2' role='group'>
          <button className={`btn btn-sm btn-outline-info disabled`} type='button'>
            Сверху отображать:
          </button>
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
        {words &&
          words.map((word) => <FlipCard word={word} key={word._id} pinyinAbove={pinyinAbove} />)}
      </div>
    </>
  );
}
