import React, { useState, useEffect } from "react";
import { deleteComment, editComment, getComments } from "../../actions/comments";
import { connect } from "react-redux";
import EmojiSelect from "./EmojiSelect";
import { commentLength } from "../../constants/consts.json";

const ConfirmModal = ({ editComment, deleteComment, commentToDelete, getComments }) => {
  const [state, setState] = useState(commentToDelete ? true : false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (commentToDelete) setText(commentToDelete.text);
  }, [commentToDelete]);

  const addEmoToText = e => {
    const previousTxt = document.getElementById("changeComment").value;
    setText(`${previousTxt} ${e.target.innerHTML}`);
  };
  return (
    <div
      className='modal fade'
      id='confirmModal'
      tabIndex='-1'
      role='dialog'
      aria-labelledby='confirmModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-md' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='confirmModalLabel'>
              Отредактируйте или удалите
            </h5>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm'
              data-dismiss='modal'
              aria-label='Close'
            >
              <i className='fas fa-times'></i>
            </button>
          </div>
          <div className='modal-body'>
            <div className='form-group'>
              <textarea
                className='form-control'
                value={text}
                id='changeComment'
                onChange={e => setText(e.target.value)}
              ></textarea>
            </div>
            <div className=''>
              <small className={`text-${text.length <= commentLength ? "mute" : "danger"}`}>
                {text.length}/{commentLength}
              </small>
              <div className='float-right'>
                <EmojiSelect addEmoToText={addEmoToText} />
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              data-dismiss='modal'
              className='btn btn-info btn-sm'
              disabled={text.length > commentLength}
              onClick={e => {
                getComments(commentToDelete.destination, commentToDelete.post_id);

                editComment(text, commentToDelete._id);
              }}
            >
              Исправить
            </button>
            <button
              disabled={state ? true : false}
              type='button'
              data-dismiss='modal'
              className='btn btn-danger btn-sm'
              onClick={e =>
                deleteComment(
                  commentToDelete.destination,
                  commentToDelete.post_id,
                  commentToDelete._id
                )
              }
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  commentToDelete: state.comments.commentToDelete
});

export default connect(mapStateToProps, { deleteComment, editComment, getComments })(ConfirmModal);
