import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { userContext } from '~/root';

export const CreateBlogCard = component$(() => {
  const { loggedIn } = useContext(userContext);
  return (
    <div class="card bg-base-200 mt-3">
      <div class="card-body">
        <h2 class="card-title">Напишите пост ✍️</h2>
        <p>
          Есть что рассказать или показать про Китай, кит. язык или наш сайт? Поделитесь с нами!
        </p>
        <div class="card-actions justify-end">
          <div class={loggedIn ? '' : 'tooltip tooltip-info tooltip-bottom'} data-tip="Нужно войти">
            <Link href="/create/blog">
              <button class="btn btn-sm btn-primary" disabled={!loggedIn}>
                ok!
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
