import CONSTANTS from "~/misc/consts/consts";

export const countZnChars = (str: string): number => {
  if (!str) return 0;

  CONSTANTS.symbolsToIgnore.forEach((char) => {
    str = str.replaceAll(char, "");
  });
  return str.length;
};
