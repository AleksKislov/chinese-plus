import { ApiService } from "./request";

export const getUserHsk2WordsTotal = async (token: string): Promise<number> => {
  const res = await ApiService.get("/api/words", token, []);
  return res.length;
};
