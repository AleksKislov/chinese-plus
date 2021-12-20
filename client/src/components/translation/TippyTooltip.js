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
  loadUserWordsLen
} from "../../actions/userWords";
import { sanitizer } from "../../utils/sanitizer";

const TippyTooltip = ({
  word,
  addWord,
  removeWord,
  loadUserWords,
  userwords,
  setModalWord,
  loadUserWordsLen
}) => {
  const [clicked, setClicked] = useState(false);
  const { chinese, pinyin, russian } = word;

  useEffect(() => {
    if (userwords.some(userword => userword.chinese === chinese)) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [userwords]);

  let translation;
  if (russian) {
    translation = russian
      .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, "")
      .replace(/\[b\]/g, "<span class='tippyBold'>")
      .replace(/\[\/b\]/g, "</span>")
      .replace(/\[c\]/g, "<span class='tippyColor'>")
      .replace(/\[\/c\]/g, "</span>")
      .replace(/\[p\]/g, "<span class='tippyColor tippyItalic'>")
      .replace(/\[\/p\]/g, "</span>")
      .replace(/\[i\]/g, "<span class='tippyItalic'>")
      .replace(/\[\/i\]/g, "</span>")
      .replace(/\[m1\]/g, "<span class='tippyParagraph'>")
      .replace(/\[m\d\]/g, "<span class='tippyExample'>")
      .replace(/\[\/m\]/g, "</span>")
      .replace(/\[\*\]\[ex\]/g, "<span class='tippyExs'>")
      .replace(/\[\/ex\]\[\/\*\]/g, "</span>")
      .replace(/\\\[(.{1,})\\\]/g, "($1)")
      .replace(/\[ref\]/g, "<span class='text-info'>")
      .replace(/\[\/ref\]/g, "</span>");

    if (translation.length > 2000) {
      const ind = translation.slice(800, translation.length).indexOf("<span class='tippyExample'>");
      translation = translation.slice(0, ind + 800);
    }
  }

  const showModal = e => {
    // console.log("test");
    setModalWord(word);
  };

  const moreButton = (
    <button
      className='btn btn-sm btn-warning mb-2'
      onClick={e => showModal(e)}
      data-toggle='modal'
      data-target='#exampleModal'
    >
      Больше
    </button>
  );

  const onClick = e => {
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
    return <span className='tippyTooltips'>{word}</span>;
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
          <div>
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
            <button
              className={`btn btn-sm float-right btn-${clicked ? "danger" : "info"}`}
              onClick={e => onClick(e)}
            >
              {clicked ? <i className='fas fa-minus'></i> : <i className='fas fa-plus'></i>}
            </button>
          </div>
        }
      >
        <span className={`tippyTooltips ${clicked && "tippySelected"}`}>{chinese}</span>
      </Tippy>
    );
  }
};

TippyTooltip.propTypes = {
  userwords: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  userwords: state.userwords.userwords
});

export default connect(mapStateToProps, {
  addWord,
  removeWord,
  loadUserWords,
  setModalWord,
  loadUserWordsLen
})(TippyTooltip);
