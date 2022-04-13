import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadVideo, setLoading } from "../../actions/videos";
import { getComments } from "../../actions/comments";
import { parseWordsForVideo } from "../../actions/helpers";
import Spinner from "../layout/Spinner";
import Subs from "./Subs";
import { Link } from "react-router-dom";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import { levelStars } from "../../actions/helpers";
import FontSize from "../common/FontSize";
import PleaseShareText from "../texts/common/PleaseShareText";
// import ReadSwitch from "../texts/ReadSwitch";
import ConfirmModal from "../comments/ConfirmModal";
import LikeTextBtn from "../texts/LikeTextBtn";
import YouTubeIframeLoader from "youtube-iframe";
import { useInterval } from "../../actions/customHooks";
import { YoutubeService } from "../../patterns/YoutubeService";

const VideoPage = ({
  video,
  loadVideo,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser,
  getComments,
  comments,
}) => {
  const [curSubIndex, setSurSubIndex] = useState(0);

  const [currentMainSub, setCurrentMainSub] = useState(["."]);
  const [fullChineseSubs, setFullChineseSubs] = useState([["."]]);
  const [hideCn, setHideCn] = useState(false);
  const [hideRu, setHideRu] = useState(false);
  const [hidePinyin, setHidePinyin] = useState(false);
  const [isOkToEdit, setIsOkToEdit] = useState(false);
  const [player, setPlayer] = useState({ playerInfo: null });

  useEffect(() => {
    setLoading();
    loadVideo(match.params.id);
    getComments("video", match.params.id);
  }, [setLoading, getComments]);

  useInterval(() => {
    if (player && player.playerInfo && video) {
      const curTime = player.playerInfo.currentTime;
      const ind = video.cnSubs.findIndex((x) => {
        return +x.start < curTime && +x.start + +x.dur > curTime;
      });

      if (ind >= 0) {
        setSurSubIndex(ind);
        setCurrentMainSub(fullChineseSubs[ind]);
      }
    }
  }, 100);

  useEffect(() => {
    if (video) {
      setTimeout(async () => {
        setFullChineseSubs(await parseWordsForVideo(video.chineseArr));

        YouTubeIframeLoader.load((YT) => {
          const ytPlayer = new YT.Player("player", {
            videoId: video.source,
          });
          console.log(ytPlayer);
          setPlayer(ytPlayer);
        });
      });
    }
  }, [video]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserWords();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // console.log("render");
    if (
      currentUser &&
      video &&
      (currentUser.role === "admin" ||
        currentUser.role === "moderator" ||
        (currentUser._id === video.user && video.isApproved !== 1))
    ) {
      setIsOkToEdit(true);
    }
  }, [video, isAuthenticated]);

  const onClick = (e) => {
    const id = e.target.id;

    if (id === "ru") setHideRu(!hideRu);
    if (id === "py") setHidePinyin(!hidePinyin);
    if (id === "cn") setHideCn(!hideCn);
  };

  const pauseVideo = () => {
    if (typeof player.pauseVideo === "function") player.pauseVideo();
  };

  const playVideo = () => {
    if (typeof player.playVideo === "function") player.playVideo();
  };

  return (
    <Fragment>
      {loading || !video ? (
        <Spinner />
      ) : (
        <div className='row'>
          <Helmet>
            <meta charSet='utf-8' />
            <title>Видео на китайском языке с переводом | Chinese+</title>
          </Helmet>

          <WordModal />
          <ConfirmModal />

          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img
                className='mr-3 cardImageStyle'
                src={YoutubeService.getVideoPicUrl(video.source)}
                alt='video pic'
              />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {video.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>

                {
                  // <ReadSwitch id={video._id} />
                }

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Опубликовал/а: </span>
                  <Link to={`/user/${video.user}`}>{video.userName}</Link>
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Уровень: </span>
                  {levelStars(video.lvl)}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Кол-во знаков: </span>
                  {video.length}
                </h6>

                <FontSize />

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Описание: </span>
                  {video.desc}
                </h6>

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Благодарности: </span>
                  <LikeTextBtn likes={video.likes} id={video._id} />
                </h6>

                {isAuthenticated && isOkToEdit && (
                  <Link to={`/edit-video`}>
                    <button className='btn btn-sm btn-outline-warning'>Edit</button>
                  </Link>
                )}
              </div>
            </div>

            <ReadingCard />
            <PleaseShareText />
          </div>

          <div className='col-sm-9'>
            <h2>
              {video.title}{" "}
              <small className='text-muted extra-smtext'>
                <i className='fas fa-eye'></i> {video.hits}
              </small>
            </h2>

            <Link to='/videos'>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>

            <div className='row my-2'>
              <div className='col-sm-12'>
                <div id='player' className='embed-responsive embed-responsive-16by9'></div>
              </div>
            </div>

            <div className='row'>
              <Subs
                mainSub={fullChineseSubs[curSubIndex]}
                originTxt={video.cnSubs[curSubIndex]}
                translation={video.ruSubs[curSubIndex]}
                pinyin={video.pySubs[curSubIndex]}
                hidePinyin={hidePinyin}
                hideCn={hideCn}
                hideRu={hideRu}
                pauseVideo={pauseVideo}
                playVideo={playVideo}
              />
            </div>

            <div className='row mt-1'>
              <div className='col-sm-12'>
                <div className=''>
                  <span className='mr-1'>Скрыть</span>
                  <span className='btn-group mb-1' role='group'>
                    <button
                      className={`btn btn-sm btn-${hideCn ? "" : "outline-"}info`}
                      type='button'
                      id='cn'
                      onClick={(e) => onClick(e)}
                    >
                      Иероглифы
                    </button>
                    <button
                      type='button'
                      className={`btn btn-sm btn-${hidePinyin ? "" : "outline-"}info`}
                      id='py'
                      onClick={(e) => onClick(e)}
                    >
                      Пиньинь
                    </button>
                    <button
                      type='button'
                      className={`btn btn-sm btn-${hideRu ? "" : "outline-"}info`}
                      id='ru'
                      onClick={(e) => onClick(e)}
                    >
                      Перевод
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <div className='my-2'>
              <h4>Комментарии:</h4>
              {comments.length > 0 &&
                comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
              <LeaveComment _id={video._id} where={"video"} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  video: state.videos.video,
  loading: state.videos.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  comments: state.comments.currentComments,
});

export default connect(mapStateToProps, {
  loadVideo,
  loadUserWords,
  setLoading,
  getComments,
})(VideoPage);
