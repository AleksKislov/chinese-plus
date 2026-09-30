import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, Link, useLocation } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { TableCard } from '~/components/hsk/table-card';
import { Pagination } from '~/components/hsk/pagination';
import { ApiService } from '~/misc/actions/request';
import { NewHskTable } from '~/components/hsk/new-hsk-table';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { getWordsLevel, getWordsPage, getWordsSeo, wordsHead } from '~/components/hsk/words-seo';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { HskExamsLinkCard } from '~/components/hsk/exams-link-card';
import { MainContent } from '~/components/common/layout/main-content';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { CsvCard } from '~/components/hsk/csv-card';
import { configContext } from '~/root';
import YANDEX_ADS from '~/misc/consts/ads';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import OUR_ADS from '~/misc/consts/our-ads';
import { OurAds } from '~/components/common/ads/our-ads';

export type NewHskWordType = {
  _id: ObjectId;
  id: number;
  cn: string;
  py: string;
  ru: string;
  lvl: string;
  audio?: string; // 2025 list: path under myAudioURL, absent if there is no audio yet
};

export const getHskWords = routeLoader$(async (ev): Promise<NewHskWordType[]> => {
  const lvl = ev.query.get('lvl') || '1';
  const lmt = ev.query.get('pg') || '0';
  return await ApiService.get(`/api/newhskwords?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const mainContentAds = configState.filter((x) => x.type === OUR_ADS.main_content)[0];

  const loc = useLocation();
  const hskWords = getHskWords();

  const seo = getWordsSeo({
    version: 'new',
    page: 'table',
    lvl: getWordsLevel(loc.url, 'new'),
    pg: getWordsPage(loc.url),
  });

  return (
    <>
      <Breadcrumbs items={seo.crumbs} />
      <PageTitle txt={seo.h1} />

      <FlexRow>
        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get('lvl') || '1'}
            isOldHsk={false}
            isForTests={false}
          />
          <CsvCard
            level={loc.url.searchParams.get('lvl') || '1'}
            isOldHsk={false}
            isPrivate={false}
          />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
          <HskExamsLinkCard version="new" level={loc.url.searchParams.get('lvl') || '1'} />
        </Sidebar>

        <MainContent>
          {mainContentAds?.isActive && <OurAds adsInfo={mainContentAds} />}
          {bannerAds?.isActive && <BannerAds />}

          <div class="alert mb-3">
            <span>
              Список слов обновлён по стандарту 2025 года (новый HSK 3.0). Прежний список доступен
              на странице{' '}
              <Link href="/hsk/3/old-table" class="link">
                Старая таблица
              </Link>
              .
            </span>
          </div>

          <Pagination
            level={loc.url.searchParams.get('lvl') || '1'}
            curPage={+loc.url.searchParams.get('pg')! || 0}
            isOldHsk={false}
          />

          <NewHskTable hskWords={hskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ url }) =>
  wordsHead({
    version: 'new',
    page: 'table',
    lvl: getWordsLevel(url, 'new'),
    pg: getWordsPage(url),
  });
