import {
  LOAD_TEXTS,
  LOAD_TEXT,
  LOAD_TEXTS_ERR,
  LOAD_TEXT_ERR,
  SET_LOADING,
  CLEAR_TEXT,
  LOAD_NOT_APPROVED,
  GET_COMMENTS,
  ADD_COMMENT,
  LIKE_TEXT,
  LOAD_LONG_TEXT
} from "../actions/types";

const initialState = {
  texts: [],
  not_approved: [],
  moreTexts: true,
  moreNotApproved: true,
  text: null,
  longText: null,
  loading: true,
  currentComments: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_TEXTS:
      return {
        ...state,
        text: null,
        loading: false,
        texts: [...state.texts, ...payload],
        moreTexts: payload.length === 10 ? true : false
      };
    case GET_COMMENTS:
      return {
        ...state,
        currentComments: payload,
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        currentComments: payload
      };
    case LIKE_TEXT:
      return {
        ...state,
        texts: state.texts.map(text =>
          text._id === payload.id ? { ...text, likes: payload.likes } : text
        ),
        text: state.text ? { ...state.text, likes: payload.likes } : state.text
      };
    case CLEAR_TEXT:
      return {
        ...state,
        text: null,
        longText: null,
        currentComments: []
      };
    case LOAD_NOT_APPROVED:
      return {
        ...state,
        text: null,
        loading: false,
        not_approved: [...state.not_approved, ...payload],
        moreNotApproved: payload.length >= 10 ? true : false
      };
    case SET_LOADING:
      return {
        ...state,
        text: null,
        currentComments: [],
        loading: payload
      };
    case LOAD_TEXTS_ERR:
    case LOAD_TEXT_ERR:
      return {
        ...state,
        loading: false
      };

    case LOAD_TEXT:
      return {
        ...state,
        text: payload,
        loading: false
      };
    case LOAD_LONG_TEXT:
      return {
        ...state,
        longText: payload,
        loading: false
      };
    default:
      return {
        ...state
      };
  }
}
