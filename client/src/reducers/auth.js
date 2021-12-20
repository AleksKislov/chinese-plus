import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
  SET_GOAL_SUCCESS,
  SET_GOAL_FAIL,
  READ_TODAY,
  READ_TODAY_ERR,
  GOOGLE_LOGIN_SUCCESS,
  MARK_TEXT_READ
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case READ_TODAY_ERR:
    case SET_GOAL_FAIL:
      return state;
    case USER_LOADED:
    case READ_TODAY:
    case MARK_TEXT_READ:
    case SET_GOAL_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case GOOGLE_LOGIN_SUCCESS:
      localStorage.setItem("userid", payload._id);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    default:
      return state;
  }
}
