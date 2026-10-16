import { component$, type QRL, useSignal } from '@builder.io/qwik';
import { fetchTutorTexts } from '~/misc/actions/tutor/tutor-api';
import { TEXT_LEVEL_LABELS, type TutorLessonStart, type TutorTextSuggestion } from './types';

type TutorLessonPickerProps = {
  level: number;
  disabled: boolean; // a lesson is being started
  onStart$: QRL<(lesson: TutorLessonStart) => void>;
  onFreeChat$: QRL<() => void>;
};

// shown under the teacher's greeting of a new lesson: choose what the lesson is about
export const TutorLessonPicker = component$(
  ({ level, disabled, onStart$, onFreeChat$ }: TutorLessonPickerProps) => {
    const showTexts = useSignal(false);
    const texts = useSignal<TutorTextSuggestion[] | null>(null);
    const loading = useSignal(false);
    const error = useSignal('');
    const textUrl = useSignal('');

    return (
      <div class="mt-3">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn btn-sm btn-outline normal-case"
            disabled={disabled}
            onClick$={() => onFreeChat$()}
          >
            Свободный разговор
          </button>
          <button
            type="button"
            class={`btn btn-sm btn-outline normal-case ${showTexts.value ? 'btn-active' : ''}`}
            disabled={disabled}
            onClick$={async () => {
              showTexts.value = !showTexts.value;
              if (!showTexts.value || texts.value) return;
              loading.value = true;
              error.value = '';
              const result = await fetchTutorTexts(level)
                .catch(() => ({ error: 'Нет связи с сервером' }))
                .finally(() => (loading.value = false));
              if (Array.isArray(result)) texts.value = result;
              else error.value = result.error;
            }}
          >
            Обсудить текст
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline normal-case"
            disabled={disabled}
            onClick$={() => onStart$({ kind: 'vocab' })}
          >
            Повторить мои слова
          </button>
        </div>

        {showTexts.value && (
          <div class="mt-3 flex flex-col gap-1">
            {loading.value && <span class="loading loading-dots loading-sm"></span>}
            {texts.value?.map((t) => (
              <button
                key={t._id}
                type="button"
                class="btn btn-ghost btn-sm h-auto py-1 justify-start text-left normal-case font-normal"
                disabled={disabled}
                onClick$={() => onStart$({ kind: 'text', textId: t._id })}
              >
                {t.bookmarked ? '★ ' : ''}
                {t.title}
                <span class="opacity-60 text-xs">{` · ${TEXT_LEVEL_LABELS[t.level] || ''}`}</span>
              </button>
            ))}
            {texts.value && !texts.value.length && (
              <p class="text-sm opacity-70">Подходящих текстов не нашлось.</p>
            )}

            {/* any text of the site by its link; the BE only takes the text id from it */}
            <div class="input-group input-group-sm mt-1">
              <input
                type="url"
                class="input input-bordered input-sm w-full"
                placeholder="или ссылка на текст с сайта"
                maxLength={500}
                bind:value={textUrl}
              />
              <button
                type="button"
                class="btn btn-sm"
                disabled={disabled || !textUrl.value.trim()}
                onClick$={() => onStart$({ kind: 'text', textUrl: textUrl.value.trim() })}
              >
                OK
              </button>
            </div>
          </div>
        )}
        {error.value && <p class="text-error text-sm mt-1">{error.value}</p>}
      </div>
    );
  },
);
