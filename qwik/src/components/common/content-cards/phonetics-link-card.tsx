import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const PhoneticsLinkCard = component$(() => {
  return (
    <div class="card w-full bg-base-200 my-3">
      <div class="card-body">
        <h2 class="card-title">Пиньинь сложный? </h2>
        <p>
          Смотрите наш курс по{' '}
          <Link class="link link-hover link-secondary font-bold" href="/watch/phonetics-lessons">
            фонетике
          </Link>{' '}
          китайского языка: пиньинь, произношение, тоны, сочетания тонов и пр.
        </p>
      </div>
    </div>
  );
});
