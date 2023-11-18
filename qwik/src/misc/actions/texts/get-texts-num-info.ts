import { type TextsNumInfo } from "~/routes/read/texts";
import { ApiService } from "../request";

export const getTextsNumInfo = (): Promise<TextsNumInfo> => {
  return ApiService.get(`/api/texts/texts_num`, undefined, {});
};
