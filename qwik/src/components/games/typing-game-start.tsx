import { component$ } from '@builder.io/qwik';
import { QUEST_NUM } from './typing-game';

type TypingGameStartProps = {
  level?: string;
  questionNum: number;
  isCalligraphy?: boolean;
};
export const TypingGameStart = component$(
  ({ level, questionNum, isCalligraphy }: TypingGameStartProps) => {
    const title = isCalligraphy ? 'Успей нарисовать' : 'Успей напечатать';
    return (
      <div class="prose mb-2">
        <h3 class="card-title">
          {questionNum > QUEST_NUM ? (
            'Результат'
          ) : level ? (
            <>
              {title} <small>[ур. {level}]</small>
            </>
          ) : (
            title
          )}
        </h3>
      </div>
    );
  },
);
