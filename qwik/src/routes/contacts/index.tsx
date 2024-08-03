import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';

export default component$(() => {
  return (
    <>
      <PageTitle txt={'Пойти на контакт'} />

      <FlexRow>
        <MainContent>
          <div class="prose">
            <p>
              Телеграм админа: <code>@sinokislov</code>
              <br />
              Почта: <code>sinokislov@gmail.com</code>
              <br />
              Быстрее реагирую на телеграм или комментарии здесь на сайте.
            </p>
            <h3>О нас</h3>
            <p>Проект делают 2 человека: Александр (разработка) и Вэйи (китайский язык).</p>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Контакты',
  meta: [
    {
      name: 'description',
      content: 'Кто мы и как с нами связаться',
    },
  ],
};
