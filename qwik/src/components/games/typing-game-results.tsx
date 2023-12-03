import { component$ } from "@builder.io/qwik";
import { faceSadBigSvg, faceSmileBigSvg, thumbUpBigSvg } from "../common/media/svg";
import { QUEST_NUM } from "./typing-game";

type TypingGameResultsProps = {
  corrects: number;
  wrongs: number;
  questionNum: number;
};

export const TypingGameResults = component$(
  ({ wrongs, corrects, questionNum }: TypingGameResultsProps) => {
    return questionNum > QUEST_NUM ? (
      <div class='flex justify-center mb-3'>
        <div class=''>
          {corrects > 8 ? thumbUpBigSvg : corrects < 6 ? faceSadBigSvg : faceSmileBigSvg}
        </div>
        <div class='mx-4 text-center'>
          <div class='text-2xl'>
            <h4>Верно</h4>
          </div>
          <p class='text-success'>
            <strong>{corrects}</strong>
          </p>
        </div>
        <div class='text-center'>
          <div class='text-2xl'>
            <h4>Ошибки</h4>
          </div>
          <p class='h2 text-error'>
            <strong>{wrongs}</strong>
          </p>
        </div>
      </div>
    ) : null;
  }
);
