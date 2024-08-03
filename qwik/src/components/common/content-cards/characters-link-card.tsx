import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const CharactersLinkCard = component$(() => {
  return (
    <div class="card w-full bg-base-200 my-3">
      <div class="card-body">
        <h2 class="card-title">Иероглифы сложные?</h2>
        <p>
          Смотрите короткие лекции по{' '}
          <Link class="link link-hover link-secondary font-bold" href="/watch/characters-lessons">
            иероглифике
          </Link>{' '}
          китайского языка: черты и типы иероглифов, ключи, правила написания, как запоминать и пр.
        </p>
      </div>
    </div>
  );
});
