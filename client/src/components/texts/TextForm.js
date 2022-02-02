import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadUserWords } from "../../actions/userWords";
import { TweenMax } from "gsap";
import {
  getPhotos,
  getWords,
  chunkArrayFunc,
  segmenter,
  itirateWordsFromDB,
  getTranslation,
  countZnChars,
} from "../../actions/helpers";
import Paragraph from "./Paragraph";
import { v4 as uuid } from "uuid";
import "./style.css";
import { bgTextLen, smTextLen, textCategories } from "../../constants/consts.json";
import { defaultTextPic } from "../../constants/urls.json";
import { clearText } from "../../actions/texts";

const TextForm = ({ loadUserWords, user, textToEdit, clearText, location }) => {
  useEffect(() => {
    loadUserWords();

    if (user && (user.role === "admin" || user.role === "moderator")) setMaxTextLen(bgTextLen);
    if (!textToEdit) setTimeout(noticeMe, 1000);
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      if (textToEdit && location.search === "?edit") {
        setIsToEdit(true);

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
        } = textToEdit;
        setPhotosUrls(pic_url);
        document.getElementById("description").value = description;
        document.getElementById("level").value = level;
        document.getElementById("categoryInd").value = categoryInd;
        document.getElementById("tags").value = tags.join(", ");
        document.getElementById("title").value = title;
        document.getElementById("textArea").value = origintext.join("\n");
        document.getElementById("translationArea").value = translation.join("\n");
        document.getElementById("theme_word").value = theme_word;
        if (source) document.getElementById("source").value = source;
        if (document.getElementById("isApproved"))
          document.getElementById("isApproved").value = isApproved ? "1" : "0";
        setIsTranslated(true);

        setFormData({
          ...formData,
          level,
          tags,
          title,
          description,
          theme_word,
          isApproved,
          categoryInd,
          source,
          textId: _id,
        });
      }
    }, 0);
  }, [textToEdit]);

  const [maxTextLen, setMaxTextLen] = useState(smTextLen);
  const [photosResult, setPhotosResult] = useState(true);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);
  const [okToPublish, setOkToPublish] = useState(false);
  const [isToEdit, setIsToEdit] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [photosUrls, setPhotosUrls] = useState(defaultTextPic);
  const [isTranslated, setIsTranslated] = useState(false);
  const [formData, setFormData] = useState({
    chineseChunkedWords: [],
    chunkedTranslation: [],
    description: "", // rewriten usestate
    title: "", // rewriten usestate
    level: 1, // rewriten usestate
    chunkedOriginText: [],
    tags: [], // rewriten usestate
    length: 0,
    allwords: [],
    textId: "",
    pic_theme: "", // in English for pic_url
    pic_url: "",
    theme_word: "", // rewriten usestate,
    source: "",
    categoryInd: 0,
  });

  const preprocessForm = async (e) => {
    e.preventDefault();

    // pics are loaded, so we can submit the form
    if (photosUrls || isToEdit) {
      const textArea = document.getElementById("textArea");

      if (textLen > maxTextLen) {
        return store.dispatch(
          setAlert(`Максимум ${maxTextLen} знаков в китайском тексте, удалите лишние`, "danger")
        );
      }

      let originText = textArea.value.trim();
      const translationArea = document.getElementById("translationArea");
      originText = originText.replace(/\n\s*\n/g, "\n");

      let allwords = await segmenter(originText);
      allwords = allwords.filter((word) => word !== " ");
      const wordsFromDB = await getWords(allwords);

      let chunkedOriginText = originText.split("\n"); // array of strings
      chunkedOriginText = chunkedOriginText.filter((chunk) => chunk);
      chunkedOriginText = chunkedOriginText.map((chunk) => chunk.trim());
      textArea.value = chunkedOriginText.join("\n\n");
      let chunkedTranslation;
      if (!isTranslated) {
        const { translation } = await getTranslation(chunkedOriginText);
        setIsTranslated(true);
        translationArea.value = translation.join("\n\n");
        chunkedTranslation = translation;
      } else {
        let translationTrimed = translationArea.value.trim();
        chunkedTranslation = translationTrimed.split("\n"); // array of strings
        chunkedTranslation = chunkedTranslation.filter((chunk) => chunk.length);
      }

      const newArr = itirateWordsFromDB(allwords, wordsFromDB);
      const length = countZnChars(originText);

      const chineseChunkedWords = chunkArrayFunc(newArr).filter((chunk) => chunk.length); // arrasy of object arrays

      setFormData({
        ...formData,
        chineseChunkedWords,
        chunkedTranslation,
        chunkedOriginText,
        length,
        allwords,
        // tags,
        // title,
        // description,
        // level,
        // theme_word
      });
    }
  };

  const loadPictures = async () => {
    if (!formData.pic_theme) return;
    const res = await getPhotos(formData.pic_theme);
    setPhotosResult(res);
    setPhotosUrls(res);
  };

  const parseTags = (text) => {
    let tags = text.replaceAll("，", ",");
    tags = tags.replaceAll("、", ",");
    tags = tags.split(",");
    tags = tags.map((tag) => tag.trim().toLowerCase()); // array of words
    setFormData({ ...formData, tags });
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
    } = formdata;

    const body = JSON.stringify({
      origintext: chunkedOriginText,
      title,
      description,
      level,
      tags,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      pic_url,
      theme_word,
      isApproved,
      categoryInd,
      source,
      name: user.name,
    });

    try {
      await axios.post(`/api/texts`, body, config);
      alert(
        "Текст отправлен на проверку и в течение суток будет опубликован. СПАСИБО, что вносите свой вклад!"
      );
      setIsRedirected(true);
    } catch (err) {
      console.log(err);
    }
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
    } = formdata;

    const body = JSON.stringify({
      textId,
      origintext: chunkedOriginText,
      title,
      description,
      level,
      tags,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      pic_url,
      theme_word,
      isApproved,
      categoryInd,
      source,
    });

    try {
      await axios.post(`/api/texts`, body, config);
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

  const noticeMe = (e) => {
    if (!isToEdit) {
      TweenMax.fromTo(
        ".noticeMe",
        { backgroundColor: "#e74c3c" },
        { duration: 2, backgroundColor: "#f39c12" }
      );
    }
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
        onClick={() => {
          loadPictures();
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
      {!user ? (
        <p>
          Страница доступна только авторизованным пользователям.{" "}
          <Link to='/login'>Залогиньтесь</Link> , пожалуйста
        </p>
      ) : (
        <Fragment>
          <div className='col-md-12'>
            <h2>Добавьте текст для Читалки</h2>
            <h4>следуя шагам ниже</h4>
            {isToEdit ? (
              <div className='alert alert-info'>
                <div className='mb-3'>
                  🙏🏻 Если вы редактируете, то меняйте любые поля, затем нажмите "ПРЕДОБРАБОТКА",
                  только потом появится кнопка "Изменить текст" <br />
                  Поле с картинкой заполнять ТОЛЬКО, если хотите ее поменять
                </div>
              </div>
            ) : (
              <p>
                🙏🏻 сделайте свой вклад в развитие платформы и преумножение доступного образования в
                Интернете
                <br />
                🔥 самое важное - поправить перевод, все остальное может сделать и админ. Спасибо
                Вам!
              </p>
            )}

            {!textToEdit && !isToEdit && (
              <div className='alert alert-warning noticeMe'>
                <div className='mb-3'>
                  {!formData.title && (
                    <Fragment>
                      <h4 className='alert-heading'>ШАГ 1</h4>
                      <p>
                        <span>
                          Заполните хотя бы заголовок. 🙏🏻 вы хорошо поможете, если заполните все
                          поля.
                        </span>
                      </p>
                    </Fragment>
                  )}

                  {
                    //   !formData.pic_theme && formData.title && (
                    //   <Fragment>
                    //     <h4 className='alert-heading'>ШАГ 2</h4>
                    //     <p>Теперь впишите тему картинки на английском языке.</p>
                    //   </Fragment>
                    // )}
                    // {formData.pic_theme && formData.title && !photosUrls && !formData.pic_url && (
                    //   <Fragment>
                    //     <h4 className='alert-heading'>ШАГ 3</h4>
                    //     <p>Загрузите картинки для выбора, нажав кнопку 'Загрузить'.</p>
                    //   </Fragment>
                    // )}
                    // {formData.title && photosUrls && !formData.pic_url && (
                    //   <Fragment>
                    //     <h4 className='alert-heading'>ШАГ 4</h4>
                    //     <p>Кликните одну из картинок, чтобы выбрать ее</p>
                    //   </Fragment>
                    // )
                  }

                  {formData.title && formData.pic_url && textLen === 0 && (
                    <Fragment>
                      <h4 className='alert-heading'>ШАГ 2</h4>
                      <p>Теперь вы можете вставить китайский текст</p>
                      <p>
                        ВНИМАНИЕ: если не нужен автоматический перевод, то кликните тумблер над
                        полем для перевода, чтобы отключить google translate
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
                          (formData.chunkedTranslation.length &&
                          formData.chunkedTranslation[0] !== ""
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
            )}

            <div className='row'>
              <WordModal />
            </div>

            <form onSubmit={(e) => preprocessForm(e)} style={{ width: "100%" }}>
              <fieldset>
                {user && user.role === "admin" && isToEdit && (
                  <div className='form-row'>
                    <div className='form-group col-md-6'>
                      <label htmlFor='isApproved'>Одобрено</label>
                      <select
                        className='form-control'
                        id='isApproved'
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
                      className={`form-control ${!formData.title && !isToEdit && "is-invalid"}`}
                      id='title'
                      placeholder='Заголовок'
                      autoComplete='off'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='description'>Краткое описание</label>
                    <input
                      onBlur={noticeMe}
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
                      type='text'
                      className={`form-control`}
                      id='description'
                      autoComplete='off'
                      placeholder='О чем или откуда этот текст...'
                    />
                  </div>
                </div>
                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='tags'>Тэги через запятую</label>
                    <input
                      onBlur={noticeMe}
                      onChange={(e) => parseTags(e.target.value)}
                      type='text'
                      className={`form-control`}
                      id='tags'
                      placeholder='Список тэгов'
                    />
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='level'>Уровень, от 1(простой) до 3(сложный)</label>
                    <select
                      className='form-control'
                      id='level'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
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
                    {
                      // `form-control ${!(formData.theme_word.length === 1 || formData.theme_word.length === 2) && "is-invalid"}`
                    }
                    <input
                      onBlur={noticeMe}
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
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
                  {photosUrls !== defaultTextPic ? readyToClick : loadPicsBtnClicked}
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

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='categoryInd'>Выбор категории</label>
                    <select
                      className='form-control'
                      id='categoryInd'
                      onChange={(e) => setFormData({ ...formData, [e.target.id]: e.target.value })}
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
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'></div>
                  {!isToEdit && (
                    <div className='form-group col-md-6 d-flex align-self-end'>
                      <div className='custom-control custom-switch mb-2'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='needGoogle'
                          checked={!isTranslated}
                          onChange={() => setIsTranslated(!isTranslated)}
                        />
                        <label className='custom-control-label text-danger' htmlFor='needGoogle'>
                          {!isTranslated ? "Мне нужен гугл-перевод" : "У меня свой перевод"}
                        </label>
                      </div>
                    </div>
                  )}
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
                      disabled={(formData.pic_url && formData.title) || isToEdit ? false : true}
                    ></textarea>
                    <small className='text-muted'>
                      {textLen}/{maxTextLen}
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
                      disabled={isTranslated || isToEdit ? false : true}
                    ></textarea>
                    <small className='text-muted'>не забывайте про параграфы</small>
                  </div>
                </div>

                <div className='form-row'>
                  {(textLen !== 0 || isToEdit) && (
                    <button
                      type='submit'
                      className='btn btn-primary mx-1'
                      onClick={() => {
                        setOkToPublish(true);
                        noticeMe();
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
                />
              ))}
          </div>
          <hr />

          <div className='col-md-12' style={{ height: "6rem" }}>
            {formData.chineseChunkedWords.length !== 0 && okToPublish && !isToEdit && (
              <div className=''>
                <button
                  className='btn btn-primary mx-1'
                  onClick={(e) => publishText(formData)}
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
            {isToEdit && okToPublish && (
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

TextForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user,
  textToEdit: state.texts.text,
});

export default connect(mapStateToProps, { loadUserWords, clearText })(TextForm);
