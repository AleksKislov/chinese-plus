import axios from "axios";
import { setAlert } from "./alert";
import { PROFILE_ERROR, GET_PROFILE, GET_DICTSTATS, CHANGE_FONTSIZE } from "./types";

//get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? "Profile updated" : "Profile created", "info"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getDictStats = () => async dispatch => {
  try {
    const pinyin = axios.get("/api/dictionary/certain/pinyin");
    const eng = axios.get("/api/dictionary/certain/eng");
    const all = axios.get("/api/dictionary/certain/all");
    const ref = axios.get("/api/dictionary/certain/ref");

    const arr = await Promise.all([pinyin, eng, all, ref]);

    // console.table({ pinyin: pinyin.data, eng: eng.data, all: all.data });
    dispatch({
      type: GET_DICTSTATS,
      payload: { pinyin: arr[0].data, eng: arr[1].data, all: arr[2].data, ref: arr[3].data }
      // payload: { pinyin: pinyin.data, eng: eng.data, all: all.data, ref: ref.data }
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

/**
 * suffix for className for Paragraph
 * @param {string} size - "-bg" || "-sm" || ""
 */
export const changeFontSize = size => async dispatch => {
  dispatch({
    type: CHANGE_FONTSIZE,
    payload: size
  });
};
