import { component$, useContext, useSignal } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
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
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import CONST_URLS from '~/misc/consts/urls';
import { GrammarLevelsCard } from '~/components/grammar/grammar-levels-card';
import { GrammarTopicCard } from '~/components/grammar/grammar-topic-card';
import { GrammarWordModals } from '~/components/grammar/grammar-word-modals';
import {
  GRAMMAR_CATEGORIES,
  type GrammarCategory,
  type GrammarLevelInfo,
  type GrammarTopicSummary,
  grammarLevelLabel,
  grammarLevelUrl,
} from '~/components/grammar/types';

const getLevel = (query: URLSearchParams) => query.get('lvl') || '1';

export const useGrammarLevels = routeLoader$(async (): Promise<GrammarLevelInfo[]> => {
  return await ApiService.get('/api/grammar', undefined, []);
});

export const useGrammarTopics = routeLoader$(async (ev): Promise<GrammarTopicSummary[]> => {
  return await ApiService.get(`/api/grammar/level/${getLevel(ev.query)}`, undefined, []);
});

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);

  const loc = useLocation();
  const level = getLevel(loc.url.searchParams);
  const levels = useGrammarLevels();
  const topics = useGrammarTopics();
  const currentWord = useSignal<DictWord | null>(null);

  const categories = (Object.keys(GRAMMAR_CATEGORIES) as GrammarCategory[])
    .map((category) => ({
      category,
      topics: topics.value.filter((t) => t.category === category),
    }))
    .filter((c) => c.topics.length);

  return (
    <>
      <Breadcrumbs
        items={
          level === '1'
            ? [{ name: 'Грамматика' }]
            : [
                { name: 'Грамматика', href: grammarLevelUrl('1') },
                { name: `Уровень ${grammarLevelLabel(level)}` },
              ]
        }
      />
      <PageTitle txt={`Грамматика китайского языка — HSK ${grammarLevelLabel(level)}`} />

      <FlexRow>
        <Sidebar>
          <GrammarLevelsCard levels={levels.value} curLevel={level} />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
        </Sidebar>

        <MainContent>
          {bannerAds?.isActive && <BannerAds />}

          {!topics.value.length && <div class="alert">Темы для этого уровня ещё готовятся.</div>}

          {categories.map(({ category, topics }) => (
            <section key={category} class="mb-8">
              <div class="prose mb-2">
                <h2>
                  {GRAMMAR_CATEGORIES[category].ru}{' '}
                  <span class="opacity-60 text-lg font-normal">
                    {GRAMMAR_CATEGORIES[category].cn}
                  </span>
                </h2>
              </div>

              {topics.map((topic) => (
                <GrammarTopicCard key={topic.slug} topic={topic} currentWord={currentWord} />
              ))}
            </section>
          ))}

          <GrammarWordModals currentWord={currentWord} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ url }) => {
  const level = getLevel(url.searchParams);
  const label = grammarLevelLabel(level);
  return {
    title: `Грамматика китайского языка HSK ${label} (HSK 3.0) | Chinese+`,
    meta: [
      {
        name: 'description',
        content: `Грамматика HSK ${label} по новому стандарту HSK 3.0 (редакция 2026): все темы уровня с объяснениями на русском, примерами, пиньинем, переводом и озвучкой.`,
      },
    ],
    links: [{ rel: 'canonical', href: `${CONST_URLS.siteUrl}${grammarLevelUrl(level)}` }],
  };
};
