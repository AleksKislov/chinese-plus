import { component$, useSignal } from '@builder.io/qwik';
import { OldHskTable } from '~/components/hsk/hsk-table';
import { HskSearchForm } from '~/components/hsk/search-form';
import { type OldHskWordType } from '../table';

import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { getWordsSeo, wordsHead } from '~/components/hsk/words-seo';
import { type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const hskWords = useSignal<OldHskWordType[]>([]);

  const seo = getWordsSeo({ version: 'old', page: 'search' });

  return (
    <>
      <Breadcrumbs items={seo.crumbs} />
      <PageTitle txt={seo.h1} />
      <FlexRow>
        <Sidebar>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Найти слово HSK 2.0</h2>
              <p>Введите иероглиф (часть слова) или слово целиком (любые из 5 000 слов)</p>
              <HskSearchForm hskWords={hskWords} isOldHsk={true} />
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <OldHskTable hskWords={hskWords?.value || []} userHskWords={[]} isPrivate={false} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = () => wordsHead({ version: 'old', page: 'search' });
