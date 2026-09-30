import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, useLocation } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Alerts } from '~/components/common/alerts/alerts';
import { TableCard } from '~/components/hsk/table-card';
import { Pagination } from '~/components/hsk/pagination';
import { OldHskTable } from '~/components/hsk/hsk-table';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { getWordsLevel, getWordsPage, getWordsSeo, wordsHead } from '~/components/hsk/words-seo';
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

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get('/api/words', token, []);
});

export const getHskWords = routeLoader$(async ({ query }): Promise<OldHskWordType[]> => {
  const lvl = query.get('lvl') || '1';
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

  const seo = getWordsSeo({
    version: 'old',
    page: 'table',
    lvl: getWordsLevel(loc.url, 'old'),
    pg: getWordsPage(loc.url),
  });

  return (
    <>
      <Breadcrumbs items={seo.crumbs} />
      <PageTitle txt={seo.h1} />

      <FlexRow>
        <Alerts />

        <Sidebar noAds={true}>
          <TableCard
            level={loc.url.searchParams.get('lvl') || '1'}
            isOldHsk={true}
            isForTests={false}
          />
          <CsvCard
            level={loc.url.searchParams.get('lvl') || '1'}
            isOldHsk={true}
            isPrivate={false}
          />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
          <HskExamsLinkCard version="old" level={loc.url.searchParams.get('lvl') || '1'} />
        </Sidebar>

        <MainContent>
          {mainContentAds?.isActive && <OurAds adsInfo={mainContentAds} />}
          {bannerAds?.isActive && <BannerAds />}

          <Pagination
            level={loc.url.searchParams.get('lvl') || '1'}
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

export const head: DocumentHead = ({ url }) =>
  wordsHead({
    version: 'old',
    page: 'table',
    lvl: getWordsLevel(url, 'old'),
    pg: getWordsPage(url),
  });
