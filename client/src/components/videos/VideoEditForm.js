import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import {
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  textToCleanArr,
  countZnChars,
  parseTags,
  // getTranslation,
} from "../../actions/helpers";
// import { v4 as uuid } from "uuid";
// import "./style.css";
import { videoCategories, smTextLen } from "../../constants/consts.json";
import { NullUser, User } from "../../patterns/User";
import { YoutubeService } from "../../patterns/YoutubeService";
import SubLine from "./SubLine";
import { clearVideos } from "../../actions/videos";

const VideoEditForm = ({ loadUserWords, user, videoToEdit, clearVideos }) => {
  useEffect(() => {
    loadUserWords();
  }, []);

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

      setDisplayedTime(cnSubs.map((line) => parseFloat(line.start).toFixed(1)));
      document.getElementById("textArea").value = chineseArr
        .map((word) => word.join(" "))
        .join("\n");
      document.getElementById("pinyinArea").value = pySubs.join("\n");
      document.getElementById("translationArea").value = ruSubs.join("\n");

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
    isApproved: "0",
    desc: "",
    title: "",
    lvl: 1,
    tags: "",
    length: 0,
    videoId: "",
    source: "",
    category: videoCategories.misc,
  });

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
        setAlert(`?????????????? ?????????????? ?????????? ?????????????????? (?????????????????? ${smTextLen}???)`, "danger")
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
        setAlert(`??????-???? ?????????? ????????????????, ?????????????? ?? ??????. ???????????? ???????????? ??????????????????`, "danger")
      );
    }

    setOkToPublish(true);
  };

  const editVideo = async (formData) => {
    const { videoId, title, desc, lvl, tags, length, isApproved, category, source } = formData;
    const cnSegmentedSubs = newChineseArr.map((chunk) => chunk.map((x) => x.chinese));

    const ruCategories = Object.values(videoCategories);
    const engCategories = Object.keys(videoCategories);
    const categoryInd = ruCategories.indexOf(category);

    const body = JSON.stringify({
      videoId,
      title,
      desc,
      lvl,
      tags: parseTags(tags),
      chineseArr: cnSegmentedSubs,
      ruSubs: newRuArr,
      pySubs: newPinyinArr,
      length,
      isApproved,
      category: engCategories[categoryInd],
      source,
    });

    try {
      await YoutubeService.updateVideo(body);
      alert("?????????? ?????????????? ??????????????????!");
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  if (isRedirected) {
    clearVideos();
    return <Redirect to='/not_approved_videos' />;
  }

  const onlyForAuthenticated = (
    <p>
      ???????????????? ???????????????? ???????????? ???????????????????????????? ??????????????????????????. <Link to='/login'>????????????????????????</Link> ,
      ????????????????????
    </p>
  );

  return (
    <Fragment>
      {user.isNull ? (
        onlyForAuthenticated
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>???????????????????????????? ?????????? ?? ????????????????????</h2>

            <div className='row'>
              <WordModal />
              <WordEditModal />
            </div>

            <form onSubmit={(e) => preprocessForm(e)} style={{ width: "100%" }}>
              <fieldset>
                {user.isAdmin && (
                  <div className='form-row'>
                    <div className='form-group col-md-6'>
                      <label htmlFor='isApproved'>????????????????</label>
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
                    <label htmlFor='title'>????????????????</label>
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
                      placeholder='????????????????'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='description'>???????????????? (????????????)</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='desc'
                      autoComplete='off'
                      placeholder='???????????? ?????? ?????? ??????????...'
                      value={formData.desc}
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='tags'>???????? (?????????? ??????????????)</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='tags'
                      placeholder='???????????? ??????????'
                      value={formData.tags}
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='lvl'>??????????????, ???? 1 (??????????????) ???? 3 (??????????????)</label>
                    <select
                      className='form-control'
                      id='lvl'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      value={formData.lvl}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='category'>??????????????????</label>
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
                    <label htmlFor='source'>????????????????</label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className='form-control'
                      id='source'
                      placeholder='Id ??????????'
                      autoComplete='off'
                      value={YoutubeService.getSrcLink(formData.source)}
                      disabled
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-1'>
                    <label htmlFor='textArea'>??????:</label>
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
                    <label htmlFor='textArea'>?????????????????? ??????????:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='???????????????'
                    ></textarea>
                    <small className='text-muted'>
                      {formData.length || 0} / {smTextLen}
                    </small>
                  </div>
                  <div className='form-group col-md-3'>
                    <label htmlFor='translationArea'>??????????????:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='pinyinArea'
                      rows='3'
                      placeholder='??????????????'
                    ></textarea>

                    {
                      // <small className='text-muted'>???? ?????????????????? ?????? ??????????????????</small>
                    }
                  </div>

                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>??????????????:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => {
                        setTextLen();
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='?????? ??????????????'
                    ></textarea>

                    {
                      // <small className='text-muted'>???? ?????????????????? ?????? ??????????????????</small>
                    }
                  </div>
                </div>

                <div className='form-row'>
                  <button type='submit' className='btn btn-primary mx-1'>
                    ??????????????????????????
                  </button>
                </div>
              </fieldset>
            </form>
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
              <button className='btn btn-primary mx-1' onClick={(e) => editVideo(formData)}>
                ???????????????? ??????????
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
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
  videoToEdit: state.videos.video,
});

export default connect(mapStateToProps, { loadUserWords, clearVideos })(VideoEditForm);
