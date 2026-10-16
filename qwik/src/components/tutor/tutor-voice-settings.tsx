import { $, component$, type Signal, useSignal } from '@builder.io/qwik';
import { fetchTutorSample, saveTutorTts } from '~/misc/actions/tutor/tutor-api';
import { audioSvg, playSvg } from '../common/media/svg';
import {
  tutorAudioUrl,
  TTS_SPEED_LABELS,
  type TutorOverview,
  type TutorTts,
  type TutorTtsSpeed,
} from './types';

type TutorVoiceSettingsProps = {
  tts: Signal<TutorTts>;
  choices: TutorOverview['ttsChoices'];
};

// toolbar dropdown: the teacher's voice and speaking speed, saved for the user
export const TutorVoiceSettings = component$(({ tts, choices }: TutorVoiceSettingsProps) => {
  const saving = useSignal(false);
  const sampleLoading = useSignal(false);
  const error = useSignal('');

  const save = $(async (next: TutorTts) => {
    saving.value = true;
    error.value = '';
    const result = await saveTutorTts(next)
      .catch(() => ({ error: 'Нет связи с сервером' }))
      .finally(() => (saving.value = false));
    if ('tts' in result) tts.value = next;
    else error.value = result.error;
  });

  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-sm btn-outline btn-info" aria-label="Голос учителя">
        {audioSvg}
      </label>
      <div
        tabIndex={0}
        class="dropdown-content z-30 card card-compact bg-base-100 text-base-content border border-info shadow w-72 mt-1"
      >
        <div class="card-body gap-2">
          <p class="font-bold">Голос учителя</p>
          <select
            class="select select-bordered select-sm w-full"
            aria-label="Голос"
            disabled={saving.value}
            onChange$={(_, el) => save({ ...tts.value, voice: el.value })}
          >
            {/* numbered in TTS_VOICES order (server/src/api/services/tutor/consts.js) */}
            {choices.voices.map((v, i) => (
              <option key={v.key} value={v.key} selected={v.key === tts.value.voice}>
                {`${i + 1}. ${v.label}`}
              </option>
            ))}
          </select>

          <p class="font-bold mt-1">Скорость речи</p>
          <div class="btn-group w-full">
            {choices.speeds.map((speed: TutorTtsSpeed) => (
              <button
                key={speed}
                type="button"
                class={`btn btn-sm flex-1 normal-case ${
                  tts.value.speed === speed ? 'btn-active' : ''
                }`}
                disabled={saving.value}
                onClick$={() => save({ ...tts.value, speed })}
              >
                {TTS_SPEED_LABELS[speed]}
              </button>
            ))}
          </div>

          <button
            type="button"
            class="btn btn-sm btn-info btn-outline mt-1"
            disabled={sampleLoading.value}
            onClick$={async () => {
              error.value = '';
              sampleLoading.value = true;
              const result = await fetchTutorSample(tts.value)
                .catch(() => ({ error: 'Нет связи с сервером' }))
                .finally(() => (sampleLoading.value = false));
              if ('audio' in result) new Audio(tutorAudioUrl(result)).play();
              else error.value = result.error;
            }}
          >
            {sampleLoading.value ? (
              <span class="loading loading-spinner loading-xs"></span>
            ) : (
              playSvg
            )}
            Прослушать
          </button>
          {error.value && <p class="text-error text-sm">{error.value}</p>}
        </div>
      </div>
    </div>
  );
});
