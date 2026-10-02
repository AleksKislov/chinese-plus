import { component$, useComputed$ } from '@builder.io/qwik';
import { type DocumentHead, Link, useLocation, routeLoader$ } from '@builder.io/qwik-city';
import { TableCard } from '~/components/hsk/table-card';
import { Pagination } from '~/components/hsk/pagination';
import { ApiService } from '~/misc/actions/request';
import { NewHskTable } from '~/components/hsk/new-hsk-table';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { getWordsLevel, getWordsPage, getWordsSeo, wordsHead } from '~/components/hsk/words-seo';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { CsvCard } from '~/components/hsk/csv-card';
import { type NewHskWordType } from '../table';

// previous (2021) HSK 3.0 word list, kept for reference
export const getOldHskWords = routeLoader$(async (ev): Promise<NewHskWordType[]> => {
  const lvl = ev.query.get('lvl') || '1';
  const lmt = ev.query.get('pg') || '0';
  return await ApiService.get(
    `/api/newhskwords?hsk_level=${lvl}&limit=${lmt}&version=2021`,
    undefined,
    [],
  );
});

export default component$(() => {
  const loc = useLocation();
  const hskWords = getOldHskWords();
  const level = useComputed$(() => loc.url.searchParams.get('lvl') || '1');

  // useComputed$ re-derives on ?lvl= / ?pg= changes; a plain const in the component
  // body is computed once, leaving the H1 and breadcrumbs on the first level.
  const seo = useComputed$(() =>
    getWordsSeo({
      version: 'new',
      page: 'old-table',
      lvl: getWordsLevel(loc.url, 'new'),
      pg: getWordsPage(loc.url),
    }),
  );

  return (
    <>
      <Breadcrumbs items={seo.value.crumbs} />
      <PageTitle txt={seo.value.h1} />

      <FlexRow>
        <Sidebar>
          <TableCard level={level.value} isOldHsk={false} isForTests={false} isLegacyBand={true} />
          <CsvCard level={level.value} isOldHsk={false} isPrivate={false} isLegacyBand={true} />
        </Sidebar>

        <MainContent>
          <div class="alert alert-info mb-3">
            <span>
              Это старая редакция списка слов HSK 3.0 (2021). Актуальный список смотрите на странице{' '}
              <Link prefetch="js" href="/hsk/3/table" class="link">
                Таблица
              </Link>
              .
            </span>
          </div>

          <Pagination
            level={level.value}
            curPage={+loc.url.searchParams.get('pg')! || 0}
            isOldHsk={false}
            isLegacyBand={true}
          />

          <NewHskTable hskWords={hskWords?.value || []} isLegacyBand={true} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ url }) =>
  wordsHead({
    version: 'new',
    page: 'old-table',
    lvl: getWordsLevel(url, 'new'),
    pg: getWordsPage(url),
  });
