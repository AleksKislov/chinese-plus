import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';

export default component$(() => {
  return (
    <>
      <PageTitle txt={'Страница 404'} />

      <FlexRow>
        <MainContent>
          <div class="prose">
            <p>
              Мы обновили сайт, возможно, нужная вам страница теперь по другому адресу.
              <br />
              Поищите то, что вам нужно в меню выше.
            </p>
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ 404',
  meta: [
    {
      name: 'description',
      content: 'Не туда попали? :)',
    },
  ],
};
