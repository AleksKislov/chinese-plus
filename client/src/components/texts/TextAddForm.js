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
import { TweenMax } from "gsap";
import {
  getPhotos,
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  // getTranslation,
  countZnChars,
  parseTags,
} from "../../actions/helpers";
import Paragraph from "./Paragraph";
import { v4 as uuid } from "uuid";
import "./style.css";
import { bgTextLen, smTextLen, textCategories } from "../../constants/consts.json";
import { defaultTextPic } from "../../constants/urls.json";
import { NullUser, User } from "../../patterns/User";

const TextAddForm = ({ loadUserWords, user, location }) => {
  useEffect(() => {
    loadUserWords();
    setTimeout(noticeMe, 1000);
  }, []);

  const [isLongText, setIsLongText] = useState(false);
  const [photosResult, setPhotosResult] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [photosUrls, setPhotosUrls] = useState(false);
  const [isTranslated, setIsTranslated] = useState(true); // пока что не работает
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

  useEffect(() => {
    if (textLen > smTextLen) {
      // setIsTranslated(true);
      setIsLongText(true);
      store.dispatch(
        setAlert(`У вас большой текст (превышает ${smTextLen}字). Автоперевод недоступен`, "danger")
      );
    } else {
      // setIsTranslated(false);
      setIsLongText(false);
    }
  }, [textLen]);

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

    let allwords, chineseChunkedWords;
    if (!isLongText) {
      allwords = await segmenter(originText);
      allwords = allwords.filter((word) => word !== " ");
      const wordsFromDB = await getWords(allwords);
      const newArr = itirateWordsFromDB(allwords, wordsFromDB);
      chineseChunkedWords = chunkArrayFunc(newArr).filter((chunk) => chunk.length);
    } else {
      chineseChunkedWords = chunkedOriginText;
    }

    let chunkedTranslation;
    if (!isTranslated) {
      // const { translation } = await getTranslation(chunkedOriginText);
      // setIsTranslated(true);
      // translationArea.value = translation.join("\n\n");
      // chunkedTranslation = translation;
    } else {
      let translationTrimed = translationArea.value.trim();
      chunkedTranslation = translationTrimed.split("\n"); // array of strings
      chunkedTranslation = chunkedTranslation.filter((chunk) => chunk.length);
    }

    const length = countZnChars(originText);

    setFormData({
      ...formData,
      chineseChunkedWords,
      chunkedTranslation,
      chunkedOriginText,
      length,
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
    document.getElementById("pic_theme_url").value = e.target.src;
    e.target.className += " imgToChooseActive";

    setFormData({
      ...formData,
      pic_url: e.target.src,
    });
  };

  const publishText = async (formdata) => {
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
      pic_url,
      theme_word,
      isApproved,
      categoryInd,
      source,
      audioSrc,
    } = formdata;

    const body = JSON.stringify({
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
      name: user.name,
      isLongText,
      audioSrc,
    });

    try {
      await axios.post(`/api/texts/create`, body, config);
      alert(
        "Текст отправлен на проверку и в течение суток будет опубликован. СПАСИБО, что вносите свой вклад!"
      );
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyDown = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const noticeMe = () => {
    TweenMax.fromTo(
      ".noticeMe",
      { backgroundColor: "#e74c3c" },
      { duration: 2, backgroundColor: "#f39c12" }
    );
  };

  const testEngInput = (str) => setIsEnglish(/^[a-zA-Z]+$/.test(str));

  if (isRedirected) return <Redirect to='/not_approved_texts' />;

  const readyToClick = <label className='text-danger'>Выберите кликом 1 из картинок ниже:</label>;
  const isNotEnglish = <label className='text-danger'>ТОЛЬКО ЛАТИНСКИЕ БУКВЫ</label>;
  const loadPicsErr = (
    <label className='text-danger'>Упс, картинок не нашлось. Попробуйте поменять слово</label>
  );

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
          noticeMe();
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

            <p>
              🙏🏻 сделайте свой вклад в развитие платформы и преумножение доступного образования в
              Интернете
              <br />
              🔥 самое важное - поправить перевод, все остальное может сделать и админ. Спасибо Вам!
            </p>

            <div className='alert alert-warning noticeMe'>
              <div className='mb-3'>
                {!formData.title && (
                  <Fragment>
                    <h4 className='alert-heading'>ШАГ 1</h4>
                    <p>
                      <span>
                        Заполните хотя бы заголовок. 🙏🏻 вы хорошо поможете, если заполните все поля.
                      </span>
                    </p>
                  </Fragment>
                )}

                {formData.title && textLen === 0 && (
                  <Fragment>
                    <h4 className='alert-heading'>ШАГ 2</h4>
                    <p>Теперь вы можете вставить китайский текст</p>
                    <p>
                      ВНИМАНИЕ: если не нужен автоматический перевод, то кликните тумблер над полем
                      для перевода, чтобы отключить google translate
                    </p>
                  </Fragment>
                )}

                {textLen > 0 && formData.chineseChunkedWords.length === 0 && (
                  <Fragment>
                    <h4 className='alert-heading'>ШАГ 3</h4>
                    <p>Нажмите кнопку 'Предобработка' для обработки и перевода текста</p>
                  </Fragment>
                )}

                {formData.chineseChunkedWords.length !== 0 && (
                  <Fragment>
                    <h4 className='alert-heading'>ШАГ 4</h4>
                    <p>
                      <span>
                        Поправьте русский перевод и китайский оригинал при необходимости (после
                        снова нажмитее 'Предобработка').
                        <br />
                        🔥 Если результат устраивает, то можете нажать 'Опубликовать'.
                        <br />
                        🛑 китайские слова можно отделить пробелами, если они выделены неверно.
                        <br />
                        🙏🏻 вы хорошо поможете, если заполните все поля (описание и тэги)
                      </span>
                    </p>
                  </Fragment>
                )}
              </div>
              <div className='progress' style={{ border: "none" }}>
                <div
                  className={`progress-bar bg-${
                    formData.chunkedOriginText.length && formData.chunkedOriginText[0] !== ""
                      ? "success"
                      : "info"
                  }`}
                  role='progressbar'
                  style={{
                    width: `${
                      ((formData.title ? 1 : 0) +
                        (formData.description ? 1 : 0) +
                        (formData.tags.length && formData.tags[0] !== "" ? 1 : 0) +
                        (formData.pic_theme ? 1 : 0) +
                        (formData.theme_word ? 1 : 0) +
                        (formData.pic_url !== defaultTextPic ? 1 : 0) +
                        (photosUrls ? 1 : 0) +
                        (formData.chunkedOriginText.length && formData.chunkedOriginText[0] !== ""
                          ? 1
                          : 0) +
                        (formData.chunkedTranslation.length && formData.chunkedTranslation[0] !== ""
                          ? 1
                          : 0) +
                        1) *
                      10
                    }%`,
                  }}
                  aria-valuenow='25'
                  aria-valuemin='0'
                  aria-valuemax='100'
                ></div>
              </div>
            </div>

            <div className='row'>
              <WordModal />
              <WordEditModal />
            </div>

            <form style={{ width: "100%" }}>
              <fieldset>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='title'>Заголовок текста</label>
                    <input
                      onBlur={noticeMe}
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
                  <div className='col-md-6'>
                    <div className='mb-2'>Можно и без них, но лучше заполнить 🙂</div>
                    <div>
                      <a
                        className='btn btn-primary'
                        data-toggle='collapse'
                        href='#collapseExample'
                        role='button'
                        aria-expanded='false'
                        aria-controls='collapseExample'
                      >
                        Заполнить остальные поля
                      </a>
                    </div>
                  </div>
                </div>

                <div className='collapse' id='collapseExample'>
                  <div className='bg-light'>
                    <div className='form-row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='description'>Краткое описание</label>
                        <input
                          onBlur={noticeMe}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          type='text'
                          className={`form-control`}
                          id='description'
                          autoComplete='off'
                          placeholder='О чем или откуда этот текст...'
                        />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='tags'>Тэги через запятую</label>
                        <input
                          onBlur={noticeMe}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          type='text'
                          className={`form-control`}
                          id='tags'
                          placeholder='Список тэгов'
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-3'>
                        <label htmlFor='level'>Уровень</label>
                        <select
                          className='form-control'
                          id='level'
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                        >
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                        </select>
                      </div>
                      <div className='form-group col-md-3'>
                        <label htmlFor='categoryInd'>Категория</label>
                        <select
                          className='form-control'
                          id='categoryInd'
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
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
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          type='text'
                          className='form-control'
                          id='source'
                          placeholder='Источник (по желанию)'
                          autoComplete='off'
                        />
                      </div>
                    </div>
                    <div className='form-row'>
                      <div className='form-group col-md-3'>
                        <label htmlFor='pic_theme'>Тема картинки (1 слово Eng)</label>
                        <input
                          onBlur={noticeMe}
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
                          onBlur={noticeMe}
                          onChange={(e) =>
                            setFormData({ ...formData, [e.target.id]: e.target.value })
                          }
                          type='text'
                          className={`form-control`}
                          id='theme_word'
                          placeholder='汉字'
                          autoComplete='off'
                        />
                      </div>
                      <div className='form-group col-md-6'>
                        <label htmlFor='pic_theme_url'>URL для картинки</label>
                        <input
                          type='text'
                          className='form-control'
                          id='pic_theme_url'
                          placeholder='Кликните картинку ниже'
                          autoComplete='off'
                          disabled
                        />
                      </div>
                    </div>
                    <div className='form-row' style={{ paddingLeft: "5px" }}>
                      {photosUrls ? readyToClick : loadPicsBtnClicked}
                    </div>
                    <div className='form-row'>
                      <div
                        className='form-group col-md-12'
                        id='photosDiv'
                        onClick={(e) => {
                          choosePicUrl(e);
                          noticeMe();
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {
                  // <div className='form-row'>
                  // <div className='form-group col-md-6'></div>
                  // <div className='form-group col-md-6 d-flex align-self-end'>
                  //   <div className='custom-control custom-switch mb-2'>
                  //     <input
                  //       type='checkbox'
                  //       className='custom-control-input'
                  //       id='needGoogle'
                  //       checked={!isTranslated}
                  //       onChange={() => setIsTranslated(!isTranslated)}
                  //       disabled={isLongText }
                  //     />
                  //     <label className='custom-control-label text-danger' htmlFor='needGoogle'>
                  //       {!isTranslated ? "Нужен гугл-перевод" : "Вставьте свой перевод"}
                  //     </label>
                  //   </div>
                  // </div>
                  // </div>
                }

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
                      disabled={!formData.title}
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
                      placeholder='Автоматический перевод пока что не работает! Вставьте, пожалуйста, свой перевод (или скопируйте с гугл-транслейт вручную)'
                      disabled={!isTranslated}
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
                        noticeMe();
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
                  toPostLongText={isLongText}
                />
              ))}
          </div>
          <hr />

          <div className='col-md-12' style={{ height: "6rem" }}>
            {formData.chineseChunkedWords.length !== 0 && okToPublish && (
              <div className=''>
                <button
                  className='btn btn-primary mx-1'
                  onClick={() => publishText(formData)}
                  disabled={
                    formData.chunkedTranslation.length !== formData.chineseChunkedWords.length
                  }
                >
                  Опубликовать
                </button>

                {formData.chunkedTranslation.length !== formData.chineseChunkedWords.length && (
                  <span className='text-danger'>
                    Кол-во параграфов оригинала и перевода не совпадает!
                  </span>
                )}
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

TextAddForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user ? new User(state.auth.user) : new NullUser(),
  textToEdit: state.texts.text,
});

export default connect(mapStateToProps, { loadUserWords })(TextAddForm);
