import { MouseEvent } from "react";
import constUrls from "../../helpers/constants/urls";

export const playAudioFromBtn = (e: MouseEvent<HTMLButtonElement>) => {
  const target = e.target as Element;
  new Audio(`${constUrls.myAudioURL}pinyin/${target.id}.mp3`).play();
};

export const playAudio = (target: string) => {
  new Audio(`${constUrls.myAudioURL}pinyin/${target}.mp3`).play();
};
