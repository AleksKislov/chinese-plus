export const dateToStr = (date: string, onlyDate: boolean) => {
  const str = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" } as Intl.DateTimeFormatOptions;
  const rusDate = str.toLocaleDateString("ru-RU", options); // 22 авг. 2020 г.
  if (onlyDate) return rusDate;
  return `${rusDate}, ${date.slice(11, 16)}`;
};
