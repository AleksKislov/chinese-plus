import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadText, setLoading, loadLongText } from "../../actions/texts";
import { getComments } from "../../actions/comments";
import { parseChineseWords } from "../../actions/helpers";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "./Paragraph";
import { Link } from "react-router-dom";
import WordModal from "../translation/WordModal";
import { loadUserWords } from "../../actions/userWords";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import { levelStars } from "../../actions/helpers";
import FontSize from "../common/FontSize";
import PleaseShareText from "./common/PleaseShareText";
import ReadSwitch from "./ReadSwitch";
import ConfirmModal from "../comments/ConfirmModal";
import LikeTextBtn from "./LikeTextBtn";
import TextSource from "./common/TextSource";
import Pages from "./longText/Pages";

// (currentUser._id === text.user || currentUser.role === "admin") && (

const TextPage = ({
  text,
  loadText,
  loadLongText,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser,
  getComments,
  comments,
  longText
}) => {
  useEffect(() => {
    setLoading();
    loadText(match.params.id);
    if (match.params.longtextid) loadLongText(match.params.longtextid);
    getComments("text", match.params.id);
  }, [setLoading, getComments]);

  useEffect(() => {
    if (text) {
      setTimeout(async () => {
        const chineseChunkedWords = await parseChineseWords(text);
        setChineseChunkedArr(chineseChunkedWords);
      }, 0);
    }
  }, [text]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserWords();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // console.log("render");
    if (
      currentUser &&
      text &&
      (currentUser.role === "admin" ||
        currentUser.role === "moderator" ||
        (currentUser._id === text.user && text.isApproved !== 1))
    ) {
      setIsOkToEdit(true);
    }
  }, [text, isAuthenticated]);

  const [chineseChunkedArr, setChineseChunkedArr] = useState([]);
  const [hideFlag, setHideFlag] = useState(false);
  const [isOkToEdit, setIsOkToEdit] = useState(false);
  const onClick = () => setHideFlag(!hideFlag);

  return (
    <Fragment>
      {loading || !text || chineseChunkedArr.length === 0 ? (
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
              <img className='mr-3 cardImageStyle' src={`${text.pic_url}`} alt='text pic' />
              <div className='card-body'>
                <p className='card-text text-center'>
                  {text.tags.map((tag, ind) => (
                    <span key={ind} className='badge badge-pill badge-info mx-1'>
                      {tag}
                    </span>
                  ))}
                </p>

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Благодарности: </span>
                  <LikeTextBtn likes={text.likes} id={text._id} />
                </h6>

                <ReadSwitch id={text._id} />

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Опубликовал/а: </span>
                  <Link to={`/user/${text.user}`}>{text.name}</Link>
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Уровень: </span>
                  {levelStars(text.level)}
                </h6>
                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Кол-во знаков: </span>
                  {text.length}
                </h6>

                <TextSource textSource={text.source} />
                <FontSize />

                <h6 className='card-subtitle mb-2'>
                  <span className='text-muted'>Описание: </span>
                  {text.description}
                </h6>
                {
                  // (currentUser._id === text.user || currentUser.role === "admin") && (
                }
                {isAuthenticated && isOkToEdit && (
                  <Link to='/create-text?edit'>
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
              {text.title}{" "}
              <small className='text-muted extra-smtext'>
                <i className='fas fa-eye'></i> {text.hits}
              </small>
            </h2>

            {longText && (
              <Pages pages={longText.pages} longTextId={longText._id} currentPageId={text._id} />
            )}

            <Link to='/texts'>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>
            <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
              {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
            </div>
            <div className='row'>
              {chineseChunkedArr.map((chunk, ind) => (
                <Paragraph
                  chunk={chunk}
                  originTxt={text.origintext[ind]}
                  index={ind}
                  key={uuid()}
                  translation={text.translation[ind]}
                  hideFlag={hideFlag}
                />
              ))}
            </div>

            <div className='my-2'>
              <h4>Комментарии:</h4>
              {comments.length > 0 &&
                comments.map(comment => <Comment key={comment._id} comment={comment} />)}
              <LeaveComment _id={text._id} where={"text"} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  text: state.texts.text,
  loading: state.texts.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  comments: state.comments.currentComments,
  longText: state.texts.longText
});

export default connect(mapStateToProps, {
  loadText,
  loadUserWords,
  setLoading,
  getComments,
  loadLongText
})(TextPage);
