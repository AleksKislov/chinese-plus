import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
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
  useEffect(() => {
    loadUserWords();
  }, []);

  const [formData, setFormData] = useState({
    // isApproved: "0",
    desc: "",
    title: "",
    lvl: 1,
    tags: "",
    length: 0,
    source: "", // video id
    category: videoCategories.misc,
  });

  useEffect(() => {
    // console.log("mP9a6BXuJ78");
    if (formData.source) setOkToGetYtInfo(true);
  }, [formData.source]);

  const [useBackendPy, setUseBackendPy] = useState(true);
  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [okToGetYtInfo, setOkToGetYtInfo] = useState(false);
  const [gotYtInfo, setGotYtInfo] = useState(false);
  const [captionLangsList, setCaptionLangsList] = useState(null);
  const [mainSubLang, setMainSubLang] = useState("");
  const [pySubLang, setPySubLang] = useState("");
  const [ruSubLang, setRuSubLang] = useState("");
  const [newCnSubs, setNewCnSubs] = useState(null); // с таймингом [{start, dur, text}]
  const [newRuArr, setNewRuArr] = useState(null);
  const [newPinyinArr, setNewPinyinArr] = useState(null);
  const [linesQty, setLinesQty] = useState({ cn: 0, ru: 0, py: 0 });

  useEffect(() => {
    if (!mainSubLang) return;

    YoutubeService.getVideoCaption(formData.source, mainSubLang)
      .then(({ data }) => setNewCnSubs(data))
      .catch(console.log);
  }, [mainSubLang]);

  useEffect(() => {
    if (!pySubLang) return;

    YoutubeService.getVideoCaption(formData.source, pySubLang)
      .then(({ data }) => setNewPinyinArr(data.map((x) => x.text)))
      .catch(console.log);
  }, [pySubLang]);

  useEffect(() => {
    if (!ruSubLang) return;

    YoutubeService.getVideoCaption(formData.source, ruSubLang)
      .then(({ data }) => setNewRuArr(data.map((x) => x.text)))
      .catch(console.log);
  }, [ruSubLang]);

  useEffect(() => {
    if (!newCnSubs) return;

    const textArea = document.getElementById("textArea");
    const cnTxt = newCnSubs.reduce((prev, cur, ind) => {
      return !ind ? cur.text : prev + "\n" + cur.text;
    }, "");
    textArea.value = cnTxt.trim();
    setTextLen();
    setLinesQty({ ...linesQty, cn: newCnSubs.length });
    setDisplayedTime(newCnSubs.map((x) => parseFloat(x.start).toFixed(1)));
  }, [newCnSubs]);

  useEffect(() => {
    if (!newPinyinArr) return;

    const textArea = document.getElementById("pinyinArea");
    const pyTxt = newPinyinArr.reduce((prev, cur, ind) => {
      return !ind ? cur : prev + "\n" + cur;
    }, "");
    textArea.value = pyTxt.trim();
    setLinesQty({ ...linesQty, py: newPinyinArr.length });
  }, [newPinyinArr]);

  useEffect(() => {
    if (newRuArr) {
      const textArea = document.getElementById("translationArea");
      const ruTxt = newRuArr.reduce((prev, cur, ind) => {
        return !ind ? cur : prev + "\n" + cur;
      }, "");
      textArea.value = ruTxt.trim();
      setLinesQty({ ...linesQty, ru: newRuArr.length });
    }

    return () => {
      // setLinesQty({ ...linesQty, ru: 0 });
      // setNewRuArr(null);
    };
  }, [newRuArr]);

  const [newChineseArr, setNewChineseArr] = useState(null);
  const [displayedTime, setDisplayedTime] = useState([""]);

  const setTextLen = () => {
    const textArea = document.getElementById("textArea");
    setFormData({
      ...formData,
      length: countZnChars(textArea.value.trim()),
    });
  };

  const displayTxtTooLong = () => {
    store.dispatch(
      setAlert(`Слишком большой текст субтитров (превышает ${smTextLen}字)`, "danger")
    );
  };

  const preprocessForm = async (e) => {
    e.preventDefault();

    const textArea = document.getElementById("textArea");
    const translationArea = document.getElementById("translationArea");
    const pinyinArea = document.getElementById("pinyinArea");

    const originText = textArea.value.trim();
    const length = countZnChars(originText);
    setFormData({ ...formData, length });

    if (length > smTextLen) return displayTxtTooLong();

    const chunkedChinese = textToCleanArr(originText);
    const chunkedTranslation = textToCleanArr(translationArea.value);
    setNewCnSubs(newCnSubs.map((x, ind) => ({ ...x, text: chunkedChinese[ind] })));
    setNewRuArr(chunkedTranslation);

    const segmentedWords = (await segmenter(originText)).filter((word) => word !== " ");
    const wordsFromDB = await getWords(segmentedWords); // unordered
    const orderedCnWordsFromDB = itirateWordsFromDB(segmentedWords, wordsFromDB);
    const chineseChunkedWords = chunkArrayFunc(orderedCnWordsFromDB).filter(
      (chunk) => chunk.length
    );
    setNewChineseArr(chineseChunkedWords);

    let chunkedPinyin;
    if (useBackendPy) {
      const { data } = await YoutubeService.getTextPinyin(JSON.stringify(segmentedWords));
      chunkedPinyin = data.map((line) => line.join(" "));
      pinyinArea.value = chunkedPinyin.join("\n");
    } else {
      chunkedPinyin = textToCleanArr(pinyinArea.value);
    }
    setNewPinyinArr(chunkedPinyin);

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
    const { title, desc, lvl, tags, length, category, source } = formData;
    const cnSegmentedSubs = newChineseArr.map((chunk) => chunk.map((x) => x.chinese));

    const ruCategories = Object.values(videoCategories);
    const engCategories = Object.keys(videoCategories);
    const categoryInd = ruCategories.indexOf(category);

    const body = JSON.stringify({
      // isApproved,
      title,
      desc,
      lvl,
      length,
      source,
      category: engCategories[categoryInd],
      tags: parseTags(tags),
      cnSubs: newCnSubs,
      chineseArr: cnSegmentedSubs,
      ruSubs: newRuArr,
      pySubs: newPinyinArr,
      userName: user.name,
    });

    try {
      await YoutubeService.createVideo(body);
      alert("Видео успешно добавлено!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const getVideoInfo = async () => {
    try {
      const {
        data: { tags, title, description: desc, captionLangs },
      } = await YoutubeService.getVideoInfo(formData.source);

      setFormData({ ...formData, title, tags: tags ? tags.join(", ") : "", desc });
      setCaptionLangsList(captionLangs);
      setGotYtInfo(true);
    } catch (err) {
      console.warn(err);
    }
  };

  if (isRedirected) return <Redirect to='/not_approved_videos' />;

  const onlyForAuthenticated = (
    <p>
      Страница доступна только авторизованным пользователям. <Link to='/login'>Залогиньтесь</Link> ,
      пожалуйста
    </p>
  );

  /**
   * @param {Object} e - event
   * @param {string} where - ru, py or cn
   */
  const onTxtChange = (e, where) => {
    setLinesQty({ ...linesQty, [where]: e.target.value.split("\n").length });
    setOkToPublish(false);
  };

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
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='source'>Источник</label>
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
                    <label htmlFor='title'>Название</label>
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

                {okToGetYtInfo && !gotYtInfo && (
                  <div className='form-row'>
                    <button className='btn btn-primary mx-1' onClick={getVideoInfo}>
                      Получить информацию
                    </button>
                    <span className='mt-2'>для видео с id {formData.source}</span>
                  </div>
                )}

                {gotYtInfo && (
                  <Fragment>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='description'>Описание (кратко)</label>
                        <input
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          type='text'
                          className={`form-control`}
                          id='desc'
                          autoComplete='off'
                          placeholder='Кратко про это видео...'
                          value={formData.desc}
                        />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='tags'>Тэги (через запятую)</label>
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
                        <label htmlFor='category'>Категория</label>
                        <select
                          className='form-control'
                          id='category'
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
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
                        <label htmlFor='lvl'>Уровень, от 1 (простой) до 3 (сложный)</label>
                        <select
                          className='form-control'
                          id='lvl'
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          value={formData.lvl}
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                    </div>

                    <div className='form-row'>
                      <div className='col-md-12'>
                        <h5 className='text-info'>
                          Загрузите соответствующие субтитры, при необходимости поправьте их
                        </h5>
                        <small>
                          Пиньинь можно загрузить из готовых субтитров на youtube или с нашего
                          бэкенда (возможно, придется поправить немного)
                        </small>
                      </div>

                      <div className='form-group col-md-4'>
                        <label htmlFor='mainSub'>Китайский (основной с таймингом)</label>
                        <select
                          className='form-control'
                          id='mainSub'
                          onChange={(e) => setMainSubLang(e.target.value)}
                          value={mainSubLang}
                        >
                          {captionLangsList &&
                            ["", ...captionLangsList].map((lang, ind) => (
                              <option key={ind}>{lang}</option>
                            ))}
                        </select>
                      </div>
                      <div className='form-group col-md-3'>
                        <label htmlFor='pySub'>Пиньинь</label>
                        <select
                          disabled={!mainSubLang || useBackendPy}
                          className='form-control'
                          id='pySub'
                          onChange={(e) => setPySubLang(e.target.value)}
                          value={pySubLang}
                        >
                          {captionLangsList &&
                            ["", ...captionLangsList].map((lang, ind) => (
                              <option key={ind}>{lang}</option>
                            ))}
                        </select>

                        <div className='btn-group mt-1' role='group'>
                          <button
                            type='button'
                            className={`btn btn-sm btn-${useBackendPy ? "" : "outline-"}info`}
                            onClick={() => setUseBackendPy(true)}
                          >
                            backend
                          </button>
                          <button
                            type='button'
                            className={`btn btn-sm btn-${!useBackendPy ? "" : "outline-"}info`}
                            onClick={() => setUseBackendPy(false)}
                          >
                            youtube
                          </button>
                        </div>
                      </div>
                      <div className='form-group col-md-5'>
                        <label htmlFor='ruSub'>Перевод (рус.)</label>
                        <select
                          disabled={!mainSubLang}
                          className='form-control'
                          id='ruSub'
                          onChange={(e) => setRuSubLang(e.target.value)}
                          value={ruSubLang}
                        >
                          {captionLangsList &&
                            ["", ...captionLangsList].map((lang, ind) => (
                              <option key={ind}>{lang}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {mainSubLang && (
                      <Fragment>
                        <div className='form-row'>
                          <div className='form-group col-md-1'>
                            <label htmlFor='textArea'>сек.</label>
                            <p id='videoSecs' className='text-muted'>
                              {displayedTime.map((sec, ind) => (
                                <Fragment key={ind}>
                                  <span>{sec}</span>
                                  <br />
                                </Fragment>
                              ))}
                            </p>
                          </div>

                          <div className='form-group col-md-3'>
                            <label htmlFor='textArea'>
                              китайский | <span className='text-info'>строк {linesQty.cn}</span>
                            </label>
                            <textarea
                              onClick={handleKeyDown}
                              onChange={(e) => {
                                onTxtChange(e, "cn");
                                setTextLen();
                              }}
                              className='form-control'
                              id='textArea'
                              rows='3'
                              placeholder='汉字。。。'
                            ></textarea>
                            <small className='text-muted'>
                              {formData.length || 0} / {smTextLen} 字
                            </small>
                          </div>
                          <div className='form-group col-md-3'>
                            <label htmlFor='pinyinArea'>
                              пиньинь | <span className='text-info'>строк {linesQty.py}</span>
                            </label>
                            <textarea
                              onClick={handleKeyDown}
                              onChange={(e) => onTxtChange(e, "py")}
                              className='form-control'
                              id='pinyinArea'
                              rows='3'
                              placeholder='Пиньинь'
                            ></textarea>
                          </div>

                          <div className='form-group col-md-5'>
                            <label htmlFor='translationArea'>
                              перевод | <span className='text-info'>строк {linesQty.ru}</span>
                            </label>
                            <textarea
                              onClick={handleKeyDown}
                              onChange={(e) => onTxtChange(e, "ru")}
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
                Опубликовать Видео
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
