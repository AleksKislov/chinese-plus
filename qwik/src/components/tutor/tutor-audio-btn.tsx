import { component$, type Signal } from '@builder.io/qwik';
import { fetchTutorAudio } from '~/misc/actions/tutor/tutor-api';
import { playSvg } from '../common/media/svg';
import { tutorAudioUrl } from './types';

// audio state of one Chinese sentence. Owned by the sentence (TutorCnBlock), so it survives
// the button being re-created, e.g. by "Показать текст" in listening mode.
export type TutorAudioState = {
  // where to play from (bucket url, or the file of a just-generated clip); undefined = not
  // generated yet
  playUrl: Signal<string | undefined>;
  loading: Signal<boolean>;
  error: Signal<string>;
};

type TutorAudioParams = { chatId: string; messageId: string; block: number };

// the BE generates one clip at a time per user (429 otherwise): requests wait for each other.
// An object, so the optimizer's segments share the one queue.
const audioQueue: { last: Promise<unknown> } = { last: Promise.resolve() };

// -> the url to play, generating the clip on the BE if needed; undefined on failure (error set)
export async function loadTutorAudio(
  params: TutorAudioParams,
  { playUrl, loading, error }: TutorAudioState,
): Promise<string | undefined> {
  if (playUrl.value) return playUrl.value;
  loading.value = true;
  error.value = '';
  const run = audioQueue.last.then(() => fetchTutorAudio(params));
  audioQueue.last = run.catch(() => undefined);
  const result = await run
    .catch(() => ({ error: 'Нет связи с сервером' }))
    .finally(() => (loading.value = false));
  if (!('audio' in result)) {
    error.value = result.error;
    return undefined;
  }
  return (playUrl.value = tutorAudioUrl(result));
}

type TutorAudioBtnProps = TutorAudioParams & { state: TutorAudioState };

// plays a Chinese sentence of the tutor; generates the audio first if it doesn't exist yet
// (new replies generate it right away, see TutorCnBlock)
export const TutorAudioBtn = component$(
  ({ chatId, messageId, block, state }: TutorAudioBtnProps) => {
    const { playUrl, loading, error } = state;
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
            const url = await loadTutorAudio({ chatId, messageId, block }, state);
            if (url) new Audio(url).play();
          }}
        >
          {loading.value ? <span class="loading loading-spinner loading-xs"></span> : playSvg}
        </button>
      </span>
    );
  },
);
