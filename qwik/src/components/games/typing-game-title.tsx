import { component$ } from '@builder.io/qwik';
import { QUEST_NUM } from './typing-game';

type TypingGameTitleProps = {
  level?: string;
  questionNum: number;
  isCalligraphy?: boolean;
};
export const TypingGameTitle = component$(
  ({ level, questionNum, isCalligraphy }: TypingGameTitleProps) => {
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
