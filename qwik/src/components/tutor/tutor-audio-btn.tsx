import { component$, type Signal, useSignal } from '@builder.io/qwik';
import { fetchTutorAudio } from '~/misc/actions/tutor/tutor-api';
import { playSvg } from '../common/media/svg';
import { tutorAudioUrl } from './types';

type TutorAudioBtnProps = {
  chatId: string;
  messageId: string;
  block: number; // index of the 'cn' block in the message
  // where to play from (bucket url, or the mp3 of a just-generated clip); undefined = not
  // generated yet. Owned by the sentence (TutorCnBlock), so it survives this button being
  // re-created, e.g. by "Показать текст" in listening mode.
  playUrl: Signal<string | undefined>;
};

// plays a Chinese sentence of the tutor; the first click generates the audio
export const TutorAudioBtn = component$(
  ({ chatId, messageId, block, playUrl }: TutorAudioBtnProps) => {
    const loading = useSignal(false);
    const error = useSignal('');

    return (
      <span
        class={error.value ? 'tooltip tooltip-error tooltip-right' : ''}
        data-tip={error.value || undefined}
      >
        {/* filled: the audio exists and plays at once; ghost: generated on the first click */}
        <button
          type="button"
          class={`btn btn-circle btn-xs align-middle ml-1 ${
            playUrl.value ? 'btn-info' : 'btn-ghost opacity-60 hover:opacity-100'
          }`}
          aria-label={playUrl.value ? 'Прослушать' : 'Озвучить'}
          title={playUrl.value ? 'Прослушать' : 'Озвучить (первый раз — пара секунд)'}
          disabled={loading.value}
          onClick$={async () => {
            error.value = '';
            let url = playUrl.value;
            if (!url) {
              loading.value = true;
              const result = await fetchTutorAudio({ chatId, messageId, block })
                .catch(() => ({ error: 'Нет связи с сервером' }))
                .finally(() => (loading.value = false));
              if (!('audio' in result)) {
                error.value = result.error;
                return;
              }
              url = playUrl.value = tutorAudioUrl(result);
            }
            new Audio(url).play();
          }}
        >
          {loading.value ? <span class="loading loading-spinner loading-xs"></span> : playSvg}
        </button>
      </span>
    );
  },
);
