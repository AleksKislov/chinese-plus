import { component$, type QRL } from '@builder.io/qwik';
import { playSvg } from '~/components/common/media/svg';
import { AdminImageSlot } from './admin-image-slot';
import { SentenceOrder } from './sentence-order';
import { checkPictureSentence, pictureSentenceHint } from './picture-sentence';
import {
  type ExamPart,
  type ExamQuestion,
  type ExamSectionType,
  getChoices,
  isCorrect,
  isFreeText,
  isOrderType,
  isUngraded,
  usesBank,
} from './types';

type Props = {
  question: ExamQuestion;
  part: ExamPart;
  answer: string | undefined;
  isChecked: boolean;
  // DOM id of the section's single recording, when the section plays as one
  // track. Lets a graded question be replayed from its own offset.
  sectionAudioId?: string;
  onAnswer$: QRL<(value: string) => void>;
  // Present only for an admin viewer - lets this card render upload/replace/
  // remove controls next to its own picture and any per-option pictures.
  admin?: { slug: string; sectionType: ExamSectionType; isExample?: boolean };
  // Shown instead of the question number - set for a worked example (part 2's
  // "Например" row), which isn't numbered on the paper and isn't graded.
  exampleLabel?: string;
  // Paper-specific layout tweaks. 'old-2' (old HSK 2) prints dialogues and
  // passage + ★ statement one line per row - its content stores those lines
  // newline-separated. 'old-3' (old HSK 3) does the same and has no pictures of
  // its own on any question. 'old-4' (old HSK 4+) likewise, except for the
  // writing part 2 pictures. Every other paper renders exactly as before.
  variant?: 'old-2' | 'old-3' | 'old-4';
};

// The blank in a fill-in prompt: "没（     ）系" -> before "没", after "系".
const BLANK_RE = /（\s*）/;

// "男：…女：…问：…" -> one entry per speaker turn, for showing a transcript line by line.
const splitSpeakerLines = (text: string): string[] =>
  text
    .split(/(?=[男女问]：)/)
    .map((l) => l.trim())
    .filter(Boolean);

/**
 * One exam question: optional audio, optional picture, the prompt, and the
 * answer control. Bank-answered questions render lettered buttons (the pictures
 * themselves live in the part header); the rest render their own options.
 * Once the paper is checked, correct/incorrect state and the explanation appear.
 */
export const ExamQuestionCard = component$<Props>(
  ({
    question: q,
    part,
    answer,
    isChecked,
    sectionAudioId,
    admin,
    exampleLabel,
    variant,
    onAnswer$,
  }) => {
    const isOld2 = variant === 'old-2';
    const isOld3 = variant === 'old-3';
    const isOld4 = variant === 'old-4';
    // The old papers print dialogues and passages one line per row.
    const isLineLayout = isOld2 || isOld3 || isOld4;
    const isPictureSentence = q.questionType === 'writing-picture-sentence';
    const correct = isCorrect(q, answer);
    const choices = getChoices(q, part);
    const ungraded = isUngraded(q.questionType);
    // HSK 1 listening part 2 gives three pictures per question rather than a
    // bank shared across the part - lay those out in a row, not a column.
    // A bank-answered type (listening-picture-match etc.) borrows the part's
    // shared bank as its `choices` - those entries carry real pictures, but
    // they belong to the bank strip rendered once above, not to this question.
    // Excluding bank types here is what stops every bank-answered question and
    // example from re-rendering (and re-uploading into) a private copy of it.
    const hasOwnPictureOptions = !usesBank(q.questionType) && choices.some((c) => c.imageUrl);
    // Own picture (q.hasImage) is likewise a concept only non-bank types have -
    // a bank-answered question is never illustrated by its own picture.
    // The old HSK 3 paper only has pictures in its listening part 1 bank, old
    // HSK 4 only in writing part 2.
    const canHaveOwnImage =
      !usesBank(q.questionType) && !isOld3 && (!isOld4 || isPictureSentence);
    // The combined 3-photos-in-one-picture question type (HSK 1 listening part
    // 2's picture-choice items) needs roughly double the width to keep each of
    // its three sub-photos legible; every other own-image type is one plain
    // photo and stays at the smaller size.
    const ownImageWidth = q.questionType === 'listening-choice' ? 440 : 220;
    // See the pinyin comment in the render below.
    const showPinyin = !!exampleLabel || !q.questionType.startsWith('listening');
    // Every ✓/✗ question, on any paper, answers with two plain Верно/Неверно
    // buttons rather than lettered A/B rows - the picture, if any, is the
    // question's own image above them.
    const isPlainTrueFalse = q.questionType.endsWith('-true-false');
    // Writing part 2: the pinyin sits over the blank and the character is typed
    // right into it, as on the paper.
    const blankParts =
      q.questionType === 'writing-character' && q.promptCn && BLANK_RE.test(q.promptCn)
        ? q.promptCn.split(BLANK_RE)
        : null;

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
          {exampleLabel && <span class="badge badge-info badge-outline mb-2">{exampleLabel}</span>}

          <div class="flex items-start gap-3">
            {/* Fixed-width slot regardless of content, so an example (which has
                no number) still starts its picture/text at the exact same x as a
                numbered question - an empty slot of the same width, not just no
                slot at all. */}
            <div class="w-8 shrink-0 mt-1 flex justify-center">
              {!exampleLabel && q.number !== null && (
                <span class="badge badge-neutral">{q.number}</span>
              )}
            </div>

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

              {/* Replay one item from the section recording. Only after grading -
                  during the exam the track plays straight through, as on paper. */}
              {isChecked && sectionAudioId && q.audioStartSec !== null && (
                <button
                  type="button"
                  class="btn btn-sm btn-outline mb-2 gap-2"
                  onClick$={() => {
                    const el = document.getElementById(sectionAudioId) as HTMLAudioElement | null;
                    if (!el) return;
                    el.currentTime = q.audioStartSec!;
                    el.play().catch(() => {});
                  }}
                >
                  {playSvg}
                  Прослушать ещё раз
                </button>
              )}

              {(q.imageUrl || (admin && canHaveOwnImage)) && (
                <div class="mb-2">
                  {q.imageUrl && (
                    <img
                      src={q.imageUrl}
                      alt=""
                      width={ownImageWidth}
                      height={ownImageWidth}
                      loading="lazy"
                      class="rounded-lg border border-base-300 h-auto"
                      style={{ width: `${ownImageWidth}px` }}
                      // Hide rather than show a broken-image box while the picture
                      // for this question has not been generated and uploaded yet.
                      onError$={(_, el) => {
                        el.style.display = 'none';
                      }}
                    />
                  )}
                  {admin && (
                    <AdminImageSlot
                      slug={admin.slug}
                      sectionType={admin.sectionType}
                      partInd={part.ind}
                      target="question"
                      questionInd={q.ind}
                      isExample={admin.isExample}
                      hasImage={q.hasImage}
                      size={ownImageWidth}
                    />
                  )}
                </div>
              )}

              {/* A listening question's own pinyin is the answer transcript, so
                  it stays hidden while ungraded - but a worked example is
                  already shown pre-answered (see exampleLabel below), so its
                  pinyin is never a spoiler and always renders. */}
              {isPictureSentence ? null : blankParts ? (
                <p class="text-lg mb-1 leading-loose">
                  {blankParts[0]}（
                  <span class="inline-flex flex-col items-center align-bottom mx-1">
                    {q.pinyin && <span class="text-sm opacity-70 leading-none">{q.pinyin}</span>}
                    <input
                      type="text"
                      aria-label={q.pinyin ? `Иероглиф для ${q.pinyin}` : 'Иероглиф'}
                      class="input input-bordered input-sm w-14 text-center text-lg"
                      value={answer || ''}
                      disabled={isChecked}
                      onInput$={(e) => onAnswer$((e.target as HTMLInputElement).value)}
                    />
                  </span>
                  ）{blankParts.slice(1).join('（ ）')}
                </p>
              ) : isLineLayout && q.promptCn?.includes('\n') ? (
                // One row per line, each with its own pinyin above it - the
                // pinyin is stored with the same line breaks as promptCn.
                <div class="mb-1">
                  {q.promptCn.split('\n').map((line, i) => {
                    const linePinyin = showPinyin ? q.pinyin?.split('\n')[i] : null;
                    return (
                      <div key={i} class="mb-1">
                        {linePinyin && <p class="text-sm opacity-70 lowercase">{linePinyin}</p>}
                        <p class="text-lg">{line}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  {showPinyin && q.pinyin && (
                    <p class="text-sm opacity-70 lowercase mb-1">{q.pinyin}</p>
                  )}
                  {q.promptCn && <p class="text-lg mb-1">{q.promptCn}</p>}
                </>
              )}

              {blankParts ? null : isPictureSentence ? (
                <div>
                  <p class="mb-2">
                    Слово: <span class="text-xl font-bold">{q.promptCn}</span>
                  </p>
                  <input
                    type="text"
                    aria-label="Ваше предложение"
                    placeholder="Напишите предложение иероглифами"
                    class="input input-bordered w-full text-lg"
                    value={answer || ''}
                    disabled={isChecked}
                    onInput$={(e) => onAnswer$((e.target as HTMLInputElement).value)}
                  />
                  {!exampleLabel && !isChecked && pictureSentenceHint(answer, q.promptCn) && (
                    <p class="text-sm text-warning mt-1 mb-0">
                      {pictureSentenceHint(answer, q.promptCn)}
                    </p>
                  )}
                  {/* Only the formal checks - grammar and fit to the picture
                      aren't judged, so this never counts towards the score. */}
                  {!exampleLabel && isChecked && (
                    <ul class="text-sm mt-2 mb-0 list-none p-0">
                      {checkPictureSentence(answer, q.promptCn).map((c) => (
                        <li key={c.label} class={c.ok ? 'text-success' : 'text-error'}>
                          {c.ok ? '✓' : '✗'} {c.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!exampleLabel && (
                    <p class="text-xs opacity-70 mt-1 mb-0">
                      Ответ проверяется только по формальным признакам: иероглифы, заданное слово,
                      длина, знак в конце. Грамматика и соответствие картинке пока не проверяются,
                      в счёт баллов задание не идёт.
                    </p>
                  )}
                </div>
              ) : isOrderType(q.questionType) ? (
                <SentenceOrder
                  chunks={q.options}
                  byLabel={q.questionType === 'reading-sentence-order'}
                  answer={answer}
                  isChecked={isChecked}
                  correct={correct}
                  exampleSentence={exampleLabel ? q.correctAnswer || '' : undefined}
                  onAnswer$={onAnswer$}
                />
              ) : isFreeText(q.questionType) || ungraded ? (
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
                    usesBank(q.questionType) || hasOwnPictureOptions || isPlainTrueFalse
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
                    if (hasOwnPictureOptions && (choice.imageUrl || admin)) {
                      return (
                        <div key={choice.label} class="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            // Not the native `disabled` attribute: DaisyUI flattens
                            // a disabled button's semantic color (btn-success etc.)
                            // to a generic muted grey, which would hide exactly the
                            // "this one is correct" highlight isChecked exists to
                            // show. pointer-events-none blocks interaction while
                            // keeping the real color.
                            class={`btn ${btnClass} h-auto flex-col p-2 ${
                              isChecked ? 'pointer-events-none' : ''
                            }`}
                            onClick$={() => {
                              if (isChecked) return;
                              onAnswer$(choice.label);
                            }}
                          >
                            <span class="font-bold">{choice.label}</span>
                            {choice.imageUrl && (
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
                            )}
                          </button>
                          {admin && (
                            <AdminImageSlot
                              slug={admin.slug}
                              sectionType={admin.sectionType}
                              partInd={part.ind}
                              target="option"
                              questionInd={q.ind}
                              label={choice.label}
                              isExample={admin.isExample}
                              hasImage={choice.hasImage}
                              size={120}
                            />
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        type="button"
                        key={choice.label}
                        // See the picture-option button above: pointer-events-none
                        // instead of disabled, so btn-success/btn-error survive.
                        class={`btn btn-sm ${btnClass} ${
                          usesBank(q.questionType) ? '' : 'justify-start text-left h-auto py-2'
                        } ${isChecked ? 'pointer-events-none' : ''}`}
                        onClick$={() => {
                          if (isChecked) return;
                          onAnswer$(choice.label);
                        }}
                      >
                        {isPlainTrueFalse ? (
                          <span class="font-normal normal-case">
                            {choice.textCn} {choice.textRu}
                          </span>
                        ) : (
                          <span class="font-bold mr-1">{choice.label}</span>
                        )}
                        {!usesBank(q.questionType) && !isPlainTrueFalse && (
                          <span class="font-normal normal-case">
                            {choice.textCn}
                            {choice.pinyin && (
                              <span class="opacity-70 lowercase"> {choice.pinyin}</span>
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {isChecked && ungraded && !isPictureSentence && (
                <p class="text-sm opacity-70 mt-2">
                  Свободный ответ — проверяется вручную, в счёт баллов не идёт.
                </p>
              )}

              {isChecked && isPictureSentence && !exampleLabel && q.correctAnswer && (
                <p class="text-sm mt-2">
                  Пример ответа: <span class="font-bold">{q.correctAnswer}</span>
                </p>
              )}

              {isChecked && !ungraded && !correct && q.correctAnswer && (
                <p class="text-sm mt-2">
                  Правильный ответ:{' '}
                  <span class="font-bold">
                    {isPlainTrueFalse
                      ? choices.find((c) => c.label === q.correctAnswer)?.textRu ?? q.correctAnswer
                      : q.correctAnswer}
                  </span>
                </p>
              )}

              {isChecked && q.explanationRu && (
                <p class="text-sm opacity-80 mt-1">{q.explanationRu}</p>
              )}

              {isChecked &&
                !exampleLabel &&
                q.ttsText &&
                (isLineLayout ? (
                  <div class="text-sm opacity-70 mt-1">
                    <p class="mb-0">Текст аудио:</p>
                    {splitSpeakerLines(q.ttsText).map((line, i) => (
                      <p key={i} class="mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p class="text-sm opacity-70 mt-1">Текст аудио: {q.ttsText}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
