import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { userContext } from '~/root';

export const CreateTextCard = component$(() => {
  const { loggedIn } = useContext(userContext);
  return (
    <div class="card bg-base-200 mt-3">
      <div class="card-body">
        <h2 class="card-title">Станьте героем 💪</h2>
        <p>Поделитесь текстом с другими посетителями сайта и станьте героем нашего клуба!</p>
        <div class="card-actions justify-end">
          <div class={loggedIn ? '' : 'tooltip tooltip-info tooltip-bottom'} data-tip="Нужно войти">
            <Link prefetch="js" href="/create/text">
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
