import { apiGetReq, apiPostReq } from "../../helpers/api/request";

export const login = async (email: string, password: string): Promise<any> => {
  try {
    return await apiPostReq("/api/auth", { email, password });
  } catch (err) {
    console.log(err);
    // dispatch(setAlert(error.msg, "danger")));
    // dispatch({ type: LOGIN_FAIL });
  }
};

export const loadUser = async (token: string): Promise<any> => {
  try {
    return await apiGetReq("/api/auth", token);
  } catch (err) {
    console.log(err);
  }
};
