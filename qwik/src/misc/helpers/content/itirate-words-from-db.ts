export const itirateWordsFromDB = (allwords: string[], wordsFromDB: (string | DictWord)[]) => {
  const wordsByChinese = new Map<string, DictWord>();
  for (const w of wordsFromDB) {
    const dictWord = w as DictWord;
    if (dictWord.chinese) wordsByChinese.set(dictWord.chinese, dictWord);
  }

  return allwords?.map((word) => wordsByChinese.get(word) ?? word);
};
