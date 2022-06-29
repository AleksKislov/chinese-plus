import React, { useState } from "react";
import "./style.css";

const FlipCard = ({ word }) => {
  const { chinese, translation, pinyin } = word;
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className='col-sm-3 my-2'>
      <div className='flip-card-outer'>
        <div
          className={`flip-card ${isClicked ? "flipCardMethod" : ""}`}
          onClick={() => setIsClicked(!isClicked)}
        >
          <span className='flip-front py-5 h4'>{chinese}</span>
          <span className='flip-back py-1 px-1 bg-light'>
            <strong className='text-info'>{pinyin}</strong>
            <br />
            <small>{translation}</small>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
