import { component$, useContext, useSignal } from '@builder.io/qwik';
import { type DocumentHeadValue, Link } from '@builder.io/qwik-city';
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
import { NEW_LEVEL_WORDS, examsPath, pluralRu, wordsPath } from '~/components/hsk/exams/levels';
import { GrammarLevelsCard } from './grammar-levels-card';
import { GrammarTopicCard } from './grammar-topic-card';
import { GrammarWordModals } from './grammar-word-modals';
import {
  GRAMMAR_CATEGORIES,
  type GrammarCategory,
  type GrammarLevelInfo,
  type GrammarTopicSummary,
  grammarHubUrl,
  grammarLevelLabel,
  grammarLevelUrl,
  grammarOgImage,
} from './types';

// Route loaders of the level pages (/hsk/grammar/{level}/) call these.
export const loadGrammarLevels = (): Promise<GrammarLevelInfo[]> =>
  ApiService.get('/api/grammar', undefined, []);

export const loadGrammarTopics = (level: string): Promise<GrammarTopicSummary[]> =>
  ApiService.get(`/api/grammar/level/${level}`, undefined, []);

// Grammar levels are '1'..'6', '789'; the word counts key levels 7-9 as '7'.
const grammarLevelWords = (level: string) => NEW_LEVEL_WORDS[level === '789' ? '7' : level];
const examLevel = (level: string) => (level === '789' ? '7' : level);

export const grammarTopicsText = (n: number) => `${n} ${pluralRu(n, ['тема', 'темы', 'тем'])}`;

export const grammarLevelHead = (
  level: string,
  topics: GrammarTopicSummary[],
): DocumentHeadValue => {
  const label = grammarLevelLabel(level);
  const count = topics.length;
  // A couple of real topic names make every level's description unique.
  const sample = topics
    .slice(0, 2)
    .map((t) => t.title.ru)
    .join(', ');
  const title = `Грамматика HSK ${label} (HSK 3.0)${
    count ? ` — ${grammarTopicsText(count)}` : ''
  } с примерами и аудио | Chinese+`;
  const description = `Грамматика HSK ${label} по новому стандарту HSK 3.0${
    count ? `: ${grammarTopicsText(count)}${sample ? ` — ${sample} и другие` : ''}` : ''
  }. Объяснения на русском, примеры с пиньинем, переводом и аудио.`;
  const url = `${CONST_URLS.siteUrl}${grammarLevelUrl(level)}`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${grammarOgImage(level)}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};

type GrammarLevelPageProps = {
  level: string;
  levels: GrammarLevelInfo[];
  topics: GrammarTopicSummary[];
};

export const GrammarLevelPage = component$(({ level, levels, topics }: GrammarLevelPageProps) => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const currentWord = useSignal<DictWord | null>(null);
  const label = grammarLevelLabel(level);
  const words = grammarLevelWords(level);

  const categories = (Object.keys(GRAMMAR_CATEGORIES) as GrammarCategory[])
    .map((category) => ({
      category,
      topics: topics.filter((t) => t.category === category),
    }))
    .filter((c) => c.topics.length);

  return (
    <>
      <Breadcrumbs
        items={[{ name: 'Грамматика HSK 3.0', href: grammarHubUrl }, { name: `Уровень ${label}` }]}
      />
      <PageTitle txt={`Грамматика HSK ${label} — новый стандарт HSK 3.0`} />

      <FlexRow>
        <Sidebar>
          <GrammarLevelsCard levels={levels} curLevel={level} />
          <PhoneticsLinkCard />
          <CharactersLinkCard />
        </Sidebar>

        <MainContent>
          {bannerAds?.isActive && <BannerAds />}

          {!!topics.length && (
            <div class="prose max-w-none mb-6">
              <p>
                Грамматический минимум уровня HSK {label} по новому стандарту HSK 3.0 —{' '}
                {grammarTopicsText(topics.length)}. В каждой теме — объяснение на русском,
                конструкция и примеры с пиньинем, переводом и аудио; любое слово в примере можно
                нажать и посмотреть в словаре.
              </p>
              <p>
                {words && (
                  <>
                    Лексика уровня —{' '}
                    <Link href={wordsPath('new', examLevel(level))}>{words} слов</Link>.{' '}
                  </>
                )}
                Проверить себя можно на{' '}
                <Link href={examsPath('new')}>пробных экзаменах HSK 3.0</Link>.
              </p>
            </div>
          )}

          {!topics.length && <div class="alert">Темы для этого уровня ещё готовятся.</div>}

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
