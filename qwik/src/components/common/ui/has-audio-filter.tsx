import { component$, type Signal } from "@builder.io/qwik";

export enum AudioFilter {
  All = "0",
  HasAudio = "1",
}

export type AudioFilterUnion = "0" | "1";

type AudioFilterProps = {
  audioSignal: Signal<AudioFilterUnion>;
  num: number;
};

export const HasAudioFilter = component$(({ audioSignal, num }: AudioFilterProps) => {
  const text = `С аудио ${num}`;
  return (
    <div class='form-control'>
      <select
        class='select select-bordered'
        value={audioSignal.value}
        onChange$={(e) => {
          audioSignal.value = e.target.value as AudioFilterUnion;
        }}
      >
        <option selected value={AudioFilter.All}>
          С аудио и без
        </option>
        <option value={AudioFilter.HasAudio}>{text}</option>
      </select>
    </div>
  );
});
