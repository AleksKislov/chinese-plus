import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadVideo, setLoading } from "../../actions/videos";
import { getComments } from "../../actions/comments";
import { parseChineseWords } from "../../actions/helpers";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "../texts/Paragraph";
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
import ReadSwitch from "../texts/ReadSwitch";
import ConfirmModal from "../comments/ConfirmModal";
import LikeTextBtn from "../texts/LikeTextBtn";
import TextSource from "../texts/common/TextSource";

const VideoPage = ({
  video,
  loadVideo,
  // loadLongText,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser,
  getComments,
  comments,
}) => {
  useEffect(() => {
    setLoading();
    loadVideo(match.params.id);
    getComments("video", match.params.id);
  }, [setLoading, getComments]);

  useEffect(() => {
    if (video) {
      // setTimeout(async () => {
      //   const chineseChunkedWords = await parseChineseWords(txt);
      //   setChineseChunkedArr(chineseChunkedWords);
      // });
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

  const [isLngTxt, setIsLngTxt] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [pagesNum, setPagesNum] = useState(0);
  const [chineseChunkedArr, setChineseChunkedArr] = useState([]);
  const [hideFlag, setHideFlag] = useState(false);
  const [isOkToEdit, setIsOkToEdit] = useState(false);
  const onClick = () => setHideFlag(!hideFlag);

  return (
    <Fragment>
      {loading || !video || chineseChunkedArr.length === 0 ? (
        <Spinner />
      ) : (
        <div className='row'>
          <Helmet>
            <meta charSet='utf-8' />
            <title>Тексты на китайском языке с переводом | Chinese+</title>
          </Helmet>

          <WordModal />
          <ConfirmModal />

          <div className='col-sm-3'>
            <div className='card bg-light mb-3'>
              <img className='mr-3 cardImageStyle' src={`${video.picUrl}`} alt='video pic' />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {video.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Благодарности: </span>
                  <LikeTextBtn likes={video.likes} id={video._id} />
                </h6>

                <ReadSwitch id={video._id} />

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

                <TextSource textSource={video.source} />
                <FontSize />

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Описание: </span>
                  {video.desc}
                </h6>

                {isAuthenticated && isOkToEdit && (
                  <Link to={`/create-video?edit`}>
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

            <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
              {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
            </div>

            <div className='row'>
              {
                //   chineseChunkedArr.map((chunk, ind) => (
                //   <Paragraph
                //     chunk={chunk}
                //     originTxt={text.origintext[ind]}
                //     index={ind}
                //     key={uuid()}
                //     translation={
                //       !isLngTxt ? text.translation[ind] : text.pages[curPage].translation[ind]
                //     }
                //     hideFlag={hideFlag}
                //   />
                // ))
              }
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
