import { markUpRuText } from "./mark-up-ru-text";
// import { sanitizer } from "./sanitizer";

export const parseRussian = (translation: string, showExamples: boolean): string => {
  if (!translation) return " ";
  let russian = markUpRuText(translation, showExamples);

  // shorten words from dictionary/allwords
  if (russian.length > 1000) {
    const ind = russian.slice(500, russian.length).indexOf("<span class='tippyExample block'>");
    russian = russian.slice(0, ind + 500);
  }

  return russian;
};
