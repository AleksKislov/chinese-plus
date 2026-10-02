import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const PinyinChartLinkCard = component$(() => (
  <div class="card w-full bg-base-200 my-3">
    <div class="card-body">
      <h2 class="card-title">Все слоги китайского</h2>
      <p>
        Послушайте каждый слог в{' '}
        <Link class="link link-hover link-secondary font-bold" href="/start/pinyin-chart/">
          таблице пиньиня с озвучкой
        </Link>{' '}
        — от носителя языка, во всех тонах.
      </p>
    </div>
  </div>
));
