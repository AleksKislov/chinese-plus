import { component$, useContext, useComputed$ } from '@builder.io/qwik';
import { type DocumentHead, Link, useLocation } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { TableCard } from '~/components/hsk/table-card';
import { Pagination } from '~/components/hsk/pagination';
import { ApiService } from '~/misc/actions/request';
import { NewHskTable } from '~/components/hsk/new-hsk-table';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import {
  getWordsLevel,
  getWordsPage,
  getWordsSeo,
  wordsHead,
  wordsLevelOnGet,
} from '~/components/hsk/words-seo';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { HskExamsLinkCard } from '~/components/hsk/exams-link-card';
import { MainContent } from '~/components/common/layout/main-content';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { CsvCard } from '~/components/hsk/csv-card';
import { PropisiLinkCard } from '~/components/propisi/propisi-link-card';
import { configContext } from '~/root';
import YANDEX_ADS from '~/misc/consts/ads';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import OUR_ADS from '~/misc/consts/our-ads';
import { OurAds } from '~/components/common/ads/our-ads';
import { Alerts } from '~/components/common/alerts/alerts';
import { useGetUserHsk3WordIds } from '~/misc/loaders/user-hsk3-loaders';

export { useGetUserHsk3WordIds } from '~/misc/loaders/user-hsk3-loaders';

export type NewHskWordType = {
  _id: ObjectId;
  id: number;
  cn: string;
  py: string;
  ru: string;
  lvl: string;
  audio?: string; // 2026 list: path under myAudioURL, absent if there is no audio yet
};

// /hsk/…/{lvl}/ - redirects old ?lvl= links and /1/, 404s unknown levels.
export const onGet = wordsLevelOnGet('new');

export const getHskWords = routeLoader$(async (ev): Promise<NewHskWordType[]> => {
  const lvl = ev.params.lvl || '1';
  const lmt = ev.query.get('pg') || '0';
  return await ApiService.get(`/api/newhskwords?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const mainContentAds = configState.filter((x) => x.type === OUR_ADS.main_content)[0];

  const loc = useLocation();
  const hskWords = getHskWords();
  const userHskWordIds = useGetUserHsk3WordIds();

  // useComputed$ re-derives when the level / ?pg= changes; a plain const in the component
  // body is computed once, leaving the H1 and breadcrumbs on the first level.
  const seo = useComputed$(() =>
    getWordsSeo({
      version: 'new',
      page: 'table',
      lvl: getWordsLevel(loc.params, 'new'),
      pg: getWordsPage(loc.url),
    }),
  );

  return (
    <>
      <Breadcrumbs items={seo.value.crumbs} />
      <PageTitle txt={seo.value.h1} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <TableCard level={loc.params.lvl || '1'} isOldHsk={false} isForTests={false} />
          <CsvCard level={loc.params.lvl || '1'} isOldHsk={false} isPrivate={false} />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
          <PropisiLinkCard version="3" level={loc.params.lvl || '1'} />
          <HskExamsLinkCard version="new" level={loc.params.lvl || '1'} />
        </Sidebar>

        <MainContent>
          {mainContentAds?.isActive && <OurAds adsInfo={mainContentAds} />}
          {bannerAds?.isActive && <BannerAds />}

          <div class="alert mb-3">
            <span>
              Список слов обновлён по стандарту 2026 года (новый HSK 3.0). Прежний список доступен
              на странице{' '}
              <Link prefetch="js" href="/hsk/3/old-table" class="link">
                Старая таблица
              </Link>
              .
            </span>
          </div>

          <Pagination
            level={loc.params.lvl || '1'}
            curPage={+loc.url.searchParams.get('pg')! || 0}
            isOldHsk={false}
          />

          <NewHskTable
            hskWords={hskWords?.value || []}
            userHskWordIds={userHskWordIds.value || []}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ url, params }) =>
  wordsHead({
    version: 'new',
    page: 'table',
    lvl: getWordsLevel(params, 'new'),
    pg: getWordsPage(url),
  });
