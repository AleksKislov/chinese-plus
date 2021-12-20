import {
  USERWORDS_ERROR,
  USERWORDS_LOADED,
  USERWORD_ADDED,
  ADD_USERWORD_ERR,
  USERWORD_REMOVE_ERR,
  REMOVE_USERWORD,
  SET_MODAL,
  USER_WORDS_LEN_LOADED,
  DICT_RESPONDED,
  DICT_FAIL,
  SET_LOADING
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import { setAuthToken, setGoogleAuth } from "../utils/setAuthToken";

let allWordsLen;

// load all user words
export const loadUserWords = () => async dispatch => {
  try {
    const res = await axios.get(`/api/userwords`);
    dispatch({
      type: USERWORDS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERWORDS_ERROR
    });
  }
};

// add a word from text to user words
export const addWord = ({ chinese, russian: translation, pinyin }) => async dispatch => {
  loadUserWordsLen();

  let maxWordsNum = 50;

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else if (localStorage.userid) {
    setGoogleAuth(localStorage.userid);
  }

  try {
    const { data } = await axios.get("/api/auth"); // user object
    // console.log(data);

    if (data && data.moreWords) maxWordsNum += 100;
  } catch (err) {
    // console.log(err);
  }

  if (allWordsLen < maxWordsNum) {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify({ chinese, translation, pinyin });

    try {
      const res = await axios.post("/api/userwords", body, config);

      dispatch({
        type: USERWORD_ADDED,
        payload: res.data
      });
      // loadUserWords();
      dispatch(setAlert("Ваш вокабуляр пополнен", "success"));
    } catch (err) {
      dispatch({
        type: ADD_USERWORD_ERR
      });
      dispatch(setAlert("Залогиньтесь, чтобы сохранять слова в личный вокабуляр", "danger"));
    }
  } else if (allWordsLen === undefined) {
    dispatch({
      type: ADD_USERWORD_ERR
    });
    dispatch(setAlert("Залогиньтесь, чтобы сохранять слова в личный вокабуляр", "danger"));
  } else {
    dispatch({
      type: ADD_USERWORD_ERR
    });
    dispatch(setAlert(`Можно добавлять не больше ${maxWordsNum} слов в свой вокабуляр`, "danger"));
  }
};

// remove words from user TEXT vocabulary
export const removeWord = chinese => async dispatch => {
  try {
    await axios.delete("/api/userwords/" + chinese);
    dispatch({
      type: REMOVE_USERWORD,
      payload: chinese
    });
    // loadUserWords();
    dispatch(setAlert("Слово удалено из личного вокабуляра", "warning"));
  } catch (err) {
    dispatch({
      type: USERWORD_REMOVE_ERR
    });
  }
};

export const setModalWord = word => async dispatch => {
  dispatch({
    type: SET_MODAL,
    payload: word
  });
};

// load lengths
export const loadUserWordsLen = () => async dispatch => {
  try {
    const res = await axios.get("/api/userwords");
    allWordsLen = res.data.length;
  } catch (err) {
    // console.log(err);
    allWordsLen = [].length;
  }
  dispatch({
    type: USER_WORDS_LEN_LOADED,
    payload: allWordsLen
  });
};

export const puppeteerFunc = word => async dispatch => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    const res = await axios.get("/api/userwords/search/" + word);

    if (typeof res.data == "object") {
      // console.log(res.status);
      throw new Error();
    }

    let dictResponse;
    if (!res.data.includes('class="m3"')) {
      dictResponse = res.data.replace(/"m2"/g, "m3");
    } else {
      dictResponse = res.data;
    }

    if (dictResponse.includes("href")) {
      dictResponse = dictResponse.replace(/class/g, "data-class");
      dictResponse = dictResponse.replace(/href/g, "class='dict-ref' href='#' data-src");
    }

    dispatch({
      type: DICT_RESPONDED,
      payload: dictResponse
    });
  } catch (err) {
    dispatch({
      type: DICT_FAIL
    });
  }
};
