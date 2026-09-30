import { component$, useSignal } from '@builder.io/qwik';
import { HskSearchForm } from '~/components/hsk/search-form';
import { type NewHskWordType } from '../table';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { NewHskTable } from '~/components/hsk/new-hsk-table';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const hskWords = useSignal<NewHskWordType[]>([]);

  return (
    <>
      <PageTitle txt={'Поиск слов HSK 3.0'} />
      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Найти слово HSK 3.0</h2>
              <p>
                Найдите нужные вам слова нового HSK 3.0
                <br />1 уровень - 300 слов
                <br />2 уровень - 200 слов
                <br />3 уровень - 500 слов
                <br />4 уровень - 1000 слов
                <br />5 уровень - 1600 слов
                <br />6 уровень - 1800 слов
                <br />
                7-9 уровни - 5560 слов
              </p>
              <HskSearchForm hskWords={hskWords} isOldHsk={false} />
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <NewHskTable hskWords={hskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Поиск по словам HSK 3.0',
};
