import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import { TonesPractice } from '~/components/start/tones-practice/tones-practice';

export default component$(() => {
  return (
    <>
      <PageTitle txt={'Практика произнесения тонов'} />

      <FlexRow>
        <Sidebar>
          <div class="card w-full bg-base-200">
            <div class="card-body">
              <h2 class="card-title">Внимание</h2>
              <p>Лучше работает с отдельным микрофоном перед ртом.</p>
              <p>Микрофон проводных наушников тоже сойдет</p>
              <p class="text-xs">
                Для референса взята библиотека:{' '}
                <Link
                  href="https://github.com/sanjirenqunti/sanjirenqunti.github.io"
                  class="link link-hover link-secondary font-bold"
                >
                  github
                </Link>
              </p>
            </div>
          </div>
          <PhoneticsLinkCard />
        </Sidebar>
        <MainContent>
          <TonesPractice />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Практика произнесения тонов',
  meta: [
    {
      name: 'description',
      content:
        'Аудио-практика китайских тонов: тренируйтесь произносить тоны китайского языка с наглядным отображением произнесенного звука.',
    },
  ],
};
