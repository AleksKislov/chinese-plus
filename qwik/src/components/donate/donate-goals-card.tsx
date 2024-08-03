import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export const DonateGoalsCard = component$(() => {
  return (
    <div class="card w-full bg-base-200 mb-3">
      <div class="card-body">
        <h2 class="card-title">Наши цели</h2>

        <p>
          Типы целей проекта в порядке убывания приоритета:
          <br />
          <span class="badge badge-info badge-xs"></span> продвижение (новые пользователи,
          маркетинг)
          <br />
          <span class="badge badge-info badge-xs"></span> инфраструтура (сервер, хостинг, домен...)
          <br />
          <span class="badge badge-info badge-xs"></span> разработка (новый функционал и мотивация
          разработчика)
        </p>
        <p>
          Детальнее по целям читайте на{' '}
          <Link href="/feedback" class="link hover:link-success">
            форуме
          </Link>
          , вкладка <span class="badge badge-outline">цели</span>
        </p>
      </div>
    </div>
  );
});
