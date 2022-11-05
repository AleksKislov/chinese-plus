import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { levelStars, dateToStr } from "../../actions/helpers";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";
import { videoCategories } from "../../constants/consts.json";
import LikeBtn from "../common/LikeBtn";
import CommentsBtn from "../common/CommentsBtn";
import TextDescription from "../texts/common/TextDescription";
import { NullUser, User } from "../../patterns/User";
import VideoSrc from "./VideoSrc";
import { YoutubeService } from "../../patterns/YoutubeService";

const VideoCard = ({ video, user, hide, hideLevel, categoryChosen }) => {
  const {
    title,
    tags,
    length,
    desc,
    lvl,
    date,
    userName,
    comments_id,
    _id,
    hits,
    category,
    likes,
    source,
    user: videoUser,
  } = video;
  const isRead = (videoId) => (user ? user.seenVideos.includes(videoId) : false);

  useEffect(() => {
    if (hide === 0) setHideId(false);
    if (hide === 1) setHideId(isRead(_id));
    if (hide === 2) setHideId(!isRead(_id));

    setRightCategory(!categoryChosen || category === categoryChosen);
    setRightLevel(hideLevel === 0 || lvl === hideLevel);
  }, [hide, hideLevel, categoryChosen]);

  const [hideIt, setHideId] = useState(false);
  const [rightCategory, setRightCategory] = useState(true);
  const [rightLevel, setRightLevel] = useState(true);

  const dateAndTime = dateToStr(date);
  const linkTo = `/videos/${_id}`;

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  return (
    !hideIt &&
    rightCategory &&
    rightLevel && (
      <div className={`card my-2 ${isRead(_id) ? "alreadyReadCard" : ""}`}>
        {isRead(_id) && (
          <Tippy theme={isDark} content='Просмотрено'>
            <h3 className='alreadyReadMark'>
              <i className='fas fa-check-circle text-success'></i>
            </h3>
          </Tippy>
        )}

        <div className='card-body row'>
          <div style={{ position: "relative" }} className='col-md-3'>
            <Link to={linkTo}>
              <img
                className='mr-3 videoCardImg'
                src={YoutubeService.getVideoPicUrl(source)}
                alt='video pic'
              />
            </Link>
          </div>
          <div className='col-md-9'>
            <h4 className='card-title'>
              <Link to={linkTo}>{title}</Link>{" "}
              <Tippy theme={isDark}>
                {" "}
                content={`просмотров: ${hits}`}
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
              <Link to={`/user/${videoUser}`}>{userName}</Link>
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Уровень: </span>
              {levelStars(lvl)}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Категория: </span>
              {videoCategories[category]}
            </h6>
            <h6 className='card-subtitle mb-2'>
              <span className='text-muted'>Кол-во знаков: </span>
              {length}
            </h6>

            <VideoSrc source={source} />

            <TextDescription description={desc} />

            <div>
              <CommentsBtn id={_id} comments_id={comments_id} contentType={"video"} />
              <LikeBtn likes={likes} id={_id} contentType={"video"} isDark={isDark} />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
});

export default connect(mapStateToProps, {})(VideoCard);
