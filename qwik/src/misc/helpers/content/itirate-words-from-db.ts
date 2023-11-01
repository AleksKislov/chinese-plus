export const itirateWordsFromDB = (allwords: string[], wordsFromDB: (string | DictWord)[]) => {
  return allwords.map((word) => {
    for (let i = 0; i < wordsFromDB.length; i++) {
      if (word === (wordsFromDB[i] as DictWord).chinese) return wordsFromDB[i];
    }
    return word;
  });
};
