import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import {  clearPosts } from "../../actions/posts";
import { Helmet } from "react-helmet";
import { dateToStr, addressToUser } from "../../actions/helpers";
import Tippy from "@tippyjs/react";
import { sanitizer } from "../../utils/sanitizer";

const Post = ({ post, comments, isPage }) => {
  const { text, name, avatar, date, title, _id, tag, comments_id, user } = post;
  const tagTheme = {
    wish: "Пожелание",
    bug: "Баг",
    news: "Новости",
  };

  const dateAndTime = dateToStr(date);
  const badgeColor = tag === "news" ? "info" : tag === "bug" ? "danger" : "success";

  return (
    <div className='card my-2'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Фидбэк и новости проекта | Chinese+</title>
      </Helmet>

      <div className='card-body' style={customStyle}>
        <div>
          <Tippy
            content='Кликните, чтобы обратиться к пользователю в комментарии'
            placement='bottom'
          >
            <img
              className='mr-3'
              src={`https:${avatar}`}
              style={imgStyle}
              alt='Avatar'
              onClick={() => addressToUser(user, name)}
            />
          </Tippy>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <h4 className='card-title'>
              <Link to={`/posts/${_id}`}>{title}</Link>
            </h4>
            <span className={`mx-2 badge badge-${badgeColor}`}>{tagTheme[tag]}</span>
          </div>
          <h6 className='card-subtitle mb-2 text-muted'>
            <Link to={`/user/${user}`}>{name}</Link> | <em>{dateAndTime}</em>
          </h6>
          <p className='card-text' dangerouslySetInnerHTML={{ __html: sanitizer(text) }}></p>

          <div>
            <Tippy content={"Комментарии"}>
              <Link to={`/posts/${_id}`}>
                <button className='btn btn-sm btn-outline-info mb-1'>
                  <i className='fas fa-comment-dots'></i>{" "}
                  {isPage
                    ? comments.length > 0 && <span>{comments.length}</span>
                    : comments_id.length > 0 && <span>{comments_id.length}</span>}
                </button>
              </Link>
            </Tippy>
          </div>
        </div>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "40px",
  borderRadius: "8px",
};

const customStyle = {
  display: "flex",
};

const mapStateToProps = (state) => ({
  comments: state.comments.currentComments,
});

export default connect(mapStateToProps, {})(Post);
