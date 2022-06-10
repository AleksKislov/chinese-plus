import React, { useState, useEffect } from "react";
import "./light-border.css";
import Tippy from "@tippyjs/react";
import { followCursor } from "tippy.js";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addWord,
  removeWord,
  loadUserWords,
  setModalWord,
  loadUserWordsLen,
  setModalEditWord,
} from "../../actions/userWords";
import { sanitizer } from "../../utils/sanitizer";
import { parseRussian } from "../../actions/helpers";
import { NullUser, User } from "../../patterns/User";

const TippyTooltip = ({
  word,
  addWord,
  removeWord,
  loadUserWords,
  userwords,
  setModalWord,
  loadUserWordsLen,
  isCurrent,
  setModalEditWord,
  user,
}) => {
  const [clicked, setClicked] = useState(false);
  if (!word) word = "";
  const { chinese, pinyin, russian } = word;

  useEffect(() => {
    if (userwords.some((userword) => userword.chinese === chinese)) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [userwords]);

  let translation;
  if (russian) translation = parseRussian(russian);

  const moreButton = (
    <button
      className='btn btn-sm btn-warning mb-2'
      onClick={() => {
        setModalWord(word);
        hideIt();
      }}
      data-toggle='modal'
      data-target='#exampleModal'
    >
      Больше
    </button>
  );

  const editButton = user.isNull ? (
    <Tippy content={<span>Залогиньтесь, чтобы отредактировать</span>}>
      <button className='btn btn-sm btn-warning mb-2 ml-1'>
        <i className='far fa-edit'></i>
      </button>
    </Tippy>
  ) : (
    <Tippy content={<span>Отредактировать слово</span>}>
      <button
        className='btn btn-sm btn-warning mb-2 ml-1'
        data-toggle='modal'
        onClick={() => {
          setModalEditWord(word);
          hideIt();
        }}
        data-target='#editWordModal'
      >
        <i className='far fa-edit'></i>
      </button>
    </Tippy>
  );

  const plusButton = user.isNull ? (
    <Tippy content={<span>Залогиньтесь, чтобы сохранить</span>}>
      <button className={`btn btn-sm float-right btn-${clicked ? "danger" : "info"}`}>
        <i className='fas fa-plus'></i>
      </button>
    </Tippy>
  ) : (
    <button
      className={`btn btn-sm float-right btn-${clicked ? "danger" : "info"}`}
      onClick={(e) => onClick(e)}
    >
      {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
    </button>
  );

  const onClick = (e) => {
    if (clicked) {
      // setClicked(false);
      removeWord(chinese);
      setTimeout(() => {
        loadUserWords();
        loadUserWordsLen();
      }, 500);
    } else {
      // setClicked(true);
      addWord(word);
      setTimeout(() => {
        loadUserWords();
        loadUserWordsLen();
      }, 500);
    }
  };

  const [open, setIsOpen] = useState(undefined);
  const hideIt = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsOpen(undefined);
    }, 100);
  };

  if (word === "\n") {
    return <span className='row'></span>;
  } else if (!word.chinese) {
    return <span className={`tippyTooltips ${isCurrent ? "text-danger" : ""}`}>{word}</span>;
  } else {
    return (
      <Tippy
        className='mintippy-box'
        followCursor='initial'
        trigger='click'
        plugins={[followCursor]}
        theme='light-border'
        placement='bottom'
        interactive={true}
        visible={open}
        onClickOutside={hideIt}
        content={
          <div className='text-left'>
            <div className='tippyPinyin'>
              <span className='onlyPinyin text-info'>{chinese}</span>
              <span className='onlyPinyin'>{pinyin}</span>
              <button
                type='button'
                className='btn btn-sm btn-outline-danger float-right'
                onClick={hideIt}
              >
                <i className='fas fa-times'></i>
              </button>
            </div>
            <p
              className='tippyTranslation'
              dangerouslySetInnerHTML={{ __html: sanitizer(translation) }}
            ></p>{" "}
            {moreButton}
            {editButton}
            {plusButton}
          </div>
        }
      >
        <span
          className={`tippyTooltips ${clicked && "tippySelected"} ${
            isCurrent ? "text-danger" : ""
          }`}
        >
          {chinese}
        </span>
      </Tippy>
    );
  }
};

TippyTooltip.propTypes = {
  userwords: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
});

export default connect(mapStateToProps, {
  addWord,
  removeWord,
  loadUserWords,
  setModalWord,
  loadUserWordsLen,
  setModalEditWord,
})(TippyTooltip);
