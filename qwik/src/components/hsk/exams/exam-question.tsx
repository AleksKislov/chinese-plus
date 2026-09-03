import { component$, type QRL } from '@builder.io/qwik';
import { playSvg } from '~/components/common/media/svg';
import {
  type ExamPart,
  type ExamQuestion,
  getChoices,
  isCorrect,
  isFreeText,
  isUngraded,
  usesBank,
} from './types';

type Props = {
  question: ExamQuestion;
  part: ExamPart;
  answer: string | undefined;
  isChecked: boolean;
  onAnswer$: QRL<(value: string) => void>;
};

/**
 * One exam question: optional audio, optional picture, the prompt, and the
 * answer control. Bank-answered questions render lettered buttons (the pictures
 * themselves live in the part header); the rest render their own options.
 * Once the paper is checked, correct/incorrect state and the explanation appear.
 */
export const ExamQuestionCard = component$<Props>(
  ({ question: q, part, answer, isChecked, onAnswer$ }) => {
    const correct = isCorrect(q, answer);
    const choices = getChoices(q, part);
    const ungraded = isUngraded(q.questionType);
    // HSK 1 listening part 2 gives three pictures per question rather than a
    // bank shared across the part - lay those out in a row, not a column.
    const hasPictureOptions = choices.some((c) => c.imageUrl);

    const stateClass = !isChecked
      ? 'border-base-300'
      : ungraded
      ? 'border-base-300'
      : correct
      ? 'border-success'
      : 'border-error';

    return (
      <div class={`card bg-base-100 border ${stateClass} mb-3`}>
        <div class="card-body p-4">
          <div class="flex items-start gap-3">
            {q.number !== null && <span class="badge badge-neutral shrink-0 mt-1">{q.number}</span>}

            <div class="w-full">
              {q.audioUrl && (
                <button
                  type="button"
                  class="btn btn-sm btn-outline mb-2 gap-2"
                  // Media is uploaded separately, so a file may not exist yet -
                  // swallow the rejection instead of leaving it unhandled.
                  onClick$={() => new Audio(q.audioUrl!).play().catch(() => {})}
                >
                  {playSvg}
                  Прослушать
                </button>
              )}

              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt=""
                  width={220}
                  height={220}
                  loading="lazy"
                  class="rounded-lg border border-base-300 mb-2 w-[220px] h-auto"
                  // Hide rather than show a broken-image box while the picture
                  // for this question has not been generated and uploaded yet.
                  onError$={(_, el) => {
                    el.style.display = 'none';
                  }}
                />
              )}

              {q.promptCn && <p class="text-lg mb-1">{q.promptCn}</p>}
              {q.pinyin && <p class="text-sm opacity-70 lowercase mb-1">{q.pinyin}</p>}
              {q.promptRu && <p class="text-sm opacity-80 mb-2">{q.promptRu}</p>}

              {isFreeText(q.questionType) || ungraded ? (
                ungraded ? (
                  <textarea
                    class="textarea textarea-bordered w-full"
                    rows={5}
                    value={answer || ''}
                    disabled={isChecked}
                    onInput$={(e) => onAnswer$((e.target as HTMLTextAreaElement).value)}
                  />
                ) : (
                  <input
                    type="text"
                    class="input input-bordered w-full max-w-xs text-lg"
                    value={answer || ''}
                    disabled={isChecked}
                    onInput$={(e) => onAnswer$((e.target as HTMLInputElement).value)}
                  />
                )
              ) : (
                <div
                  class={
                    usesBank(q.questionType) || hasPictureOptions
                      ? 'flex flex-wrap gap-2'
                      : 'flex flex-col gap-2'
                  }
                >
                  {choices.map((choice) => {
                    const selected = answer === choice.label;
                    // After checking, always highlight the key even if it was missed.
                    const isKey = isChecked && q.correctAnswer === choice.label;
                    const isWrongPick = isChecked && selected && !correct;

                    const btnClass = isKey
                      ? 'btn-success'
                      : isWrongPick
                      ? 'btn-error'
                      : selected
                      ? 'btn-primary'
                      : 'btn-outline';

                    // A picture option carries its answer in the image, so it
                    // shows the letter plus the picture and no gloss.
                    if (choice.imageUrl) {
                      return (
                        <button
                          type="button"
                          key={choice.label}
                          class={`btn ${btnClass} h-auto flex-col p-2`}
                          disabled={isChecked}
                          onClick$={() => onAnswer$(choice.label)}
                        >
                          <span class="font-bold">{choice.label}</span>
                          <img
                            src={choice.imageUrl}
                            alt={`Вариант ${choice.label}`}
                            width={120}
                            height={120}
                            loading="lazy"
                            class="rounded w-[120px] h-auto"
                            onError$={(_, el) => {
                              el.style.display = 'none';
                            }}
                          />
                        </button>
                      );
                    }

                    return (
                      <button
                        type="button"
                        key={choice.label}
                        class={`btn btn-sm ${btnClass} ${
                          usesBank(q.questionType) ? '' : 'justify-start text-left h-auto py-2'
                        }`}
                        disabled={isChecked}
                        onClick$={() => onAnswer$(choice.label)}
                      >
                        <span class="font-bold mr-1">{choice.label}</span>
                        {!usesBank(q.questionType) && (
                          <span class="font-normal normal-case">
                            {choice.textCn}
                            {choice.textRu && <span class="opacity-70"> — {choice.textRu}</span>}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {isChecked && ungraded && (
                <p class="text-sm opacity-70 mt-2">
                  Свободный ответ — проверяется вручную, в счёт баллов не идёт.
                </p>
              )}

              {isChecked && !ungraded && !correct && q.correctAnswer && (
                <p class="text-sm mt-2">
                  Правильный ответ: <span class="font-bold">{q.correctAnswer}</span>
                </p>
              )}

              {isChecked && q.explanationRu && (
                <p class="text-sm opacity-80 mt-1">{q.explanationRu}</p>
              )}

              {isChecked && q.ttsText && (
                <p class="text-sm opacity-70 mt-1">Текст аудио: {q.ttsText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
