import axios from "axios";
import { setAlert } from "./alert";
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
} from "./types";
import { setAuthToken, setGoogleAuth } from "../utils/setAuthToken";

//load user
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else if (localStorage.userid) {
    setGoogleAuth(localStorage.userid);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// register user
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

// login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const { data } = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

export const googleLogin = id => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ id });

  try {
    const { data } = await axios.post("/api/auth/google_success", body, config);

    dispatch({
      type: GOOGLE_LOGIN_SUCCESS,
      payload: data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    } else {
    }
    dispatch({ type: LOGIN_FAIL });
  }
};

// logout
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

/**
 * for setting daily reading goal (number of Chinese Characters to read)
 * @param {number} num - of Chinese chars to read per day
 */
export const setReadGoal = num => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const { data } = await axios.post(`/api/users/daily_reading_goal/${num}`, {}, config);

    dispatch({
      type: SET_GOAL_SUCCESS,
      payload: data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({ type: SET_GOAL_FAIL });
  }
};

export const readToday = ({ num, path, ind }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ num, path, ind });

  try {
    const { data } = await axios.post(`/api/users/read_today`, body, config);

    dispatch({
      type: READ_TODAY,
      payload: data
    });

    // dispatch(loadUser());
  } catch (err) {
    dispatch({ type: READ_TODAY_ERR });
  }
};

export const unreadToday = ({ num, path, ind }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ num, path, ind });

  try {
    const { data } = await axios.post(`/api/users/unread_today`, body, config);

    dispatch({
      type: READ_TODAY,
      payload: data
    });

    // dispatch(loadUser());
  } catch (err) {
    dispatch({ type: READ_TODAY_ERR });
  }
};

/**
 * @param {string} id           - text id
 * @param {boolean} alreadyRead   -
 */
export const markAsRead = (id, alreadyRead) => async dispatch => {
  const url = alreadyRead ? "unmark_finished_texts" : "mark_finished_texts";

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const { data } = await axios.post(`/api/texts/${url}/${id}`, {}, config);

    dispatch({
      type: MARK_TEXT_READ,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
