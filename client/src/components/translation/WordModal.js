import React, { useState } from "react";
import { connect } from "react-redux";
import { setModalWord } from "../../actions/userWords";
import Tippy from "@tippyjs/react";
import { sanitizer } from "../../utils/sanitizer";

const WordModal = ({ word }) => {
  const { chinese, pinyin, russian } = word;

  const [showExamples, setShowExamples] = useState(true);

  let translation = russian
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
    .replace(/\[\*\]\[ex\]/g, "<div class='tippyExsShow'>")
    .replace(/\[\/ex\]\[\/\*\]/g, "</div>")
    .replace(/\\\[(.{1,})\\\]/g, "($1)")
    .replace(/\[ref\]/g, "<span class='text-info'>")
    .replace(/\[\/ref\]/g, "</span>");

  const showMoreButton = () => {
    const examples = document.getElementsByClassName("tippyExsShow");

    if (showExamples) {
      Array.from(examples).forEach(el => {
        el.classList.add("tippyExs");
      });
      setShowExamples(false);
    } else {
      Array.from(examples).forEach(el => {
        el.classList.remove("tippyExs");
      });
      setShowExamples(true);
    }
  };

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
            <Tippy content={<span>{showExamples ? "Скрыть примеры" : "Показать примеры"}</span>}>
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

const mapStateToProps = state => ({
  word: state.userwords.modalWord
});

export default connect(mapStateToProps, { setModalWord })(WordModal);
