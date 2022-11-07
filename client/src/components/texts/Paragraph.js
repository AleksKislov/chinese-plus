import React, { Fragment, useState, useEffect } from "react";
import TippyTooltip from "../translation/TippyTooltip";
import { v4 as uuid } from "uuid";
import Tippy from "@tippyjs/react";
import { countZnChars, parseChineseWords, newParseChineseWords } from "../../actions/helpers";

import { connect } from "react-redux";
import { readToday, unreadToday } from "../../actions/auth";
import { TweenMax, Back } from "gsap";
import store from "../../store";
import { setAlert } from "../../actions/alert";

const Paragraph = ({
  chunk: chunkToUse,
  translation,
  hideFlag,
  index,
  originTxt,
  readToday,
  unreadToday,
  toEdit,
  user,
  fontsize,
  toPostLongText,
}) => {
  const numOfChars = countZnChars(originTxt);
  const [alreadyRead, setAlreadyRead] = useState(false);
  const [chunk, setChunk] = useState(null);

  console.log("тута");

  useEffect(() => {
    console.log("слова");

    setTimeout(async () => {
      const chineseChunkedWords = await newParseChineseWords(chunkToUse, match.params.id, index);
      setChunk(chineseChunkedWords);
    });
  }, [chunkToUse]);

  // useEffect(() => {
  //   console.log("user");
  //   if (user && !toEdit) {
  //     if (user.read_today_arr && user.read_today_arr[window.location.pathname]) {
  //       if (user.read_today_arr[window.location.pathname].includes(index)) setAlreadyRead(true);
  //     }
  //   }
  // }, [user]);

  const readOrUnread = () => {
    if (alreadyRead) {
      setAlreadyRead(!alreadyRead);
      if (user && user.daily_reading_goal) {
        unreadToday({ num: numOfChars, path: window.location.pathname, ind: index });
      }
    } else {
      setAlreadyRead(!alreadyRead);
      if (user && user.daily_reading_goal) {
        changeTeam();
      } else {
        store.dispatch(setAlert("Авторизуйтесь и установите свою цель для чтения!", "danger"));
      }
    }
  };

  function changeTeam() {
    const box = document.querySelector("#box" + index);
    const box1 = document.querySelector("#box1" + index);
    const box2 = document.querySelector("#box2" + index);
    const teamRed = document.querySelector(".progress");

    otherBoxes(teamRed, box1, 1);
    otherBoxes(teamRed, box2, 2);

    box.style.display = "block";
    const rect = box.getBoundingClientRect();
    teamRed.appendChild(box);
    TweenMax.set(box, { x: 0, y: 0 });
    TweenMax.to(box, 1.2, { width: "0.9rem", height: "0.9rem", color: "#18BC9C", opacity: "0.5" });
    const newRect = box.getBoundingClientRect();

    TweenMax.from(box, 1, {
      x: rect.left - newRect.left,
      y: rect.top - newRect.top,
      ease: Back.easeOut,
      onComplete: fadeIt,
    });

    function fadeIt() {
      setTimeout(() => {
        teamRed.removeChild(box);
        readToday({ num: numOfChars, path: window.location.pathname, ind: index });
      }, 500);
    }
  }

  const otherBoxes = (teamRed, box, n) => {
    box.style.display = "block";
    const rect = box.getBoundingClientRect();
    teamRed.appendChild(box);
    TweenMax.set(box, { x: 0, y: 0 });
    TweenMax.to(box, 1.2 + n * 0.3, {
      width: "0.9rem",
      height: "0.9rem",
      color: "#18BC9C",
      opacity: "0.5",
    });
    const newRect = box.getBoundingClientRect();

    TweenMax.from(box, 1.2 + n * 0.3, {
      x: rect.left - newRect.left,
      y: rect.top - newRect.top,
      ease: Back.easeOut,
      onComplete: fadeOthers,
    });

    function fadeOthers() {
      teamRed.removeChild(box);
    }
  };

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  const paragraphNum = (
    <Tippy theme={isDark} content={`Параграф №${index + 1}`}>
      <div className='paragraphNum'>{index + 1}</div>
    </Tippy>
  );

  //   <div
  //   className={`paragraphToRead paragraph-${alreadyRead ? "minus" : "plus"}`}
  //   onClick={readOrUnread}
  // >
  const paragraphPlus = (
    <Tippy theme={isDark} content={`Прочитано ${numOfChars} 字`}>
      <div
        className={`paragraphToRead paragraph-${alreadyRead ? "minus" : "plus"}`}
        onClick={readOrUnread}
      >
        <div className='box align-middle center' id={"box" + index}></div>
        <div className='box1 align-middle center' id={"box1" + index}></div>
        <div className='box2 align-middle center' id={"box2" + index}></div>
        <div className='box3 align-middle center' id={"box3" + index}></div>

        <i className={`fas fa-${alreadyRead ? "minus" : "plus"}-square`}></i>
      </div>
    </Tippy>
  );

  return (
    <Fragment>
      <div className={`result${fontsize} col-sm-${hideFlag ? "12" : "6"} my-1`}>
        <div
          className={`card border-secondary ${alreadyRead ? "alreadyRead" : ""}`}
          style={{ height: "100%" }}
        >
          <p className='card-text textPadding'>
            {toPostLongText ? (
              <span>{chunk}</span>
            ) : (
              chunk && chunk.map((word) => <TippyTooltip word={word} key={uuid()} />)
            )}
          </p>
          {paragraphNum}
          {paragraphPlus}
        </div>
      </div>
      <div className='col-sm-6 my-1' style={hideFlag ? hidden : {}}>
        <div className='card border-secondary' style={{ height: "100%" }}>
          <p className='card-text textPadding'>{translation}</p>
          {paragraphNum}
        </div>
      </div>
    </Fragment>
  );
};

const hidden = {
  display: "none",
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  fontsize: state.profile.fontsize,
});

export default connect(mapStateToProps, { readToday, unreadToday })(Paragraph);
