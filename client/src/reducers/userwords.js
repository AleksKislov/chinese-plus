import {
  USERWORDS_ERROR,
  USERWORDS_LOADED,
  REMOVE_USERWORD,
  SET_MODAL,
  USER_WORDS_LEN_LOADED,
  DICT_RESPONDED,
  DICT_FAIL,
  SET_LOADING
} from "../actions/types";

const initialState = {
  userwords: [],
  loading: false,
  modalWord: { chinese: "字", russian: "иероглиф", pinyin: "zì" },
  userWordsLen: 0,
  dictResponse: null
};

export default function(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case USERWORDS_LOADED:
      return {
        ...state,
        userwords: payload,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: payload
      };
    case USERWORDS_ERROR:
      return {
        ...state,
        userwords: [],
        loading: false
      };
    case REMOVE_USERWORD:
      return {
        ...state,
        userwords: state.userwords.filter(word => word.chinese !== payload),
        loading: false
      };
    case SET_MODAL:
      return {
        ...state,
        modalWord: payload
      };
    case USER_WORDS_LEN_LOADED:
      return {
        ...state,
        userWordsLen: payload
      };
    case DICT_RESPONDED:
      return {
        ...state,
        dictResponse: payload,
        loading: false
      };
    case DICT_FAIL:
      return {
        ...state,
        dictResponse: "<p>Упс, БКРС не отвечает :(</p>",
        loading: false
      };
    default:
      return state;
  }
}
