import {
  HSK_LOADED,
  HSK_ERROR,
  WORDS_ERROR,
  WORDS_LOADED,
  WORD_ADDED,
  ADD_WORD_ERR,
  REMOVE_WORD,
  WORD_REMOVE_ERR,
  WORDS_BY_LEVEL_LOADED,
  WORDS_LENGTHS_LOADED,
  HSK_TEST_LOADED,
  HSK_TEST_ERROR,
  SET_LOADING,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import { setAuthToken, setGoogleAuth } from "../utils/setAuthToken";
import { users } from "../constants/consts.json";

// load all HSK lexicon at hsk-table
export const loadLexicon = (hskLevel, limit) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    const res = await axios.get(`/api/lexicon?hsk_level=${hskLevel}&limit=${limit}`);
    dispatch({
      type: HSK_LOADED,
      payload: { lexicons: res.data },
    });
  } catch (err) {
    dispatch({
      type: HSK_ERROR,
    });
  }
};

export const loadTestLexicon = (hskLevel) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/lexicon/all?hsk_level=${hskLevel}`);
    dispatch({
      type: HSK_TEST_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: HSK_TEST_ERROR,
    });
  }
};

// load selected words for user by hsk level
export const loadWordsByLevel = (hsk_level) => async (dispatch) => {
  try {
    const res = await axios.get("/api/words/all?hsk_level=" + hsk_level);

    dispatch({
      type: WORDS_BY_LEVEL_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: WORDS_ERROR,
    });
  }
};

// load selected words for user
export const loadWords = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/words");

    dispatch({
      type: WORDS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: WORDS_ERROR,
    });
  }
};

let allWordsLen;

// load lengths
export const loadLengths = () => async (dispatch) => {
  let hskLen = [];
  try {
    const { data } = await axios.get("/api/words");

    allWordsLen = data.length;
    for (let i = 1; i <= 6; i++) {
      hskLen.push(data.filter((word) => word.level === i).length);
    }
  } catch (err) {
    console.log(err);
    allWordsLen = [].length;
  }
  dispatch({
    type: WORDS_LENGTHS_LOADED,
    payload: { allWordsLen, hskLen },
  });
};

// add a word from hsk table to user
export const addWord =
  ({ chinese, translation, pinyin, level, word_id }) =>
  async (dispatch) => {
    loadLengths();

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    } else if (localStorage.userid) {
      setGoogleAuth(localStorage.userid);
    }

    if (allWordsLen < users.vocabSize) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({ chinese, translation, pinyin, level, word_id });

      try {
        const { data } = await axios.post("/api/words", body, config);

        dispatch({
          type: WORD_ADDED,
          payload: data,
        });

        dispatch(setAlert("Личный список HSK пополнен", "success"));
      } catch (err) {
        dispatch({
          type: ADD_WORD_ERR,
        });
        dispatch(setAlert("Залогиньтесь, чтобы сохранять слова в личный вокабуляр", "danger"));
      }
    } else if (allWordsLen === undefined) {
      dispatch({
        type: ADD_WORD_ERR,
      });
      dispatch(setAlert("Залогиньтесь, чтобы сохранять слова в личный вокабуляр", "danger"));
    } else {
      dispatch({
        type: ADD_WORD_ERR,
      });
      dispatch(
        setAlert(`Можно добавлять не больше ${users.vocabSize} слов в свой вокабуляр`, "danger")
      );
    }
  };

// remove words from user vocabulary
export const removeWord = (word_id) => async (dispatch) => {
  try {
    await axios.delete("/api/words/" + word_id);
    dispatch({
      type: REMOVE_WORD,
      payload: word_id,
    });

    dispatch(setAlert("Слово удалено", "warning"));
  } catch (err) {
    dispatch({
      type: WORD_REMOVE_ERR,
    });
  }
};

export const setLoading = () => (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
};
