import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Tippy from "@tippyjs/react";
import { sanitizer } from "../../utils/sanitizer";
import { markUpRussianText } from "../../actions/helpers";

const WordModal = ({ word }) => {
  const { chinese, pinyin, russian } = word;

  const [showExamples, setShowExamples] = useState(true);

  const translation = markUpRussianText(russian, true);

  const showMoreButton = () => {
    const examples = document.getElementsByClassName("tippyExsShow");

    if (showExamples) {
      Array.from(examples).forEach((el) => {
        el.classList.add("tippyExs");
      });
      setShowExamples(false);
    } else {
      Array.from(examples).forEach((el) => {
        el.classList.remove("tippyExs");
      });
      setShowExamples(true);
    }
  };

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  return (
    <div
      className='modal fade'
      id='exampleModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>
              {chinese} | {pinyin}
            </h5>
            <Tippy
              theme={isDark}
              content={<span>{showExamples ? "Скрыть примеры" : "Показать примеры"}</span>}
            >
              <button
                className='btn btn-sm btn-warning ml-3'
                id='showMoreButton'
                onClick={showMoreButton}
              >
                {showExamples ? "Меньше" : "Больше"}
              </button>
            </Tippy>

            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div
            className='modal-body'
            dangerouslySetInnerHTML={{ __html: sanitizer(translation) }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  word: state.userwords.modalWord,
});

export default connect(mapStateToProps, {})(WordModal);
