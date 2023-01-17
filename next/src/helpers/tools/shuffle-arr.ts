import { getRandInd } from "./get-rand-ind";

export function shuffleArr<T>(arr: T[]) {
  for (let i = 0; i < arr.length; i++) {
    let randInd = getRandInd(arr);
    [arr[i], arr[randInd]] = [arr[randInd], arr[i]];
  }
}
