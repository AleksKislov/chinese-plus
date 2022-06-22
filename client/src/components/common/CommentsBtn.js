import React from "react";
import { Link } from "react-router-dom";
import { CONTENT } from "../../constants/consts.json";
import Tippy from "@tippyjs/react";

const CommentsBtn = ({ id, comments_id, contentType }) => {
  const urlPath = contentType === CONTENT.video ? "videos" : "texts";
  return (
    <Tippy content={"Комментарии"}>
      <Link to={`/${urlPath}/${id}`}>
        <button className='btn btn-sm btn-outline-info'>
          <i className='fas fa-comment-dots'></i>{" "}
          {comments_id.length > 0 && <span>{comments_id.length}</span>}
        </button>
      </Link>
    </Tippy>
  );
};

export default CommentsBtn;
