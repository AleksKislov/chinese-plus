import React, { useEffect, Fragment, useState } from "react";
import { connect } from "react-redux";
import { loadText, setLoading } from "../../actions/texts";
import { getComments } from "../../actions/comments";
import { parseChineseWords } from "../../actions/helpers";
import Spinner from "../layout/Spinner";
import { v4 as uuid } from "uuid";
import Paragraph from "./Paragraph";
import { Link, Redirect } from "react-router-dom";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";
import { loadUserWords } from "../../actions/userWords";
import Comment from "../comments/Comment";
import LeaveComment from "../comments/LeaveComment";
import ReadingCard from "../dashboard/ReadingCard";
import { Helmet } from "react-helmet";
import { levelStars } from "../../actions/helpers";
import FontSize from "../common/FontSize";
import PleaseShare from "../common/PleaseShare";
import ReadSwitch from "./ReadSwitch";
import ConfirmModal from "../comments/ConfirmModal";
import LikeBtn from "../common/LikeBtn";
import TextSource from "./common/TextSource";
import Pagination from "./Pagination";
import Audio from "./Audio";
import axios from "axios";

const TextPage = ({
  text,
  loadText,
  // loadLongText,
  match,
  loading,
  setLoading,
  loadUserWords,
  isAuthenticated,
  currentUser,
  getComments,
  comments,
  error404,
}) => {
  useEffect(() => {
    setLoading();
    loadText(match.params.id);
    // if (match.params.longtextid) loadLongText(match.params.longtextid);
    getComments("text", match.params.id);
  }, [setLoading, getComments]);

  useEffect(() => {
    if (!text) return;

    let txt = text;
    let givenPage = 0;
    let pagesNum = text.pages.length;
    if (text.pages && text.pages.length) {
      pagesNum = text.pages.length;
      setIsLngTxt(true);
    }
    if (match.params.page) givenPage = +match.params.page;

    if (pagesNum) {
      txt = text.pages[givenPage];
      setCurPage(givenPage);
      setPagesNum(pagesNum);
    }

    setTimeout(async () => {
      const chineseChunkedWords = await parseChineseWords(txt);
      setChineseChunkedArr(chineseChunkedWords);
    });
  }, [text]);

  useEffect(() => {
    if (isAuthenticated) loadUserWords();
  }, [isAuthenticated]);

  useEffect(() => {
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

  const [isDark, setIsDark] = useState("");
  useEffect(() => {
    setIsDark(+localStorage.isDarkTheme ? "light-border" : "");
  }, []);

  const [wantToDelete, setWantToDelete] = useState(false);
  const [isLngTxt, setIsLngTxt] = useState(false);
  const [curPage, setCurPage] = useState(0);
  const [pagesNum, setPagesNum] = useState(0);
  const [chineseChunkedArr, setChineseChunkedArr] = useState([]);
  const [hideFlag, setHideFlag] = useState(false);
  const [isOkToEdit, setIsOkToEdit] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);
  const onClick = () => setHideFlag(!hideFlag);

  const deleteText = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.delete(`/api/texts/delete/${match.params.id}`, config);
      alert("Текст успешно удален!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (isRedirected) return <Redirect to='/not_approved_texts' />;

  return (
    <Fragment>
      {loading || !text || chineseChunkedArr.length === 0 ? (
        error404 ? (
          <h3>Ошибка! Такого текста не существует :(</h3>
        ) : (
          <Spinner />
        )
      ) : (
        <div className='row'>
          <Helmet>
            <meta charSet='utf-8' />
            <title>Тексты на китайском языке с переводом | Chinese+</title>
          </Helmet>

          <WordModal />
          <WordEditModal />

          <ConfirmModal />

          <div className='col-sm-3'>
            <div className='card border-primary mb-3'>
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
                  <LikeBtn likes={text.likes} id={text._id} isDark={isDark} />
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

                {isAuthenticated && isOkToEdit && (
                  <Link to={`/edit-text?${isLngTxt ? `${`page=${curPage}`}` : ""}`}>
                    <button className='btn btn-sm btn-outline-warning'>Edit</button>
                  </Link>
                )}

                {isAuthenticated && isOkToEdit && currentUser.role === "admin" && (
                  <div className='mt-2'>
                    <button
                      onClick={() => setWantToDelete(!wantToDelete)}
                      className='btn btn-sm btn-outline-info mx-1'
                    >
                      Delete?
                    </button>

                    {wantToDelete && (
                      <button onClick={deleteText} className='btn btn-sm btn-outline-danger mx-1'>
                        Delete!
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ReadingCard />
            <PleaseShare />
          </div>

          <div className='col-sm-9'>
            <h2>
              {text.title}{" "}
              <small className='text-muted extra-smtext'>
                <i className='fas fa-eye'></i> {text.hits}
              </small>
            </h2>

            <Pagination
              pagesNum={pagesNum}
              curPage={curPage}
              setCurPage={setCurPage}
              textId={text._id}
            />

            <Link to='/texts'>
              <div className='btn btn-sm btn-outline-info'>Назад</div>
            </Link>

            <div className='btn btn-sm btn-outline-info float-right' onClick={onClick}>
              {hideFlag ? "Показать Перевод" : "Скрыть Перевод"}
            </div>

            {text && text.audioSrc === 1 && <Audio textId={text._id} title={text.title} />}

            <div className='row'>
              {chineseChunkedArr.map((chunk, ind) => (
                <Paragraph
                  chunk={chunk}
                  originTxt={!isLngTxt ? text.origintext[ind] : text.pages[curPage].origintext[ind]}
                  index={ind}
                  key={uuid()}
                  translation={
                    !isLngTxt ? text.translation[ind] : text.pages[curPage].translation[ind]
                  }
                  hideFlag={hideFlag}
                />
              ))}
            </div>

            <div className='my-2'>
              <h4>Комментарии:</h4>
              {comments.length > 0 &&
                comments.map((comment) => <Comment key={comment._id} comment={comment} />)}
              <LeaveComment _id={text._id} where={"text"} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  text: state.texts.text,
  loading: state.texts.loading,
  isAuthenticated: state.auth.isAuthenticated,
  currentUser: state.auth.user,
  comments: state.comments.currentComments,
  error404: state.texts.error,
});

export default connect(mapStateToProps, {
  loadText,
  loadUserWords,
  setLoading,
  getComments,
})(TextPage);
