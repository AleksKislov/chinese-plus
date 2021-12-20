import React from "react";
import { numberToStr } from "../../../actions/helpers";

const Length = ({ length }) => {
  const lengthStr = numberToStr(length);
  return (
    <h6 className='card-subtitle mb-2'>
      <span className='text-muted'>Кол-во знаков: </span>
      {lengthStr}
    </h6>
  );
};

export default Length;
