import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT,
  CLEAR_TEXTS,
  LOAD_NOT_APPROVED,
  LIKE_TEXT,
  LOAD_LONG_TEXT,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

/**
 * @param {number} skip  - current length of posts array
 * @param {number|undefined} categoryInd - text theme / category
 */
export const loadTexts =
  (skip = 0, categoryInd, level, withAudio) =>
  async (dispatch) => {
    try {
      const categoryParam = categoryInd === -1 ? "" : `&categoryInd=${categoryInd}`;
      const levelParam = !+level ? "" : `&level=${level}`;
      const audioParam = withAudio ? "&audioSrc=1" : "";

      const { data } = await axios.get(
        `/api/texts/infinite?skip=${skip}${categoryParam}${levelParam}${audioParam}`
      );
      dispatch({
        type: LOAD_TEXTS,
        payload: data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: LOAD_TEXTS_ERR,
      });
    }
  };

export const loadNotAppoved = (len) => async (dispatch) => {
  let skip = len || "0";
  try {
    const { data } = await axios.get(`/api/texts/not_approved?skip=${skip}`);
    dispatch({
      type: LOAD_NOT_APPROVED,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXTS_ERR,
    });
  }
};

export const loadText = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/texts/${id}`);
    dispatch({
      type: LOAD_TEXT,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR,
    });
  }
};

export const loadLongText = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/texts/longtext/${id}`);
    dispatch({
      type: LOAD_LONG_TEXT,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXT_ERR,
    });
  }
};

export const setLoading = (_) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
};

export const clearText = (_) => async (dispatch) => {
  dispatch({ type: CLEAR_TEXT });
};

export const clearTexts = (_) => async (dispatch) => {
  dispatch({ type: CLEAR_TEXTS });
};

export const likeText = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/texts/like/${id}`);

    dispatch({
      type: LIKE_TEXT,
      payload: { id, likes: data },
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR,
    });
    dispatch(setAlert("Нужно войти", "danger"));
  }
};
