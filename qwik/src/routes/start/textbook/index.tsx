import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, useLocation } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { PhoneticsLinkCard } from '~/components/common/content-cards/phonetics-link-card';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { configContext } from '~/root';
import YANDEX_ADS from '~/misc/consts/ads';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import { TextbookCard } from '~/components/textbook/textbook-card';
import { TextbookContent } from '~/components/textbook/textbook-content';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';

export type TextbookType = {
  _id: ObjectId;
  ind: number;
  level: string;
  topic: string;
  content: TextbookContentType[];
};

export type TextbookContentType = {
  desc: string;
  examples: TextbookExampleType[];
};

export type TextbookExampleType = {
  cn: TooltipSegment[];
  // tooltips: TooltipSegment[];
  py: string;
  ru: string;
  audio: string;
};

export type ShortTextbookType = {
  [key: string]: number;
};

export const useTextbook = routeLoader$(async (ev): Promise<TextbookType[]> => {
  const lvl = ev.query.get('lvl') || '1';
  return await ApiService.get(`/api/textbooks?lvl=${lvl}`, undefined, []);
});

export const useAllTextbooks = routeLoader$(async (): Promise<ShortTextbookType> => {
  return await ApiService.get(`/api/textbooks`, undefined, {});
});

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);

  const loc = useLocation();
  const textbook = useTextbook();
  const allTextbooks = useAllTextbooks();

  return (
    <>
      <PageTitle txt={'Грамматика Китайского Языка'} />

      <FlexRow>
        <Sidebar>
          <TextbookCard
            curLevel={loc.url.searchParams.get('lvl') || '1'}
            val={allTextbooks.value}
          />

          <PhoneticsLinkCard />
          <CharactersLinkCard />
        </Sidebar>

        <MainContent>
          {bannerAds?.isActive && <BannerAds />}

          <TextbookContent topics={textbook?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Грамматика Китайского Языка для HSK v3.0',
  meta: [
    {
      name: 'description',
      content:
        'Грамматика разбита по уровням сложности HSK v3.0, все темы снабжены примерами с переводом и озвучкой носителем языка',
    },
  ],
};
