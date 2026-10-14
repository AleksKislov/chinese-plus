import { $, component$, sync$, useSignal, type QRL } from '@builder.io/qwik';
import { CHUNK_SEPARATOR, type ExamChoice } from './types';

type Props = {
  // The scrambled pieces, in the order printed on the paper.
  chunks: ExamChoice[];
  // Reading part 2 (HSK 4+): the pieces are whole sentences A/B/C, stacked one
  // per row, and the answer is their labels in order rather than their text.
  byLabel?: boolean;
  answer: string | undefined;
  isChecked: boolean;
  correct: boolean;
  // Set for a worked example: show the pieces and the finished result (the
  // sentence, or the label order 'BAC'), with nothing to drag.
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
const parseAnswer = (answer: string | undefined, chunks: ExamChoice[], byLabel: boolean) => {
  const used = new Set<number>();
  const line: number[] = [];
  for (const token of (answer || '').split(CHUNK_SEPARATOR)) {
    const ind = chunks.findIndex((c, i) => !used.has(i) && tokenOf(c, byLabel) === token);
    if (ind === -1) continue;
    used.add(ind);
    line.push(ind);
  }
  const pool = chunks.map((_, i) => i).filter((i) => !used.has(i));
  return { line, pool };
};

const tokenOf = (c: ExamChoice, byLabel: boolean) => (byLabel ? c.label : c.textCn || '');

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
 * HSK 3+ writing part 1: build a sentence from the given words; HSK 4+ reading
 * part 2: put three sentences in order. Click a piece to put it at the end of
 * the line (click it again on the line to take it back), or drag it - between
 * pieces on the line, or back to the pool.
 */
export const SentenceOrder = component$<Props>(
  ({ chunks, answer, isChecked, correct, byLabel = false, exampleSentence, onAnswer$ }) => {
    const dragged = useSignal<DragSource | null>(null);

    if (exampleSentence !== undefined && byLabel) {
      // The key is the label order ('BAC') - show the sentences in that order.
      const ordered = [...exampleSentence]
        .map((label) => chunks.find((c) => c.label === label))
        .filter((c): c is ExamChoice => !!c);
      return (
        <div>
          {chunks.map((c) => (
            <p key={c.label} class="mb-1">
              <span class="font-bold mr-2">{c.label}</span>
              {c.textCn}
            </p>
          ))}
          <p class="font-bold mt-2 mb-1">→ {exampleSentence.split('').join(' ')}</p>
          <p class="text-lg mb-0">{ordered.map((c) => c.textCn).join('，')}。</p>
        </div>
      );
    }

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

    const { line, pool } = parseAnswer(answer, chunks, byLabel);

    const commit = $((next: number[]) =>
      onAnswer$(next.map((i) => tokenOf(chunks[i], byLabel)).join(CHUNK_SEPARATOR)),
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
    // Whole sentences: one per row, wrapping, label in front.
    const rowsClass = byLabel ? 'flex-col items-stretch' : 'flex-wrap items-center';
    const pieceClass = byLabel
      ? 'h-auto min-h-8 py-2 justify-start text-left whitespace-normal text-base'
      : 'text-lg';
    const pieceText = (chunkInd: number) =>
      byLabel ? (
        <>
          <span class="font-bold mr-2">{chunks[chunkInd].label}</span>
          {chunks[chunkInd].textCn}
        </>
      ) : (
        chunks[chunkInd].textCn
      );

    return (
      <div>
        <div
          class={`min-h-14 border-2 border-dashed border-base-300 rounded-lg p-2 flex gap-2 ${rowsClass}`}
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
                class={`btn btn-sm normal-case font-normal ${pieceClass} ${lineBtnClass} ${lockClass}`}
                onClick$={() => commit(line.filter((_, k) => k !== j))}
                onDragStart$={[
                  startDrag,
                  $(() => {
                    dragged.value = { from: 'line', index: j };
                  }),
                ]}
                onDrop$={[acceptDrop, $(() => dropAt(j))]}
              >
                {pieceText(chunkInd)}
              </button>
            ))
          ) : (
            <span class="text-sm opacity-50 px-1">
              {byLabel
                ? 'Нажимайте на предложения по порядку или перетащите их сюда'
                : 'Нажимайте на слова по порядку или перетащите их сюда'}
            </span>
          )}
        </div>

        {!!pool.length && (
          <div
            class={`flex gap-2 mt-2 min-h-10 ${rowsClass}`}
            onDragOver$={allowDrop}
            onDrop$={[acceptDrop, dropToPool]}
          >
            {pool.map((chunkInd) => (
              <button
                type="button"
                key={chunkInd}
                draggable={!isChecked}
                class={`btn btn-sm btn-outline normal-case font-normal ${pieceClass} ${lockClass}`}
                onClick$={() => commit([...line, chunkInd])}
                onDragStart$={[
                  startDrag,
                  $(() => {
                    dragged.value = { from: 'pool', index: chunkInd };
                  }),
                ]}
              >
                {pieceText(chunkInd)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
