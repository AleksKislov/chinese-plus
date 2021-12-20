import { PROFILE_ERROR, GET_PROFILE, GET_DICTSTATS, CHANGE_FONTSIZE } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
  dictStats: {},
  fontsize: "" // for Chinese text in Paragraph
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        dictStats: {}
      };
    case GET_DICTSTATS:
      return {
        ...state,
        loading: false,
        dictStats: payload
      };
    case CHANGE_FONTSIZE:
      return {
        ...state,
        fontsize: payload
      };
    default:
      return state;
  }
}
