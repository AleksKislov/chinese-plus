import { component$ } from '@builder.io/qwik';
import { audioSvg } from '~/components/common/media/svg';
import { pronounce } from '~/components/hsk/new-hsk-table-row';

type AudioBtnProps = {
  audio: string | null; // path in the audio bucket; nothing is rendered without it
  label: string; // for screen readers: "Произношение 妈妈"
  size?: 'sm' | 'md';
};

// plays the recording of an HSK word (a static file on the CDN, not an API request)
export const AudioBtn = component$(({ audio, label, size = 'sm' }: AudioBtnProps) => {
  if (!audio) return null;
  return (
    <button
      type="button"
      class={`btn btn-info btn-circle ${size === 'sm' ? 'btn-sm' : ''}`}
      aria-label={label}
      title={label}
      onClick$={() => pronounce(audio)}
    >
      {audioSvg}
    </button>
  );
});
