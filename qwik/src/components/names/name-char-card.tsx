import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import HanziWriter from 'hanzi-writer';
import { HanziWriterSettings } from '~/components/strokes/stroke-card';
import { type NameChar, dictionaryUrl } from './types';

type NameCharCardProps = {
  char: NameChar;
  id: string;
};

// one character of a name: stroke animation (click to replay), pinyin and its own meaning
export const NameCharCard = component$(({ char, id }: NameCharCardProps) => {
  useVisibleTask$(() => {
    const writer = HanziWriter.create(id, char.ch, {
      ...HanziWriterSettings,
      width: 100,
      height: 100,
    });
    writer.animateCharacter();
    document.getElementById(id)!.addEventListener('click', () => writer.animateCharacter());
  });

  return (
    <div class="card bg-base-200 w-40">
      <div class="card-body items-center text-center p-4">
        <div id={id} class="cursor-pointer" title="Нажмите, чтобы повторить анимацию"></div>
        <Link prefetch="js" href={dictionaryUrl(char.ch)} class="text-2xl link link-hover">
          {char.ch}
        </Link>
        <div class="text-lg">{char.py}</div>
        {char.meaning && <div class="text-sm opacity-80">{char.meaning}</div>}
      </div>
    </div>
  );
});
