import { apiGetReq, apiPostReq } from "../../helpers/api/request";

export const login = async (email: string, password: string): Promise<any> => {
  try {
    return await apiPostReq("/api/auth", { email, password });
  } catch (err) {
    console.log(err);
  }
};

export const loadUser = async (token: string | undefined): Promise<UserFromBE | null> => {
  if (!token) return null;
  try {
    return await apiGetReq("/api/auth", token);
  } catch (err) {
    console.log(err);
    return null;
  }
};
