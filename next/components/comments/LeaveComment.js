import React, { useState, useEffect } from "react";
import { addComment, getComments, unsetCommentReply } from "../../actions/comments";
import { connect } from "react-redux";
import store from "../../store";
import { setAlert } from "../../actions/alert";
import { commentLength } from "../../constants/consts.json";
import EmojiSelect from "./EmojiSelect";

// path is from/for book Chapterpage
const LeaveComment = ({
  addComment,
  getComments,
  isAuthenticated,
  _id,
  where,
  path,
  commentIdToReply,
  unsetCommentReply,
}) => {
  const [text, setText] = useState("");
  const [addressedUsers, setAddressedUsers] = useState([]);

  // useEffect(() => {
  //   if (commentIdToReply) {
  //     setAddressedUsers([
  //       ...addressedUsers,
  //       { id: commentIdToReply.userId, name: commentIdToReply.name }
  //     ]);
  //   }
  // }, [commentIdToReply]);

  useEffect(() => {
    setAddressedUsers(checkIfAddressed(text));
  }, [text]);

  const onSubmit = () => {
    // e.preventDefault();

    if (isAuthenticated) {
      let newtext = text.replace(/\n/g, "<br />");

      addressedUsers.forEach((user) => {
        newtext = newtext.replace(user.str, `<strong class='text-info'>${user.name}</strong>`);
      });

      if (text.length <= commentLength) {
        // id, text
        addComment(where, _id, newtext, path, addressedUsers, commentIdToReply);
        unsetCommentReply();
      } else {
        store.dispatch(setAlert("Сообщение не должно превышать лимит", "danger"));
      }
    } else {
      store.dispatch(setAlert("Авторизуйтесь, чтобы оставлять комментарии.", "danger"));
    }

    const textForm = document.getElementById("textForm");
    textForm.value = "";
    setText("");
    getComments(where, _id);
  };

  const addEmoToText = (e) => {
    const previousTxt = document.getElementById("textForm").value;
    setText(`${previousTxt} ${e.target.innerHTML}`);
  };

  const checkAuthorized = () => {
    if (!isAuthenticated) store.dispatch(setAlert("Войдите, чтобы комментировать", "danger"));
  };

  /**
   * @param {string} txt - comment text
   * @returns {object} - {id, name, str} - where id is user id, name - is user name
   */
  const checkIfAddressed = (txt) => {
    const resArr = txt.split("@@");
    const onlyNames = resArr.filter((x) => x[0] === "[" && x[x.length - 1] === "}");
    const userSet = Array.from(new Set(onlyNames));
    return userSet.map((x) => {
      const id = x.slice(1, x.indexOf("]"));
      const name = x.slice(x.indexOf("{") + 1, x.length - 1);
      return { id, name, str: `@@${x}@@` };
    });
  };

  return (
    <div className='card my-2'>
      <div className='card-body'>
        <div className='mb-3'>
          <span className='h6' id='yourCommentId'>
            Ваш Комментарий
          </span>
          <button
            type='submit'
            className='btn btn-primary btn-sm float-right mb-1'
            onClick={onSubmit}
          >
            Опубликовать
          </button>
        </div>

        {commentIdToReply && (
          <div className='mb-1 text-info'>
            Вы отвечаете{" "}
            <span className='badge badge-pill badge-primary'>{commentIdToReply.name}</span> на
            комментарий{" "}
            <span
              className='badge badge-pill badge-primary'
              onClick={unsetCommentReply}
              style={{ cursor: "pointer" }}
            >
              {`#${commentIdToReply.commentId.slice(-3)}`} <i className='fas fa-times'></i>
            </span>
          </div>
        )}

        <div className='mb-1 text-info'>
          {addressedUsers.length === 0 ? "" : "Вы обращаетесь к: "}

          {addressedUsers.length > 0 &&
            addressedUsers.map((user, ind) => (
              <span className='badge badge-pill badge-primary mr-1' key={ind}>
                {user.name}
              </span>
            ))}
        </div>
        <form>
          <div className='form-group'>
            <textarea
              className='form-control'
              rows='3'
              id='textForm'
              onClick={(e) => setText(e.target.value)}
              onChange={(e) => {
                checkAuthorized();
                setText(e.target.value);
              }}
              placeholder='Текст'
              name='text'
              value={text}
              required
            ></textarea>

            <div className=''>
              <small className={`text-${text.length <= commentLength ? "mute" : "danger"}`}>
                {text.length}/{commentLength}
              </small>
              <div className='float-right'>
                <EmojiSelect addEmoToText={addEmoToText} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  commentIdToReply: state.comments.commentIdToReply,
});

export default connect(mapStateToProps, { addComment, getComments, unsetCommentReply })(
  LeaveComment
);
