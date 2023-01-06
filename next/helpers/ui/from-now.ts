export default function fromNow(date: string): string {
  const timestampNow = Date.now();
  const commentTimestamp = Date.parse(date);
  const seconds = Math.round((timestampNow - commentTimestamp) / 1000);
  const day = 3600 * 24; // seconds in a day
  // const month = 3600 * 24 * 30; // seconds in a month
  if (seconds < 60) {
    return `${seconds} сек.`;
  } else if (seconds >= 60 && seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${minutes} мин.`;
  } else if (seconds >= 3600 && seconds < day) {
    const hours = Math.round(seconds / 3600);
    return `${hours} ч.`;
  } else {
    const days = Math.round(seconds / day);
    return `${days} дн.`;
  }
}
