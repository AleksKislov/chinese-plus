import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setCommentToDelete, setCommentReply, addLike } from "../../actions/comments";
import { dateToStr, addressToUser } from "../../actions/helpers";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { HashLink } from "react-router-hash-link";
import { sanitizer } from "../../utils/sanitizer";

const Comment = ({
  comment,
  currentUser,
  isAuthenticated,
  setCommentToDelete,
  setCommentReply,
  addLike
}) => {
  const { avatar, text, name, date, user, _id, commentIdToReply, likes } = comment;
  const dateAndTime = dateToStr(date);

  useEffect(() => {
    if (currentUser) setLiked(likes.some(like => like.user === currentUser._id));
  }, [likes, currentUser]);

  const [liked, setLiked] = useState(
    currentUser && likes ? likes.some(like => like.user === currentUser._id) : false
  );

  return (
    <div className='card my-2' id={_id}>
      <div className='commentIdNum'>{`#${_id.slice(-3)}`}</div>
      <div className='card-body' style={customStyle}>
        <div>
          <Tippy
            content='Кликните, чтобы обратиться к пользователю в комментарии'
            placement='bottom'
          >
            <HashLink to='#yourCommentId'>
              <img
                className='mr-3'
                src={`https:${avatar}`}
                style={imgStyle}
                alt='Avatar'
                onClick={() => addressToUser(user, name)}
              />
            </HashLink>
          </Tippy>
        </div>
        <div style={{ width: "100%" }}>
          {commentIdToReply && (
            <small className='text-info'>
              Ответ на комментарий{" "}
              <HashLink to={`#${commentIdToReply.commentId}`}>
                <span className='badge badge-pill badge-primary'>
                  {`#${commentIdToReply.commentId.slice(-3)}`}
                </span>
              </HashLink>
            </small>
          )}
          <p className='card-text' dangerouslySetInnerHTML={{ __html: sanitizer(text) }}></p>

          <div className='row'>
            <div className='col-md-8 my-2'>
              <h6 className='card-subtitle text-muted'>
                <Link to={`/user/${user}`}>{name}</Link> | <em>{dateAndTime}</em>
              </h6>
            </div>
            <div className='col-md-4'>
              <div className='float-right'>
                <Tippy
                  content={
                    likes && likes.length > 0
                      ? likes.reduce((acc, x) => (acc += `${x.name}, `), "").slice(0, -2)
                      : "Никто не лайкал"
                  }
                >
                  <button
                    className={`btn btn-sm btn-${liked ? "" : "outline-"}info mx-1'`}
                    onClick={() => addLike(_id)}
                  >
                    <i className='fas fa-thumbs-up'></i>{" "}
                    {likes.length > 0 && <span>{likes.length}</span>}
                  </button>
                </Tippy>

                {isAuthenticated && (currentUser._id === user || currentUser.role === "admin") && (
                  <Tippy content='Отредактировать / удалить'>
                    <button
                      className='btn btn-sm btn-info mx-1'
                      data-toggle='modal'
                      data-target='#confirmModal'
                      onClick={e => setCommentToDelete(comment)}
                    >
                      <i className='far fa-edit'></i>
                    </button>
                  </Tippy>
                )}

                {isAuthenticated && currentUser._id !== user && (
                  <Tippy content='Ответить'>
                    <HashLink
                      to='#yourCommentId'
                      className='btn btn-outline-primary btn-sm mx-1'
                      onClick={() => setCommentReply(_id, user, name)}
                    >
                      <i className='fas fa-reply'></i>
                    </HashLink>
                  </Tippy>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "40px",
  borderRadius: "8px"
};

const customStyle = {
  display: "flex"
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user
});

export default connect(mapStateToProps, { setCommentToDelete, setCommentReply, addLike })(Comment);
