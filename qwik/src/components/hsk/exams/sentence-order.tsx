import { $, component$, sync$, useSignal, type QRL } from '@builder.io/qwik';
import { CHUNK_SEPARATOR, type ExamChoice } from './types';

type Props = {
  // The scrambled words, in the order printed on the paper.
  chunks: ExamChoice[];
  answer: string | undefined;
  isChecked: boolean;
  correct: boolean;
  // Set for a worked example: show the words and the finished sentence, with
  // nothing to drag.
  exampleSentence?: string;
  onAnswer$: QRL<(value: string) => void>;
};

// Where a dragged word came from: a chunk index in the pool, or a slot on the answer line.
type DragSource = { from: 'pool' | 'line'; index: number };

/**
 * Splits a stored answer back into chunk indices. The answer is the source of
 * truth (it lives in the page's answer store), so resetting the exam clears this
 * component too. A repeated word maps to the first copy not already placed.
 */
const parseAnswer = (answer: string | undefined, chunks: ExamChoice[]) => {
  const used = new Set<number>();
  const line: number[] = [];
  for (const token of (answer || '').split(CHUNK_SEPARATOR)) {
    const ind = chunks.findIndex((c, i) => !used.has(i) && c.textCn === token);
    if (ind === -1) continue;
    used.add(ind);
    line.push(ind);
  }
  const pool = chunks.map((_, i) => i).filter((i) => !used.has(i));
  return { line, pool };
};

// Drag handlers run lazily, so anything that has to happen during the event
// itself goes through sync$: Firefox only starts a drag once data is set, and a
// drop target has to cancel dragover to accept the drop.
const startDrag = sync$((e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', '');
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
});
const allowDrop = sync$((e: DragEvent) => {
  e.preventDefault();
});
const acceptDrop = sync$((e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
});

/**
 * HSK 3 writing part 1: build a sentence from the given words. Click a word to
 * put it at the end of the line (click it again on the line to take it back),
 * or drag it - between words on the line, or back to the pool.
 */
export const SentenceOrder = component$<Props>(
  ({ chunks, answer, isChecked, correct, exampleSentence, onAnswer$ }) => {
    const dragged = useSignal<DragSource | null>(null);

    if (exampleSentence !== undefined) {
      return (
        <div>
          <div class="flex flex-wrap gap-2 mb-2">
            {chunks.map((c) => (
              <span key={c.label} class="badge badge-outline badge-lg py-3">
                {c.textCn}
              </span>
            ))}
          </div>
          <p class="text-lg mb-0">→ {exampleSentence}</p>
        </div>
      );
    }

    const { line, pool } = parseAnswer(answer, chunks);

    const commit = $((next: number[]) =>
      onAnswer$(next.map((i) => chunks[i].textCn || '').join(CHUNK_SEPARATOR)),
    );

    // Put the dragged word before line slot `target` (line.length = at the end).
    const dropAt = $((target: number) => {
      const src = dragged.value;
      dragged.value = null;
      if (!src || isChecked) return;
      const next = [...line];
      let chunkInd = src.index;
      if (src.from === 'line') {
        chunkInd = next.splice(src.index, 1)[0];
        if (src.index < target) target--;
      }
      next.splice(target, 0, chunkInd);
      return commit(next);
    });

    const dropToPool = $(() => {
      const src = dragged.value;
      dragged.value = null;
      if (!src || src.from !== 'line' || isChecked) return;
      return commit(line.filter((_, j) => j !== src.index));
    });

    const lineBtnClass = !isChecked ? 'btn-primary' : correct ? 'btn-success' : 'btn-error';
    const lockClass = isChecked ? 'pointer-events-none' : '';

    return (
      <div>
        <div
          class="min-h-14 border-2 border-dashed border-base-300 rounded-lg p-2 flex flex-wrap gap-2 items-center"
          onDragOver$={allowDrop}
          onDrop$={[acceptDrop, $(() => dropAt(line.length))]}
        >
          {line.length ? (
            line.map((chunkInd, j) => (
              <button
                type="button"
                key={`${chunkInd}-${j}`}
                draggable={!isChecked}
                // pointer-events-none rather than `disabled`, so the graded
                // color survives (see ExamQuestionCard).
                class={`btn btn-sm text-lg normal-case font-normal ${lineBtnClass} ${lockClass}`}
                onClick$={() => commit(line.filter((_, k) => k !== j))}
                onDragStart$={[
                  startDrag,
                  $(() => {
                    dragged.value = { from: 'line', index: j };
                  }),
                ]}
                onDrop$={[acceptDrop, $(() => dropAt(j))]}
              >
                {chunks[chunkInd].textCn}
              </button>
            ))
          ) : (
            <span class="text-sm opacity-50 px-1">
              Нажимайте на слова по порядку или перетащите их сюда
            </span>
          )}
        </div>

        {!!pool.length && (
          <div
            class="flex flex-wrap gap-2 mt-2 min-h-10"
            onDragOver$={allowDrop}
            onDrop$={[acceptDrop, dropToPool]}
          >
            {pool.map((chunkInd) => (
              <button
                type="button"
                key={chunkInd}
                draggable={!isChecked}
                class={`btn btn-sm btn-outline text-lg normal-case font-normal ${lockClass}`}
                onClick$={() => commit([...line, chunkInd])}
                onDragStart$={[
                  startDrag,
                  $(() => {
                    dragged.value = { from: 'pool', index: chunkInd };
                  }),
                ]}
              >
                {chunks[chunkInd].textCn}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
