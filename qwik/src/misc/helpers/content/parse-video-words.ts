import { itirateWordsFromDB } from "./itirate-words-from-db";

export function parseVideoWords(chineseArr: string[][], tooltipWords: (string | DictWord)[][]) {
  const arr = [];
  for (let i = 0; i < chineseArr.length; i++) {
    arr.push(itirateWordsFromDB(chineseArr[i], tooltipWords[i]));
  }
  return arr;
}
