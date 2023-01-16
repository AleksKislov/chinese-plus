import { getRandInd } from "./get-rand-ind";

export function shuffleArr(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    let randInd = getRandInd(arr);
    [arr[i], arr[randInd]] = [arr[randInd], arr[i]];
  }
}
