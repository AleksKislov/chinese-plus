import { component$ } from '@builder.io/qwik';
import { QUEST_NUM } from './typing-game';

type TypingGameIndictorsProps = {
  wrongAnswers: string[];
};
export const TypingGameIndicators = component$(({ wrongAnswers }: TypingGameIndictorsProps) => {
  return (
    <div class="flex justify-center">
      {[...new Array(QUEST_NUM)].map((x, ind) => (
        <div
          key={ind}
          class={`badge mx-1 mb-2 border border-base-300 ${
            wrongAnswers.length > ind
              ? wrongAnswers[ind]
                ? 'bg-error'
                : 'bg-success'
              : 'bg-neutral-content'
          }`}
        >
          {' '}
        </div>
      ))}
    </div>
  );
});
