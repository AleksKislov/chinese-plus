import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { likeText } from "../../actions/texts";
import { likeVideo } from "../../actions/videos";
import { connect } from "react-redux";
import { CONTENT } from "../../constants/consts.json";

const LikeBtn = ({ likes, id, likeText, likeVideo, user, contentType }) => {
  useEffect(() => {
    if (user) setLiked(likes.some((like) => like.user === user._id));
  }, [likes, user]);

  const [liked, setLiked] = useState(user ? likes.some((like) => like.user === user._id) : false);

  return (
    <Tippy
      content={
        likes && likes.length > 0
          ? likes.reduce((acc, x) => (acc += `${x.name}, `), "").slice(0, -2)
          : "Еще никто не лайкал"
      }
    >
      <button
        className={`btn btn-sm btn-${liked ? "danger" : "outline-info"}`}
        onClick={() => {
          if (contentType === CONTENT.video) {
            likeVideo(id);
          } else {
            likeText(id);
          }
        }}
      >
        <i className='fas fa-heart'></i> {likes.length > 0 && <span>{likes.length}</span>}
      </button>
    </Tippy>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { likeText, likeVideo })(LikeBtn);
