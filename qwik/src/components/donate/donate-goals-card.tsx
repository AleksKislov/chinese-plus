import { component$ } from '@builder.io/qwik';

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
      </div>
    </div>
  );
});
