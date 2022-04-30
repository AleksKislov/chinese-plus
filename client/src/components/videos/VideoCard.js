import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { levelStars, dateToStr } from "../../actions/helpers";
import Tippy from "@tippyjs/react";
import { connect } from "react-redux";
import { videoCategories } from "../../constants/consts.json";
import LikeBtn from "../common/LikeBtn";
import TextDescription from "../texts/common/TextDescription";
import { NullUser, User } from "../../patterns/User";
import VideoSrc from "./VideoSrc";
import { YoutubeService } from "../../patterns/YoutubeService";

const VideoCard = ({
  video,
  user,
  // hide, category, hideLevel
}) => {
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
  // useEffect(() => {
  //   if (hide === 0) setHideId(false);
  //   if (hide === 1) setHideId(isRead(_id));
  //   if (hide === 2) setHideId(!isRead(_id));
  //   // console.log({ category, category });
  //   setRightCategory(category === 0 || category === categoryInd + 1);
  //   setRightLevel(hideLevel === 0 || lvl === hideLevel);
  // }, [hide, category, hideLevel]);

  const isRead = (videoId) => (user ? user.seenVideos.includes(videoId) : false);
  const [hideIt, setHideId] = useState(false);
  const [rightCategory, setRightCategory] = useState(true);
  const [rightLevel, setRightLevel] = useState(true);

  const dateAndTime = dateToStr(date);
  const linkTo = `/videos/${_id}`;

  return (
    !hideIt &&
    rightCategory &&
    rightLevel && (
      <div className={`card my-2 ${isRead(_id) ? "alreadyReadCard" : ""}`}>
        {isRead(_id) && (
          <Tippy content='Просмотрено'>
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
              <Tippy content={`просмотров: ${hits}`}>
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

            <div className=''>
              <Link to={linkTo}>
                <button className='btn btn-sm btn-outline-info mr-2'>
                  Комментарии {comments_id.length > 0 && <span>{comments_id.length}</span>}
                </button>
              </Link>
              <LikeBtn likes={likes} id={_id} contentType={"video"} />
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
