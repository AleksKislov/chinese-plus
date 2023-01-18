type HskLvlSizeMap = {
  [key: string]: number;
};

type NewHskWordType = {
  _id: string;
  id: number;
  cn: string;
  py: string;
  ru: string;
  lvl: string;
};

type OldHskWordType = {
  _id: string;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

type TestWord = {
  chinese: string;
  level: string;
  id: number;
  pinyin: string;
  translation: string;
};
