import {
  LOAD_VIDEOS,
  LOAD_VIDEO,
  LOAD_VIDEOS_ERR,
  LOAD_VIDEO_ERR,
  CLEAR_VIDEO,
  CLEAR_VIDEOS,
  LOAD_NOT_APPROVED_VIDS,
  LIKE_VIDEO,
  SET_LOADING,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";

/**
 * @param {number} skip  - current length of posts array
 * @param {string} category - video theme / category
 */
export const loadVideos =
  (skip = 0, category = "") =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/videos/infinite?skip=${skip}&category=${category}`);
      dispatch({
        type: LOAD_VIDEOS,
        payload: data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: LOAD_VIDEOS_ERR,
      });
    }
  };

export const loadNotAppoved = (len) => async (dispatch) => {
  let skip = len || "0";
  try {
    const { data } = await axios.get(`/api/videos/not_approved?skip=${skip}`);
    dispatch({
      type: LOAD_NOT_APPROVED_VIDS,
      payload: data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOAD_VIDEOS_ERR,
    });
  }
};

export const loadVideo = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/videos/${id}`);
    dispatch({
      type: LOAD_VIDEO,
      payload: data,
    });
  } catch (err) {
    dispatch({
      type: LOAD_VIDEO_ERR,
    });
  }
};

export const setLoading = (_) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
};

export const clearVideo = (_) => async (dispatch) => {
  dispatch({ type: CLEAR_VIDEO });
};

export const clearVideos = (_) => async (dispatch) => {
  dispatch({ type: CLEAR_VIDEOS });
};

export const likeVideo = (id) => async (dispatch) => {
  try {
    const { data } = await axios.put(`/api/videos/like/${id}`);

    dispatch({
      type: LIKE_VIDEO,
      payload: { id, likes: data },
    });
  } catch (err) {
    dispatch({
      type: LOAD_VIDEO_ERR,
    });
    dispatch(setAlert("Нужно войти", "danger"));
  }
};
