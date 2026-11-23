import { $, component$, type QRL, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { fetchTutorVocab } from '~/misc/actions/tutor/tutor-api';
import {
  TUTOR_VOCAB_MAX,
  type TutorLessonStart,
  type TutorVocabSource,
  type TutorVocabWord,
  VOCAB_SOURCE_LABELS,
} from './types';

type TutorVocabPickerProps = {
  disabled: boolean;
  onStart$: QRL<(lesson: TutorLessonStart) => void>;
};

type Mode = TutorVocabSource | 'both';
const MODES: Mode[] = ['own', 'hsk3', 'both'];
const MODE_LABELS: Record<Mode, string> = { ...VOCAB_SOURCE_LABELS, both: 'Оба' };
const sourcesOf = (mode: Mode): TutorVocabSource[] => (mode === 'both' ? ['own', 'hsk3'] : [mode]);

// "Повторить мои слова": choose the vocabulary list(s), then pick words by hand or let the
// teacher take random ones
export const TutorVocabPicker = component$(({ disabled, onStart$ }: TutorVocabPickerProps) => {
  const mode = useSignal<Mode>('both');
  const lists = useStore<Partial<Record<TutorVocabSource, TutorVocabWord[]>>>({});
  const selected = useSignal<string[]>([]);
  const loading = useSignal(false);
  const error = useSignal('');

  const load = $(async (sources: TutorVocabSource[]) => {
    const missing = sources.filter((src) => !lists[src]);
    if (!missing.length) return;
    loading.value = true;
    error.value = '';
    const results = await Promise.all(
      missing.map((src) => fetchTutorVocab(src).catch(() => ({ error: 'Нет связи с сервером' }))),
    );
    loading.value = false;
    results.forEach((result, i) => {
      if (Array.isArray(result)) lists[missing[i]] = result;
      else error.value = result.error;
    });
  });

  // words of the chosen list(s); the same word in both lists is shown once
  const words = (() => {
    const seen = new Set<string>();
    return sourcesOf(mode.value)
      .flatMap((src) => lists[src] || [])
      .filter((w) => !seen.has(w.cn) && seen.add(w.cn));
  })();

  // load the chosen lists; keep only selected words that are still shown
  useTask$(async ({ track }) => {
    const sources = sourcesOf(track(() => mode.value));
    await load(sources);
    const shown = new Set(sources.flatMap((src) => (lists[src] || []).map((w) => w.id)));
    selected.value = selected.value.filter((id) => shown.has(id));
  });

  const sources = sourcesOf(mode.value);
  const full = selected.value.length >= TUTOR_VOCAB_MAX;

  return (
    <div class="mt-3">
      <div class="btn-group">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            class={`btn btn-sm normal-case ${mode.value === m ? 'btn-active' : ''}`}
            onClick$={() => (mode.value = m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {loading.value && <span class="loading loading-dots loading-sm block mt-2"></span>}

      {!loading.value && !error.value && !words.length && (
        <p class="text-sm mt-2">
          Здесь пока нет слов. Добавляйте их в{' '}
          <Link href="/me/words" class="link">
            «Мой словарик»
          </Link>{' '}
          или{' '}
          <Link href="/me/hsk/3" class="link">
            «Мой словарик HSK 3.0»
          </Link>
          .
        </p>
      )}

      {words.length > 0 && (
        <>
          <p class="text-sm opacity-70 mt-2">
            Выберите до {TUTOR_VOCAB_MAX} слов или начните со случайных:
          </p>
          <div class="flex flex-wrap gap-1 max-h-48 overflow-y-auto mt-1">
            {words.map((w) => {
              const isOn = selected.value.includes(w.id);
              return (
                <button
                  key={w.id}
                  type="button"
                  title={w.py}
                  class={`btn btn-xs normal-case text-base ${isOn ? 'btn-info' : 'btn-outline'}`}
                  disabled={!isOn && full}
                  onClick$={() => {
                    selected.value = isOn
                      ? selected.value.filter((id) => id !== w.id)
                      : [...selected.value, w.id];
                  }}
                >
                  {w.cn}
                </button>
              );
            })}
          </div>

          <div class="flex flex-wrap items-center gap-2 mt-2">
            <button
              type="button"
              class="btn btn-sm btn-primary normal-case"
              disabled={disabled || !selected.value.length}
              onClick$={() =>
                onStart$({ kind: 'vocab', vocab: { sources, wordIds: selected.value } })
              }
            >
              Начать с выбранными ({selected.value.length})
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline normal-case"
              title="20 последних добавленных и случайные из остальных, до 50 слов"
              disabled={disabled}
              onClick$={() => onStart$({ kind: 'vocab', vocab: { sources } })}
            >
              Случайные слова
            </button>
            {selected.value.length > 0 && (
              <button
                type="button"
                class="btn btn-ghost btn-xs normal-case"
                onClick$={() => (selected.value = [])}
              >
                Снять выбор
              </button>
            )}
          </div>
        </>
      )}
      {error.value && <p class="text-error text-sm mt-1">{error.value}</p>}
    </div>
  );
});
