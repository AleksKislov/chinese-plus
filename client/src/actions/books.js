import {
  LOAD_BOOKS,
  LOAD_BOOK,
  LOAD_BOOKS_ERR,
  LOAD_BOOK_ERR,
  CLEAR_BOOK,
  SET_LOADING,
  LOAD_PAGE,
  CLEAR_PAGE
} from "./types";
import axios from "axios";

export const loadBooks = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/books/allbooks");
    dispatch({
      type: LOAD_BOOKS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_BOOKS_ERR
    });
  }
};

export const loadBook = id => async dispatch => {
  setLoading();

  try {
    const { data } = await axios.get(`/api/books/get_book/${id}`);

    dispatch({
      type: LOAD_BOOK,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_BOOK_ERR
    });
  }
};

export const loadPage = id => async dispatch => {
  setLoading();

  try {
    const { data } = await axios.get(`/api/books/get_page/${id}`);

    dispatch({
      type: LOAD_PAGE,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_BOOK_ERR
    });
  }
};

export const clearBook = _ => async dispatch => {
  dispatch({ type: CLEAR_BOOK });
};

export const clearPage = _ => async dispatch => {
  dispatch({ type: CLEAR_PAGE });
};

export const setLoading = _ => async dispatch => {
  dispatch({ type: SET_LOADING, payload: true });
};
