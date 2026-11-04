import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { featuresArr } from './features';
import HanziWriter from 'hanzi-writer';
import { HanziWriterSettings } from '~/routes/dictionary';

type FeatureCardProps = {
  ind: number;
};

export const FeatureCard = component$(({ ind }: FeatureCardProps) => {
  const { title, desc, pic, links, animatedChar } = featuresArr[ind];
  useVisibleTask$(() => {
    if (!animatedChar) return;
    const writer = HanziWriter.create('showCharDiv', '字', HanziWriterSettings);
    writer.loopCharacterAnimation();
  });

  return (
    <div class="card bg-base-300">
      <div class="card-body">
        <h2 class="card-title">{title}</h2>

        <div>
          <div class={`float-left mr-3 text-secondary ${ind === 0 ? 'mt-1' : ''}`}>{pic}</div>
          <p>{desc}</p>
        </div>

        <ul class="grid grid-cols-2 gap-x-3 gap-y-1 mt-auto pt-2 text-sm">
          {links.map(({ href, text }) => (
            <li key={href}>
              <Link prefetch="js" href={href} class="link link-hover link-secondary">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
