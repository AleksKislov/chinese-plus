import { getRandInd } from "./get-rand-ind";

export function getRandElem<T>(arr: T[] | null): T | null {
  if (!arr) return null;
  return arr[getRandInd(arr)];
}
