import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import WordEditModal from "../translation/WordEditModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import {
  getPhotos,
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  countZnChars,
  parseTags,
} from "../../actions/helpers";
import Paragraph from "./Paragraph";
import { v4 as uuid } from "uuid";
import "./style.css";
import { bgTextLen, smTextLen, textCategories } from "../../constants/consts.json";
import { defaultTextPic } from "../../constants/urls.json";
import { NullUser, User } from "../../patterns/User";

const TextEditForm = ({ loadUserWords, user, textToEdit, location }) => {
  useEffect(() => {
    loadUserWords();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!textToEdit) return;
      const {
        level,
        origintext,
        tags,
        title,
        description,
        translation,
        _id,
        theme_word,
        isApproved,
        categoryInd,
        source,
        pic_url,
        pages,
        audioSrc,
      } = textToEdit;

      let pageNum;
      let isLong = false;
      if (pages && pages.length > 1 && location.search.includes("page=")) {
        isLong = true;
        pageNum = +location.search.slice(-1);
        setPageToEdit(pageNum);
        setIsLongText(true);
      }

      let origTxt = origintext;
      let transTxt = translation;
      if (isLong) {
        origTxt = pages[pageNum].origintext;
        transTxt = pages[pageNum].translation;
      }
      const textToDisplay = origTxt.join("\n");
      document.getElementById("textArea").value = textToDisplay;
      document.getElementById("translationArea").value = transTxt.join("\n");
      setTextLen(textToDisplay.length);

      setFormData({
        ...formData,
        pic_url,
        level,
        tags: tags.join(", "),
        title,
        description,
        theme_word,
        isApproved,
        categoryInd,
        source,
        textId: _id,
        audioSrc,
      });
    });
  }, [textToEdit]);

  const [pageToEdit, setPageToEdit] = useState(null);
  const [isLongText, setIsLongText] = useState(false);
  const [photosResult, setPhotosResult] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [photosUrls, setPhotosUrls] = useState(false);
  const [formData, setFormData] = useState({
    chineseChunkedWords: [],
    chunkedTranslation: [],
    description: "", // rewriten usestate
    title: "", // rewriten usestate
    level: 1, // rewriten usestate
    chunkedOriginText: [],
    tags: "",
    length: 0,
    allwords: [],
    textId: "",
    pic_theme: "", // in English for pic_url
    pic_url: defaultTextPic,
    theme_word: "", // rewriten usestate,
    source: "",
    categoryInd: 0,
    audioSrc: 0,
  });

  const preprocessForm = async (e) => {
    e.preventDefault();
    const textArea = document.getElementById("textArea");

    if (textLen > bgTextLen) {
      return store.dispatch(
        setAlert(
          `Слишком большой текст (превышает ${bgTextLen}字). Разбейте, пожалуйста, на части`,
          "danger"
        )
      );
    }

    const translationArea = document.getElementById("translationArea");
    const originText = textArea.value.trim().replace(/\n\s*\n/g, "\n");

    let chunkedOriginText = originText.split("\n"); // array of strings
    chunkedOriginText = chunkedOriginText.filter((chunk) => chunk);
    chunkedOriginText = chunkedOriginText.map((chunk) => chunk.trim());
    textArea.value = chunkedOriginText.join("\n\n");

    let allwords = await segmenter(originText);
    allwords = allwords.filter((word) => word !== " ");
    const wordsFromDB = await getWords(allwords);
    const newArr = itirateWordsFromDB(allwords, wordsFromDB);
    const translationTrimed = translationArea.value.trim();

    setFormData({
      ...formData,
      chineseChunkedWords: chunkArrayFunc(newArr).filter((chunk) => chunk.length),
      chunkedTranslation: translationTrimed.split("\n").filter((chunk) => chunk.length),
      chunkedOriginText,
      length: countZnChars(originText),
      allwords,
    });
  };

  const loadPictures = async (e) => {
    e.preventDefault();
    if (!formData.pic_theme) return;
    const res = await getPhotos(formData.pic_theme);
    setPhotosResult(res);
    setPhotosUrls(res);
  };

  const choosePicUrl = (e) => {
    if (e.target.className !== "imgToChoose") return;

    const selectedImg = document.getElementsByClassName("imgToChooseActive");
    if (selectedImg[0]) selectedImg[0].classList.remove("imgToChooseActive");
    document.getElementById("pic_url").value = e.target.src;
    e.target.className += " imgToChooseActive";

    setFormData({
      ...formData,
      pic_url: e.target.src,
    });
  };

  const editText = async (formdata) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const {
      chunkedTranslation,
      tags,
      chunkedOriginText,
      title,
      description,
      level,
      length,
      allwords,
      textId,
      pic_url,
      theme_word,
      isApproved,
      categoryInd,
      source,
      audioSrc,
    } = formdata;

    const body = JSON.stringify({
      textId,
      origintext: chunkedOriginText,
      title,
      description,
      level,
      tags: parseTags(tags),
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      pic_url,
      theme_word,
      isApproved,
      categoryInd,
      source,
      isLongText,
      pageToEdit,
      audioSrc,
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

  const testEngInput = (str) => setIsEnglish(/^[a-zA-Z]+$/.test(str));

  if (isRedirected) return <Redirect to='/not_approved_texts' />;

  const readyToClick = <label className='text-danger'>Выберите кликом 1 из картинок ниже:</label>;
  const isNotEnglish = <label className='text-danger'>ТОЛЬКО ЛАТИНСКИЕ БУКВЫ</label>;
  const loadPicsErr = (
    <label className='text-danger'>Упс, картинок не нашлось. Попробуйте поменять слово</label>
  );

  const textForEditing = isLongText
    ? `Режим редактирования для страницы №${pageToEdit} длинного текста.`
    : `Режим редактирования: меняйте любые поля, затем нажмите "ПРЕДОБРАБОТКА",
      только потом появится кнопка "Изменить текст"`;

  const loadPicsBtn = (
    <Fragment>
      <label className={formData.pic_theme ? "text-warning" : "text-secondary"}>
        Загрузить картинки для выбора:
      </label>
      <button
        className='btn btn-sm btn-primary mx-1'
        disabled={!formData.pic_theme && !photosUrls}
        onClick={(e) => {
          loadPictures(e);
        }}
      >
        Загрузить
      </button>
      {!photosResult && loadPicsErr}
    </Fragment>
  );

  const loadPicsBtnClicked = !isEnglish && formData.pic_theme ? isNotEnglish : loadPicsBtn;

  return (
    <Fragment>
      {user.isNull ? (
        <p>
          Страница доступна только авторизованным пользователям.{" "}
          <Link to='/login'>Залогиньтесь</Link> , пожалуйста
        </p>
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>Добавьте текст для Читалки</h2>
            <h4>следуя шагам ниже</h4>

            <div className='alert alert-info'>
              <div className='mb-3'>{textForEditing}</div>
            </div>

            <div className='row'>
              <WordModal />
              <WordEditModal />
            </div>

            <form style={{ width: "100%" }}>
              <fieldset>
                {user && (user.isAdmin || user.isModerator) && (
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

                    <div className='form-group col-md-6'>
                      <label htmlFor='audioSrc'>Есть аудио</label>
                      <select
                        className='form-control'
                        id='audioSrc'
                        value={formData.audioSrc}
                        onChange={(e) =>
                          setFormData({ ...formData, [e.target.id]: +e.target.value })
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
                    <label htmlFor='title'>Заголовок текста</label>
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
                      placeholder='Заголовок'
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
                      placeholder='О чем или откуда этот текст...'
                      value={formData.description}
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
                  <div className='form-group col-md-3'>
                    <label htmlFor='pic_theme'>Тема картинки (1 слово Eng)</label>
                    <input
                      onChange={(e) => {
                        testEngInput(e.target.value);
                        setFormData({ ...formData, [e.target.id]: e.target.value });
                      }}
                      type='text'
                      className={`form-control`}
                      id='pic_theme'
                      placeholder='На английском'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-3'>
                    <label htmlFor='theme_word'>1 или 2 汉字 на картинку</label>

                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='theme_word'
                      placeholder='汉字'
                      autoComplete='off'
                      value={formData.theme_word}
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='pic_url'>URL для картинки</label>
                    <input
                      type='text'
                      className='form-control'
                      id='pic_url'
                      placeholder='Кликните картинку ниже'
                      autoComplete='off'
                      value={formData.pic_url}
                      disabled
                    />
                  </div>
                </div>
                <div className='form-row' style={{ paddingLeft: "5px" }}>
                  {photosUrls ? readyToClick : loadPicsBtnClicked}
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-12' id='photosDiv' onClick={choosePicUrl}></div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='categoryInd'>Выбор категории</label>
                    <select
                      className='form-control'
                      id='categoryInd'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      value={formData.categoryInd}
                    >
                      {textCategories.map((x, ind) => (
                        <option value={ind} key={ind}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='source'>
                      Источник: автор, книга, журнал или домен сайта (кратко)
                    </label>
                    <input
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className='form-control'
                      id='source'
                      placeholder='Источник (по желанию)'
                      autoComplete='off'
                      value={formData.source}
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='textArea'>Вставьте китайский текст для обработки:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={(e) => {
                        setTextLen(e.target.value.length);
                        setOkToPublish(false);
                      }}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='汉字。。。'
                      disabled={formData.title ? false : true}
                    ></textarea>
                    <small className='text-muted'>
                      {textLen}/{smTextLen}
                    </small>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>Исправьте автоматический перевод:</label>
                    <textarea
                      onClick={handleKeyDown}
                      onChange={() => setOkToPublish(false)}
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='Тут будет гугл-перевод, который нужно поправить! (Или вставьте свой перевод)'
                    ></textarea>
                    <small className='text-muted'>не забывайте про параграфы</small>
                  </div>
                </div>

                <div className='form-row'>
                  {textLen !== 0 && (
                    <button
                      type='submit'
                      className='btn btn-primary mx-1'
                      onClick={(e) => {
                        setOkToPublish(true);
                        preprocessForm(e);
                      }}
                    >
                      Предобработка
                    </button>
                  )}
                </div>
              </fieldset>
            </form>
          </div>
          <hr />

          <div className='row'>
            {formData &&
              formData.chineseChunkedWords.map((chunk, ind) => (
                <Paragraph
                  chunk={chunk}
                  originTxt={formData.chunkedOriginText[ind]}
                  index={ind}
                  key={uuid()}
                  translation={formData.chunkedTranslation[ind]}
                  toEdit={true}
                  toPostLongText={false}
                />
              ))}
          </div>
          <hr />

          <div className='col-md-12' style={{ height: "6rem" }}>
            {okToPublish && (
              <button className='btn btn-primary mx-1' onClick={(e) => editText(formData)}>
                Изменить Текст
              </button>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

TextEditForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
  textToEdit: state.texts.text,
});

export default connect(mapStateToProps, { loadUserWords })(TextEditForm);
