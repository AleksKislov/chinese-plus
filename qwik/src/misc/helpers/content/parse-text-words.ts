import { itirateWordsFromDB } from "./itirate-words-from-db";

export const parseTextWords = (chineseArr: string[], wordsFromDB: (string | DictWord)[]) => {
  const newArr = itirateWordsFromDB(chineseArr, wordsFromDB);
  return chunkTxtArr(newArr).filter((chunk) => Boolean(chunk)); // array of object arrays
};

const chunkTxtArr = (arr: (string | DictWord)[]): (string | DictWord)[][] => {
  // get indexes for \n in the array of words
  const inds = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "\n") inds.push(i);
  }

  const chunkedArr = [];

  for (let i = 0; i < inds.length; i++) {
    if (i === 0) {
      chunkedArr.push(arr.slice(0, inds[i]));
    } else {
      chunkedArr.push(arr.slice(inds[i - 1] + 1, inds[i]));
    }
  }
  chunkedArr.push(arr.slice(inds[inds.length - 1] + 1));

  return chunkedArr;
};
