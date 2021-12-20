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
  HSK_TEST_ERROR,
  HSK_TEST_LOADED,
  SET_LOADING
} from "../actions/types";

const initialState = {
  lexicons: [],
  loading: true,
  wordsLoading: true,
  words: [],
  allWordsLen: 0,
  hskLen: [],
  errors: null,
  pagesNumber: 1,
  testLexicon: []
};

export default function(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload
      };
    case HSK_LOADED:
      return {
        ...state,
        lexicons: payload.lexicons,
        loading: false,
        pagesNumber: payload.pagesNumber
      };
    case HSK_TEST_LOADED:
      return {
        ...state,
        testLexicon: payload,
        loading: false
      };
    case WORDS_BY_LEVEL_LOADED:
      return {
        ...state,
        words: payload,
        wordsLoading: false
      };
    case WORDS_LOADED:
      return {
        ...state,
        words: payload,
        wordsLoading: false
      };
    case WORDS_LENGTHS_LOADED:
      return {
        ...state,
        allWordsLen: payload.allWordsLen,
        hskLen: payload.hskLen
      };
    case HSK_ERROR:
      return {
        ...state,
        lexicons: [],
        loading: false
      };
    case HSK_TEST_ERROR:
      return {
        ...state,
        testLexicon: [],
        loading: false
      };
    case WORD_ADDED:
      return {
        ...state,
        words: [...state.words, payload],
        allWordsLen: [...state.words, payload].length
      };
    case REMOVE_WORD:
      return {
        ...state,
        words: state.words.filter(word => word.word_id !== payload)
      };
    case ADD_WORD_ERR:
    case WORD_REMOVE_ERR:
      return {
        ...state,
        errors: [{ msg: "Ошибка при добавлении/удалении слова" }]
      };
    case WORDS_ERROR:
      return {
        ...state,
        words: [],
        wordsLoading: false
      };
    default:
      return state;
  }
}
