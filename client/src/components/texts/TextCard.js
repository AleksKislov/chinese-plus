import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { levelStars, dateToStr } from "../../actions/helpers";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";
import { textCategories } from "../../constants/consts.json";
import LikeBtn from "../common/LikeBtn";
import CommentsBtn from "../common/CommentsBtn";
import TextDescription from "./common/TextDescription";
import TextSource from "./common/TextSource";

const TextCard = ({ text, user, hide, category, hideLevel }) => {
  const {
    title,
    pic_url,
    tags,
    length,
    description,
    level,
    date,
    name,
    comments_id,
    _id,
    theme_word,
    hits,
    categoryInd,
    likes,
    source,
    audioSrc,
    user: textUser,
  } = text;
  useEffect(() => {
    if (hide === 0) setHideId(false);
    if (hide === 1) setHideId(isRead(_id));
    if (hide === 2) setHideId(!isRead(_id));

    setRightCategory(category === 0 || category === categoryInd + 1);
    setRightLevel(hideLevel === 0 || level === hideLevel);
  }, [hide, category, hideLevel]);

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  const isRead = (textid) => (user ? user.finished_texts.includes(textid) : false);
  const [hideIt, setHideId] = useState(false);
  const [rightCategory, setRightCategory] = useState(true);
  const [rightLevel, setRightLevel] = useState(true);

  const dateAndTime = dateToStr(date);

  return (
    !hideIt &&
    rightCategory &&
    rightLevel && (
      <div className={`card my-2 ${isRead(_id) ? "alreadyReadCard" : ""}`}>
        {isRead(_id) && (
          <Tippy content='Прочитано' theme={isDark}>
            <h4 className='alreadyReadMark'>
              <i className='fas fa-check-circle text-success'></i>
            </h4>
          </Tippy>
        )}

        <div className='card-body row'>
          <div style={{ position: "relative" }} className='col-md-3'>
            <Link to={`/texts/${_id}`}>
              <img className='mr-3 textCardImg' src={`${pic_url}`} alt='text pic' />
              <div style={imgText}>{theme_word}</div>
            </Link>
          </div>
          <div className='col-md-9'>
            <h4 className='card-title'>
              <Link to={`/texts/${_id}`}>{title}</Link>{" "}
              <Tippy content={`просмотров: ${hits}`} theme={isDark}>
                <small className='text-muted extra-smtext'>
                  <i className='fas fa-eye'></i> {hits}
                </small>
              </Tippy>
            </h4>
            <h6 className='card-subtitle mb-1 text-muted'>
              <em>{dateAndTime}</em>
            </h6>
            <div className='mb-2'>
              <h6 className='text-muted'>
                Тэги:
                {tags.map((tag, ind) => (
                  <span key={ind} className='badge badge-pill badge-info ml-1'>
                    {tag}
                  </span>
                ))}
              </h6>
            </div>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Опубликовал/а: </span>
              <Link to={`/user/${textUser}`}>{name}</Link>
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Уровень: </span>
              {levelStars(level)}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Категория: </span>
              {textCategories[categoryInd]}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Кол-во знаков: </span>
              {length}
            </h6>

            <TextSource textSource={source} />
            <TextDescription description={description} />

            <div>
              <CommentsBtn id={_id} comments_id={comments_id} isDark={isDark} />
              <LikeBtn likes={likes} id={_id} isDark={isDark} />

              {audioSrc === 1 && (
                <Tippy content='С аудио' theme={isDark}>
                  <span>
                    <button className='btn btn-sm btn-info disabled' disabled>
                      <i className='fas fa-headphones'></i>
                    </button>
                  </span>
                </Tippy>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const imgText = {
  fontSize: "2rem",
  color: "black",
  fontWeight: "bold",
  textShadow: "1px 1px 1px white, 2px 2px 1px white",
  position: "absolute",
  width: "5rem",
  marginTop: "-3.5rem",
  marginLeft: "1rem",
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(TextCard);
