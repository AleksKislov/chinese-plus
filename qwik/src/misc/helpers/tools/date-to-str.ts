export const dateToStr = (date: ISODate, onlyDate: boolean): string => {
  const str = new Date(date);
  const rusDate = str.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }); // 22 авг. 2020 г.
  if (onlyDate) return rusDate;
  return `${rusDate}, ${date.slice(11, 16)}`;
};
