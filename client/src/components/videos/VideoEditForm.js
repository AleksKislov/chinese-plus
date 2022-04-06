import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
// import { TweenMax } from "gsap";
import {
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  getTranslation,
  countZnChars,
} from "../../actions/helpers";
import { v4 as uuid } from "uuid";
// import "./style.css";
import { videoCategories, smTextLen } from "../../constants/consts.json";
import { NullUser, User } from "../../patterns/User";
import { YoutubeService } from "../../patterns/YoutubeService";
import SubLine from "./SubLine";

const VideoEditForm = ({ loadUserWords, userToCheck, videoToEdit }) => {
  const [user, setUser] = useState(new NullUser());

  useEffect(() => {
    if (!userToCheck) return;
    setUser(new User(userToCheck));
    loadUserWords();
  }, [userToCheck]);

  useEffect(() => {
    setTimeout(() => {
      if (!videoToEdit) return;

      const {
        _id,
        title,
        desc,
        category,
        cnSubs, //  {start: String, dur: String, text: String}
        pySubs,
        ruSubs,
        chineseArr,
        tags,
        lvl,
        isApproved,
        source,
        length,
      } = videoToEdit;

      console.log("input", chineseArr);
      // document.getElementById("videoSecs").innerHTML = cnSubs.map((line) => line.start).join("\n");
      setDisplayedTime(cnSubs.map((line) => line.start));
      document.getElementById("textArea").value = chineseArr
        .map((word) => word.join(" "))
        .join("\n");
      document.getElementById("pinyinArea").value = pySubs.join("\n");
      document.getElementById("translationArea").value = ruSubs.join("\n");

      // document.getElementById("translationArea").value = transTxt.join("\n");

      setFormData({
        lvl,
        tags: tags.join(", "),
        title,
        desc,
        isApproved,
        category: videoCategories[category],
        source,
        videoId: _id,
        length,
      });
    });
  }, [videoToEdit]);

  const [newChineseArr, setNewChineseArr] = useState(null);
  const [newRuArr, setNewRuArr] = useState(null);
  const [newPinyinArr, setNewPinyinArr] = useState(null);
  const [displayedTime, setDisplayedTime] = useState([""]);
  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [formData, setFormData] = useState({
    desc: "",
    title: "",
    lvl: 1,
    tags: "",
    length: 0,
    videoId: "",
    source: "",
    category: videoCategories.misc,
  });

  const textToCleanArr = (txt) => {
    return txt
      .split("\n")
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  };

  const setTextLen = () => {
    const textArea = document.getElementById("textArea");
    setFormData({
      ...formData,
      length: countZnChars(textArea.value.trim()),
    });
  };

  const preprocessForm = async (e) => {
    e.preventDefault();

    const textArea = document.getElementById("textArea");
    const translationArea = document.getElementById("translationArea");
    const pinyinArea = document.getElementById("pinyinArea");

    // if (textLen > smTextLen) {
    //   return store.dispatch(
    //     setAlert(
    //       `Слишком большой текст (превышает ${bgTextLen}字). Разбейте, пожалуйста, на части`,
    //       "danger"
    //     )
    //   );
    // }

    const originText = textArea.value.trim();
    const length = countZnChars(originText);

    // const chunkedOriginText = textToCleanArr(originText);
    const chunkedTranslation = textToCleanArr(translationArea.value);
    const chunkedPinyin = textToCleanArr(pinyinArea.value);

    const segmentedWords = (await segmenter(originText)).filter((word) => word !== " ");
    const wordsFromDB = await getWords(segmentedWords);
    const orderedCnWordsFromDB = itirateWordsFromDB(segmentedWords, wordsFromDB);
    const chineseChunkedWords = chunkArrayFunc(orderedCnWordsFromDB).filter(
      (chunk) => chunk.length
    );
    // console.log("дб", chineseChunkedWords);

    setNewChineseArr(chineseChunkedWords);
    setNewPinyinArr(chunkedPinyin);
    setNewRuArr(chunkedTranslation);

    setFormData({
      ...formData,
      length,
    });
  };

  const parseTags = (text) => {
    let tags = text.replaceAll("，", ",");
    tags = tags.replaceAll("、", ",");
    return tags.split(",").map((tag) => tag.trim().toLowerCase()); // array of words
  };

  const editVideo = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { videoId, title, desc, lvl, tags, length, isApproved, category, source } = formData;

    const body = JSON.stringify({
      videoId,
      title,
      desc,
      lvl,
      tags: parseTags(tags),
      // origintext: chunkedOriginText,
      // translation: chunkedTranslation,
      // chinese_arr: allwords,
      length,
      isApproved,
      category,
      source,
    });

    try {
      await axios.post(`/api/texts/update`, body, config);
      alert("Текст успешно изменен!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // const testEngInput = (str) => setIsEnglish(/^[a-zA-Z]+$/.test(str));

  if (isRedirected) return <Redirect to='/not_approved_videos' />;

  const onlyFotAuthenticated = (
    <p>
      Страница доступна только авторизованным пользователям. <Link to='/login'>Залогиньтесь</Link> ,
      пожалуйста
    </p>
  );

  return (
    <Fragment>
      {!user ? (
        onlyFotAuthenticated
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>Отредактируйте видео с субтитрами</h2>

            <div className='row'>
              <WordModal />
            </div>

            <form onSubmit={(e) => preprocessForm(e)} style={{ width: "100%" }}>
              <fieldset>
                {user.isAdmin && (
                  <div className='form-row'>
                    <div className='form-group col-md-6'>
                      <label htmlFor='isApproved'>Одобрено</label>
                      <select
                        className='form-control'
                        id='isApproved'
                        value={formData.isApproved}
                        onChange={(e) =>
                          setFormData({ ...formData, [e.target.id]: parseInt(e.target.value) })
                        }
                      >
                        <option>0</option>
                        <option>1</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='title'>Название видео</label>
                    <input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          [e.target.id]: e.target.value,
                        });
                      }}
                      type='text'
                      className={`form-control ${!formData.title && "is-invalid"}`}
                      id='title'
                      placeholder='Название'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='description'>Краткое описание</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='description'
                      autoComplete='off'
                      placeholder='Кратко про это видео...'
                      value={formData.desc}
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='tags'>Тэги через запятую</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='tags'
                      placeholder='Список тэгов'
                      value={formData.tags}
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='level'>Уровень, от 1(простой) до 3(сложный)</label>
                    <select
                      className='form-control'
                      id='level'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      value={formData.level}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='categoryInd'>Выбор категории</label>
                    <select
                      className='form-control'
                      id='category'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      value={formData.category}
                    >
                      {Object.keys(videoCategories).map((key, ind) => (
                        <option value={videoCategories[key]} key={ind}>
                          {videoCategories[key]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='source'>Источник:</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className='form-control'
                      id='source'
                      placeholder='Id видео'
                      autoComplete='off'
                      value={YoutubeService.getSrcLink(formData.source)}
                      disabled
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-1'>
                    <label htmlFor='textArea'>Сек:</label>
                    <p id='videoSecs' className='text-muted'>
                      {displayedTime.map((sec) => (
                        <Fragment>
                          <span>{sec}</span>
                          <br />
                        </Fragment>
                      ))}
                    </p>
                  </div>

                  <div className='form-group col-md-2'>
                    <label htmlFor='textArea'>Поправьте текст:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='汉字。。。'
                    ></textarea>
                    <small className='text-muted'>
                      {formData.length || 0} / {smTextLen}
                    </small>
                  </div>
                  <div className='form-group col-md-3'>
                    <label htmlFor='translationArea'>пиньинь:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='pinyinArea'
                      rows='3'
                      placeholder='Пиньинь'
                    ></textarea>

                    {
                      // <small className='text-muted'>не забывайте про параграфы</small>
                    }
                  </div>

                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>перевод:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        console.log("here");
                        setTextLen();
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='Ваш перевод'
                    ></textarea>

                    {
                      // <small className='text-muted'>не забывайте про параграфы</small>
                    }
                  </div>
                </div>

                <div className='form-row'>
                  {
                    <button
                      type='submit'
                      className='btn btn-primary mx-1'
                      onClick={() => {
                        setOkToPublish(true);
                      }}
                    >
                      Предобработка
                    </button>
                  }
                </div>
              </fieldset>
            </form>
          </div>
          <hr />

          <div className='row'>
            {okToPublish &&
              newChineseArr &&
              newRuArr &&
              newPinyinArr &&
              newChineseArr.map((chunk, ind) => (
                <SubLine
                  chunk={chunk}
                  translation={newRuArr[ind]}
                  pinyin={newPinyinArr[ind]}
                  subTime={displayedTime[ind]}
                />
              ))}
          </div>
          <hr />

          <div className='col-md-12' style={{ height: "6rem" }}>
            {okToPublish && (
              <button className='btn btn-primary mx-1' onClick={(e) => editVideo(formData)}>
                Изменить Видео
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

VideoEditForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  userToCheck: state.auth.user,
  videoToEdit: state.videos.video,
});

export default connect(mapStateToProps, { loadUserWords })(VideoEditForm);
