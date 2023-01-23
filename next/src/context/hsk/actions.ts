import { apiGetReq, apiDeleteReq, apiPostReq } from "../../helpers/api/request";

export const loadUserHsk2Words = async (token: string): Promise<any> => {
  try {
    return await apiGetReq("/api/words", token);
  } catch (err) {
    console.log(err);
  }
};

export const removeUserHskWord = async (wordId: number, token: string): Promise<any> => {
  try {
    return await apiDeleteReq("/api/words/" + wordId, token);
  } catch (err) {
    console.log(err);
  }
};

export const addUserHskWord = async (word: OldHskWordType, token: string): Promise<any> => {
  try {
    return await apiPostReq("/api/words/", word, token);
  } catch (err) {
    console.log(err);
  }
};
