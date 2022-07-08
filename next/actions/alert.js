import { SET_ALERT, REMOVE_ALERT, REMOVE_PREVIOUS } from "./types";
import { v4 as uuid } from "uuid";

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid();
  dispatch({
    type: REMOVE_PREVIOUS
  });

  setTimeout(() => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id }
    });
  }, 100);

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      }),
    4000
  );
};
