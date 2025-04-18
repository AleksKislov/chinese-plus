import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { featuresArr } from './features';
import HanziWriter from 'hanzi-writer';
import { HanziWriterSettings } from '~/routes/search';

type FeatureCardProps = {
  title: string;
  ind: number;
};

export const FeatureCard = component$(({ ind }: FeatureCardProps) => {
  const { title, desc, pic } = featuresArr[ind];
  useVisibleTask$(() => {
    if (ind !== 4) return;
    const writer = HanziWriter.create('showCharDiv', '字', HanziWriterSettings);
    writer.loopCharacterAnimation();
  });

  return (
    <div class="card bg-base-300">
      <div class="card-body relative">
        <h2 class="card-title">{title}</h2>

        <div>
          <div class={`float-left mr-2 text-secondary ${ind === 0 ? 'mt-1' : ''}`}>{pic}</div>
          {desc}
        </div>
      </div>
    </div>
  );
});
