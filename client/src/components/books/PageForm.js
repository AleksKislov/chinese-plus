import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import store from "../../store";
import axios from "axios";
import PropTypes from "prop-types";
import WordModal from "../translation/WordModal";
import { setAlert } from "../../actions/alert";
import { loadBooks, loadBook } from "../../actions/books";
import { getWords, chunkArrayFunc, segmenter, itirateWordsFromDB } from "../../actions/helpers";
import { loadUserWords } from "../../actions/userWords";
import Paragraph from "../texts/Paragraph";
import { v4 as uuid } from "uuid";
import "../texts/style.css";
import { countZnChars } from "../../actions/helpers";

const PageForm = ({ loadUserWords, user, textToEdit, loadBooks, loadBook, book, books }) => {
  useEffect(() => {
    loadBooks();
    loadUserWords();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // console.log(textToEdit);
      if (textToEdit) {
        setIsToEdit(true);
        const { origintext, translation, _id } = textToEdit;

        document.getElementById("textArea").value = origintext.join("\n");
        document.getElementById("translationArea").value = translation.join("\n");

        setFormData({
          ...formData,
          pageId: _id
        });
      }
    }, 0);
  }, [textToEdit]);

  const [bookId, setBookId] = useState("");
  const [chapterId, setChapterId] = useState("");

  useEffect(() => {
    if (bookId) loadBook(bookId);
  }, [bookId]);

  const [isToEdit, setIsToEdit] = useState(false);
  const [textLen, setTextLen] = useState(0);
  const [formData, setFormData] = useState({
    chineseChunkedWords: [],
    chunkedTranslation: [],
    chunkedOriginText: [],
    length: 0,
    allwords: [],
    chapter: "",
    bookId: "",
    pageNumber: 0,
    pageId: ""
  });

  const onSubmit = async e => {
    e.preventDefault();
    const textArea = document.getElementById("textArea");
    const translationArea = document.getElementById("translationArea");

    if (textLen > 2000) {
      store.dispatch(setAlert("Максимум 2000 знаков для страницы книги", "danger"));
    } else {
      let originText = textArea.value.trim();
      let translationTrimed = translationArea.value.trim();

      let allwords = await segmenter(originText);
      allwords = allwords.filter(word => word !== " ");
      const wordsFromDB = await getWords(allwords);

      // console.log(wordsFromDB);
      let newArr = itirateWordsFromDB(allwords, wordsFromDB);

      const length = countZnChars(originText);
      const chineseChunkedWords = chunkArrayFunc(newArr); // array of object arrays
      const chunkedTranslation = translationTrimed.split("\n"); // array of strings
      const chunkedOriginText = originText.split("\n"); // array of strings
      const pageNumber = parseInt(document.getElementById("pageNumber").value); // int

      setFormData({
        ...formData,
        chineseChunkedWords,
        chunkedTranslation,
        chunkedOriginText,
        length,
        allwords,
        chapter: chapterId,
        book: bookId,
        pageNumber
      });
    }
  };

  const publishText = async formdata => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const {
      book,
      chunkedTranslation,
      chunkedOriginText,
      length,
      allwords,
      chapter,
      pageNumber
    } = formdata;

    const body = JSON.stringify({
      origintext: chunkedOriginText,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length,
      chapter,
      book,
      page_number: pageNumber
    });

    try {
      // const { data } =
      await axios.post(`/api/books/new_chapterpage`, body, config);
      alert("Страница опубликована!");
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const editText = async formdata => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const { chunkedTranslation, chunkedOriginText, length, pageId, allwords } = formdata;

    const body = JSON.stringify({
      pageId,
      origintext: chunkedOriginText,
      translation: chunkedTranslation,
      chinese_arr: allwords,
      length
    });

    try {
      await axios.post(`/api/books/new_chapterpage`, body, config);
      alert("Текст страницы успешно изменен!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      {user && user.role !== "admin" ? (
        "Страница доступна пока только админу"
      ) : (
        <Fragment>
          <div className='row'>
            <WordModal />

            <form onSubmit={e => onSubmit(e)} style={{ width: "100%" }}>
              <fieldset>
                <div className='form-row'>
                  <div className='form-group col-md-4'>
                    <label htmlFor='title'>Название книги</label>
                    <select className='custom-select' onChange={e => setBookId(e.target.value)}>
                      <option defaultValue=''>Выбор книги</option>
                      {books &&
                        books.map(book => (
                          <option value={book._id} key={book._id}>
                            {book.chineseTitle}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='description'>Глава книги</label>
                    <select className='custom-select' onChange={e => setChapterId(e.target.value)}>
                      <option defaultValue=''>Выбор книги</option>
                      {book &&
                        book.contents &&
                        book.contents.map(chapter => (
                          <option value={chapter.chapterId} key={chapter.chapterId}>
                            {chapter.chineseTitle}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='form-group col-md-4'>
                    <label htmlFor='pageNumber'>Страница книги</label>
                    <input
                      type='text'
                      className='form-control'
                      id='pageNumber'
                      autoComplete='off'
                      placeholder='Страница'
                    />
                  </div>
                </div>

                <div className='form-row'>
                  <div className='form-group col-md-6'>
                    <label htmlFor='textArea'>Вставьте китайский текст для обработки:</label>
                    <textarea
                      onChange={e => setTextLen(e.target.value.length)}
                      className='form-control'
                      id='textArea'
                      rows='3'
                      placeholder='汉字。。。'
                    ></textarea>
                    <small className='text-muted'>{textLen}/2000</small>
                  </div>
                  <div className='form-group col-md-6'>
                    <label htmlFor='translationArea'>Вставьте перевод:</label>
                    <textarea
                      className='form-control'
                      id='translationArea'
                      rows='3'
                      placeholder='Перевод...'
                    ></textarea>
                    <small className='text-muted'>не забывайте про параграфы</small>
                  </div>
                </div>
                <div className='form-row'>
                  <button type='submit' className='btn btn-primary mx-1'>
                    Предобработка
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <hr />

          <button className='btn btn-primary mx-1' onClick={e => publishText(formData)}>
            Опубликовать
          </button>
          {isToEdit && (
            <button className='btn btn-primary mx-1' onClick={e => editText(formData)}>
              Изменить текст
            </button>
          )}

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
        </Fragment>
      )}
    </Fragment>
  );
};

PageForm.propTypes = {
  userwords: PropTypes.array.isRequired,
  loadUserWords: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  userwords: state.userwords.userwords,
  wordsLoading: state.userwords.loading,
  user: state.auth.user,
  books: state.books.books,
  book: state.books.book,
  textToEdit: state.books.page
});

export default connect(mapStateToProps, { loadUserWords, loadBooks, loadBook })(PageForm);
