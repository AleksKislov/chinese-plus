import { $, component$, noSerialize, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import CONST_URLS from "~/misc/consts/urls";
import { pauseSvg, playSvg } from "../common/media/svg";

export const AudioPlayer = component$(({ textId }: { textId: ObjectId }) => {
  const isPlaying = useSignal(false);
  const audioPlayer = useSignal<HTMLAudioElement | undefined>();
  const duration = useSignal<string>("0:00");
  const currentTime = useSignal<string>("0:00");
  const progress = useSignal(0);
  const audioRate = useSignal(1);

  const playPauseAudio = $(() => {
    if (!audioPlayer.value) return;
    audioPlayer.value[isPlaying.value ? "pause" : "play"]();
    isPlaying.value = !isPlaying.value;
  });

  const stopAudio = $(() => {
    if (!audioPlayer.value) return;
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    isPlaying.value = false;
  });

  useVisibleTask$(() => {
    if (audioPlayer.value) return;
    const tr = new Audio(`${CONST_URLS.textsAudioUrl}${textId}.mp3`);
    audioPlayer.value = noSerialize(tr);
    setTimeout(() => {
      duration.value = getTrackTime(tr.duration);
    }, 1000);
  });

  useTask$(({ track, cleanup }) => {
    const audio = track(() => audioPlayer.value);

    const id = setInterval(() => {
      const curTime = audio?.currentTime;
      currentTime.value = getTrackTime(curTime);
      progress.value = Math.ceil(((curTime || 0) / (audio?.duration || 1)) * 100);
      if (progress.value >= 100) stopAudio();
    }, 200);

    cleanup(() => {
      clearInterval(id);
      stopAudio();
    });
  });

  const rates = [0.5, 0.75, 1, 1.5, 2];

  return !audioPlayer.value ? null : (
    <div class='flex items-center justify-center w-full my-2'>
      <audio class='hidden'></audio>
      <div class='w-full bg-neutral rounded-lg p-4'>
        <div class='flex flex-row'>
          <div class='mr-4'>
            <button class='btn btn-sm btn-outline' onClick$={playPauseAudio}>
              {isPlaying.value ? pauseSvg : playSvg}
            </button>
          </div>
          <div class='w-full'>
            <progress
              class='progress progress-info border border-info cursor-pointer w-full'
              value={progress.value || 0.5}
              max='100'
              onClick$={(e, bar) => {
                // @ts-ignore
                const percent = e.offsetX / bar.offsetWidth;
                audioPlayer.value!.currentTime = audioPlayer.value!.duration * percent;
              }}
            ></progress>
            <div class='flex justify-between '>
              <div id='current-time' class='text-sm'>
                {currentTime.value}
              </div>
              <div class='text-sm'>{duration.value}</div>
            </div>
          </div>
          <div class='ml-4'>
            <select
              class='rounded-md py-1 px-2'
              value={audioRate.value}
              onChange$={(e) => {
                const rate = +e.target.value;
                audioRate.value = rate;
                audioPlayer.value!.playbackRate = rate;
              }}
            >
              {rates.map((rate, ind) => (
                <option value={rate} key={ind}>{`${rate}x`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});

export const getTrackTime = (seconds?: number): string => {
  if (!seconds) return "0:00";
  const mm = Math.floor(seconds / 60);
  const ss = Math.trunc(seconds % 60);
  const sec = ss < 10 ? `0${ss}` : ss;
  return `${mm}:${sec}`;
};
