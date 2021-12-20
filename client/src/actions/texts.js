import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT,
  LOAD_NOT_APPROVED,
  LIKE_TEXT,
  LOAD_LONG_TEXT
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

// export const loadAllTexts = () => async dispatch => {
//   try {
//     const { data } = await axios.get("/api/texts");
//     dispatch({
//       type: LOAD_TEXTS,
//       payload: data
//     });
//   } catch (err) {
//     console.log(err);
//     dispatch({
//       type: LOAD_TEXTS_ERR
//     });
//   }
// };

/**
 *
 * @param {number} len  - current length of posts array
 */
export const loadTexts = len => async dispatch => {
  let skip = len || "0";
  try {
    const { data } = await axios.get(`/api/texts/infinite?skip=${skip}`);
    dispatch({
      type: LOAD_TEXTS,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXTS_ERR
    });
  }
};

export const loadNotAppoved = len => async dispatch => {
  let skip = len || "0";
  try {
    const { data } = await axios.get(`/api/texts/not_approved?skip=${skip}`);
    dispatch({
      type: LOAD_NOT_APPROVED,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXTS_ERR
    });
  }
};

export const loadText = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/texts/${id}`);
    dispatch({
      type: LOAD_TEXT,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR
    });
  }
};

export const loadLongText = id => async dispatch => {
  try {
    const { data } = await axios.get(`/api/texts/longtext/${id}`);
    dispatch({
      type: LOAD_LONG_TEXT,
      payload: data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_TEXT_ERR
    });
  }
};

export const setLoading = _ => async dispatch => {
  dispatch({ type: SET_LOADING, payload: true });
};

export const clearText = _ => async dispatch => {
  dispatch({ type: CLEAR_TEXT });
};

export const likeText = id => async dispatch => {
  try {
    const { data } = await axios.put(`/api/texts/like/${id}`);

    dispatch({
      type: LIKE_TEXT,
      payload: { id, likes: data }
    });
  } catch (err) {
    dispatch({
      type: LOAD_TEXT_ERR
    });
    dispatch(setAlert("Нужно войти", "danger"));
  }
};
