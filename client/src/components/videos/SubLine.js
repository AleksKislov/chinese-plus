import React, { Fragment } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";

const SubLine = ({ chunk, pinyin, translation, subTime }) => {
  const SubLineNum = <div className='paragraphNum'>{subTime} сек.</div>;

  return (
    <Fragment>
      <div className={`col-sm-4 my-1`}>
        <div className={`card border-secondary`} style={{ height: "100%" }}>
          <p className='card-text textPadding'>
            {chunk.map((word) => (
              <TippyTooltip word={word} key={uuid()} />
            ))}
          </p>
          {SubLineNum}
        </div>
      </div>
      <div className='col-sm-4 my-1'>
        <div className='card border-secondary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>{pinyin}</p>
          {SubLineNum}
        </div>
      </div>
      <div className='col-sm-4 my-1'>
        <div className='card border-secondary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>{translation}</p>
          {SubLineNum}
        </div>
      </div>
    </Fragment>
  );
};

export default SubLine;
