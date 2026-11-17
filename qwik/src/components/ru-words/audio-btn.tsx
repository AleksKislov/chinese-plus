import { component$ } from '@builder.io/qwik';
import { audioSvg } from '~/components/common/media/svg';
import { playChinese, warmChinese } from '~/misc/helpers/speak-chinese';

type AudioBtnProps = {
  audio: string | null; // path in the audio bucket; without it the browser's voice says `cn`
  cn: string; // the Chinese word, for the browser voice
  label: string; // for screen readers: "Произношение 妈妈"
  size?: 'sm' | 'md';
};

// plays the recording of a word (a static file on the CDN, not an API request), or speaks it with
// the browser's voice when there is no recording; the mp3 starts loading on hover / touch
export const AudioBtn = component$(({ audio, cn, label, size = 'sm' }: AudioBtnProps) => (
  <button
    type="button"
    class={`btn btn-info btn-circle ${size === 'sm' ? 'btn-sm' : ''}`}
    aria-label={label}
    title={audio ? label : `${label} (голос браузера)`}
    onPointerEnter$={() => warmChinese(audio)}
    onPointerDown$={() => warmChinese(audio)}
    onClick$={() => playChinese(audio, cn)}
  >
    {audioSvg}
  </button>
));
