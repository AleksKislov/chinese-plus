export const parseTags = (text: string): string[] => {
  return text
    .replaceAll("，", ",")
    .replaceAll("、", ",")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => Boolean(tag));
};
