import React, { useState, useEffect } from "react";
import "./style.css";

const FlipCard = ({ word, pinyinAbove }) => {
  const { chinese, translation, pinyin } = word;
  const [isClicked, setIsClicked] = useState(false);
  const [columnSize, setColumnSize] = useState("3");

  useEffect(() => {
    if (window.innerWidth < 576) {
      setColumnSize("6");
    }
  }, []);

  return (
    <div className={`col-${columnSize} my-2`}>
      <div className='flip-card-outer'>
        <div
          className={`flip-card ${isClicked ? "flipCardMethod" : ""}`}
          onClick={() => setIsClicked(!isClicked)}
        >
          <span className='flip-front py-5 h4'>{pinyinAbove ? pinyin : chinese}</span>
          <span className='flip-back py-1 px-1 bg-light'>
            <strong className='text-info h4'>{!pinyinAbove ? pinyin : chinese}</strong>
            <br />
            <small>{translation}</small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
