import React, { Fragment, useState, useEffect } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";
import Tippy from "@tippyjs/react";
import { countZnChars } from "../../actions/helpers";
import { connect } from "react-redux";
import { readToday, unreadToday } from "../../actions/auth";
import { TweenMax, Back } from "gsap";
import store from "../../store";
import { setAlert } from "../../actions/alert";

const SubLine = ({
  chunk,
  translation,
  hideFlag,
  index,
  originTxt,
  user,
  readToday,
  unreadToday,
  toEdit,
  fontsize,
  toPostLongText,
}) => {
  const numOfChars = countZnChars(originTxt);

  const SubLineNum = (
    <Tippy content={`Строка №${index + 1}`}>
      <div className='paragraphNum'>{index + 1}</div>
    </Tippy>
  );

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
          <p className='card-text textPadding'>{translation}</p>
          {SubLineNum}
        </div>
      </div>
    </Fragment>
  );
};

export default SubLine;
