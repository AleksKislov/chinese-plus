import React, { useState } from "react";
import "./style.css";

const FlipCardsGrid = ({}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className='row'>
      <div className='col-sm-3'>
        <div className='flip-card-outer'>
          <div
            className={`flip-card ${isClicked ? "flipCardMethod" : ""}`}
            onClick={() => setIsClicked(!isClicked)}
          >
            <div className='flip-front'>前面</div>
            <div className='flip-back'>back</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCardsGrid;
