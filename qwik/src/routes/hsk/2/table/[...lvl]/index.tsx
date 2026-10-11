import { component$, useContext, useComputed$ } from '@builder.io/qwik';
import { type DocumentHead, useLocation } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { TableCard } from '~/components/hsk/table-card';
import { Pagination } from '~/components/hsk/pagination';
import { OldHskTable } from '~/components/hsk/hsk-table';
import { ApiService } from '~/misc/actions/request';
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
import { getTokenFromCookie } from '~/misc/actions/auth';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { CsvCard } from '~/components/hsk/csv-card';
import { configContext } from '~/root';
import YANDEX_ADS from '~/misc/consts/ads';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import OUR_ADS from '~/misc/consts/our-ads';
import { OurAds } from '~/components/common/ads/our-ads';

export type OldHskWordType = {
  _id: ObjectId;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

export type UserOldHskWordType = {
  _id: ObjectId;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
  hskWordId: ObjectId;
};

// /hsk/…/{lvl}/ - redirects old ?lvl= links and /1/, 404s unknown levels.
export const onGet = wordsLevelOnGet('old');

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get('/api/words', token, []);
});

export const getHskWords = routeLoader$(async ({ query, params }): Promise<OldHskWordType[]> => {
  const lvl = params.lvl || '1';
  const lmt = query.get('pg') || '0';
  return await ApiService.get(`/api/lexicon?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const mainContentAds = configState.filter((x) => x.type === OUR_ADS.main_content)[0];

  const loc = useLocation();
  const hskWords = getHskWords();
  const userHskWords = getUserHsk2Words();

  // useComputed$ re-derives when the level / ?pg= changes; a plain const in the component
  // body is computed once, leaving the H1 and breadcrumbs on the first level.
  const seo = useComputed$(() =>
    getWordsSeo({
      version: 'old',
      page: 'table',
      lvl: getWordsLevel(loc.params, 'old'),
      pg: getWordsPage(loc.url),
    }),
  );

  return (
    <>
      <Breadcrumbs items={seo.value.crumbs} />
      <PageTitle txt={seo.value.h1} />

      <FlexRow>
        <Alerts />

        <Sidebar noAds={true}>
          <TableCard level={loc.params.lvl || '1'} isOldHsk={true} isForTests={false} />
          <CsvCard level={loc.params.lvl || '1'} isOldHsk={true} isPrivate={false} />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
          <HskExamsLinkCard version="old" level={loc.params.lvl || '1'} />
        </Sidebar>

        <MainContent>
          {mainContentAds?.isActive && <OurAds adsInfo={mainContentAds} />}
          {bannerAds?.isActive && <BannerAds />}

          <Pagination
            level={loc.params.lvl || '1'}
            curPage={+loc.url.searchParams.get('pg')! || 0}
            isOldHsk={true}
          />

          <OldHskTable
            hskWords={hskWords?.value || []}
            userHskWords={userHskWords?.value || []}
            isPrivate={false}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ url, params }) =>
  wordsHead({
    version: 'old',
    page: 'table',
    lvl: getWordsLevel(params, 'old'),
    pg: getWordsPage(url),
  });
