// Pure helpers for dictionary search queries. Kept out of the route file so that
// components (e.g. DictionarySearch) can use them without importing a route module.

export const isRussian = (str: string): boolean => {
  return /[Ѐ-ӿ]/.test(str);
};

export const isChinese = (str: string): boolean => {
  return /\p{Script=Han}/u.test(str);
};

export const isPinyin = (str: string): boolean => {
  return /^[a-z]+$/i.test(str);
};

export const WILDCARD_CHAR = '*';
export const WILDCARD_MAX_LENGTH = 6;

export const isWildcardPattern = (str: string): boolean => {
  return str.includes(WILDCARD_CHAR);
};

// Assumes isWildcardPattern(str) already returned true.
export const isValidWildcardPattern = (str: string): boolean => {
  const chars = [...str];
  if (chars.length > WILDCARD_MAX_LENGTH) return false;
  if (!chars.some((char) => char !== WILDCARD_CHAR)) return false;
  return chars.every((char) => char === WILDCARD_CHAR || isChinese(char));
};
