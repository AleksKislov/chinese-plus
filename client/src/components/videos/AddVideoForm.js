import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import {
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  countZnChars,
  textToCleanArr,
  parseTags,
  // getTranslation,
} from "../../actions/helpers";
// import { v4 as uuid } from "uuid";
// import "./style.css";
import { videoCategories, smTextLen } from "../../constants/consts.json";
import { NullUser, User } from "../../patterns/User";
import { YoutubeService } from "../../patterns/YoutubeService";
import SubLine from "./SubLine";

const AddVideoForm = ({ loadUserWords, user }) => {
  useEffect(() => loadUserWords(), []);

  const [formData, setFormData] = useState({
    isApproved: "0",
    desc: "",
    title: "",
    lvl: 1,
    tags: "",
    length: 0,
    source: "",
    category: videoCategories.misc,
  });

  useEffect(() => {
    if (formData.source) setOkToGetYtInfo(true);
  }, [formData.source]);

  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [okToGetYtInfo, setOkToGetYtInfo] = useState(false);
  const [gotYtInfo, setGotYtInfo] = useState(false);

  const [newChineseArr, setNewChineseArr] = useState(null);
  const [newRuArr, setNewRuArr] = useState(null);
  const [newCnSubs, setNewCnSubs] = useState(null);
  const [newPinyinArr, setNewPinyinArr] = useState(null);
  const [displayedTime, setDisplayedTime] = useState([""]);

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

    const originText = textArea.value.trim();
    const length = countZnChars(originText);
    setFormData({ ...formData, length });

    if (length > smTextLen) {
      return store.dispatch(
        setAlert(`Слишком большой текст субтитров (превышает ${smTextLen}字)`, "danger")
      );
    }

    const chunkedTranslation = textToCleanArr(translationArea.value);
    const chunkedPinyin = textToCleanArr(pinyinArea.value);
    setNewPinyinArr(chunkedPinyin);
    setNewRuArr(chunkedTranslation);

    const segmentedWords = (await segmenter(originText)).filter((word) => word !== " ");
    const wordsFromDB = await getWords(segmentedWords); // unordered
    const orderedCnWordsFromDB = itirateWordsFromDB(segmentedWords, wordsFromDB);
    const chineseChunkedWords = chunkArrayFunc(orderedCnWordsFromDB).filter(
      (chunk) => chunk.length
    );

    setNewChineseArr(chineseChunkedWords);

    const okToPost =
      chunkedTranslation.length === chunkedPinyin.length &&
      chunkedPinyin.length === chineseChunkedWords.length;

    if (!okToPost) {
      return store.dispatch(
        setAlert(`Кол-во строк перевода, пиньиня и кит. текста должно совпадать`, "danger")
      );
    }

    setOkToPublish(true);
  };

  const publishVideo = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { title, desc, lvl, tags, length, isApproved, category, source } = formData;
    const cnSegmentedSubs = newChineseArr.map((chunk) => chunk.map((x) => x.chinese));

    const body = JSON.stringify({
      title,
      desc,
      lvl,
      length,
      isApproved,
      category,
      source,
      tags: parseTags(tags),
      cnSubs: newCnSubs,
      chineseArr: cnSegmentedSubs,
      ruSubs: newRuArr,
      pySubs: newPinyinArr,
    });

    try {
      await axios.post(`/api/videos/create`, body, config);
      alert("Видео успешно добавлено!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const changeCategory = (e) => {
    const ruCategory = e.target.value;
    const ruCategories = Object.values(videoCategories);
    const engCategories = Object.keys(videoCategories);
    const categoryInd = ruCategories.indexOf(ruCategory);
    setFormData({ ...formData, category: engCategories[categoryInd] });
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (isRedirected) return <Redirect to='/not_approved_videos' />;

  const onlyForAuthenticated = (
    <p>
      Страница доступна только авторизованным пользователям. <Link to='/login'>Залогиньтесь</Link> ,
      пожалуйста
    </p>
  );

  return (
    <Fragment>
      {user.isNull ? (
        onlyForAuthenticated
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>Добавить видео с субтитрами</h2>

            <div className='row'>
              <WordModal />
            </div>

            <div style={{ width: "100%" }}>
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
                    <label htmlFor='source'>Источник:</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control ${!formData.source && "is-invalid"}`}
                      id='source'
                      placeholder='Id видео'
                      autoComplete='off'
                      value={formData.source}
                    />
                  </div>
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
                      disabled={!gotYtInfo}
                    />
                  </div>
                </div>

                {okToGetYtInfo && (
                  <div className='form-row'>
                    <button className='btn btn-primary mx-1'>Получить информацию</button>
                    <span className='mt-2'>для видео с id {formData.source}</span>
                  </div>
                )}

                {gotYtInfo && (
                  <Fragment>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='description'>Краткое описание</label>
                        <input
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          type='text'
                          className={`form-control`}
                          id='description'
                          autoComplete='off'
                          placeholder='Кратко про это видео...'
                          value={formData.desc}
                        />
                      </div>
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
                    </div>

                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='category'>Выбор категории</label>
                        <select
                          className='form-control'
                          id='category'
                          onChange={changeCategory}
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
                        <label htmlFor='level'>Уровень, от 1(простой) до 3(сложный)</label>
                        <select
                          className='form-control'
                          id='level'
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          value={formData.level}
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                    </div>

                    <div className='form-row'>
                      <div className='form-group col-md-1'>
                        <label htmlFor='textArea'>Сек:</label>
                        <p id='videoSecs' className='text-muted'>
                          {displayedTime.map((sec, ind) => (
                            <Fragment key={ind}>
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
                      <button
                        type='submit'
                        className='btn btn-primary mx-1'
                        onClick={preprocessForm}
                      >
                        Предобработка
                      </button>
                    </div>
                  </Fragment>
                )}
              </fieldset>
            </div>
          </div>
          <hr />

          <div className='row'>
            {newChineseArr &&
              newRuArr &&
              newPinyinArr &&
              newChineseArr.map((chunk, ind) => (
                <SubLine
                  key={ind}
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
              <button className='btn btn-primary mx-1' onClick={(e) => publishVideo(formData)}>
                Изменить Видео
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

AddVideoForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
  videoToEdit: state.videos.video,
});

export default connect(mapStateToProps, { loadUserWords })(AddVideoForm);
