import { ApiService } from "./request";

export type UserWord = {
  _id: ObjectId;
  chinese: string;
  pinyin: string;
  translation: string;
  date: ISODate;
};

export const getUserWords = (token: string): Promise<UserWord[]> => {
  return ApiService.get(`/api/userwords`, token, []);
};
