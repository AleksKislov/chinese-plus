import { component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { Breadcrumbs, truncateCrumb } from '~/components/common/layout/breadcrumbs';
import CONST_URLS from '~/misc/consts/urls';
import { GrammarLevelsCard } from '~/components/grammar/grammar-levels-card';
import { GrammarTopicBody } from '~/components/grammar/grammar-topic-body';
import { GrammarWordModals } from '~/components/grammar/grammar-word-modals';
import {
  GRAMMAR_CATEGORIES,
  type GrammarLevelInfo,
  type GrammarTopicResponse,
  grammarHubUrl,
  grammarLevelLabel,
  grammarLevelUrl,
  grammarOgImage,
  grammarTopicUrl,
} from '~/components/grammar/types';

export const useGrammarTopic = routeLoader$(
  async ({ params, status }): Promise<GrammarTopicResponse | null> => {
    const res = await ApiService.get(`/api/grammar/topic/${params.slug}`, undefined, null);
    if (!res?.topic) {
      status(404);
      return null;
    }
    return res;
  },
);

export const useGrammarLevels = routeLoader$(async (): Promise<GrammarLevelInfo[]> => {
  return await ApiService.get('/api/grammar', undefined, []);
});

export default component$(() => {
  const data = useGrammarTopic();
  const levels = useGrammarLevels();
  const currentWord = useSignal<DictWord | null>(null);

  if (!data.value) {
    return (
      <>
        <PageTitle txt="Тема не найдена" />
        <Link href={grammarHubUrl} class="link link-primary">
          ← Все темы грамматики
        </Link>
      </>
    );
  }

  const { topic, prev, next } = data.value;
  const levelLabel = grammarLevelLabel(topic.level);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Грамматика HSK 3.0', href: grammarHubUrl },
          { name: `Уровень ${levelLabel}`, href: grammarLevelUrl(topic.level) },
          { name: truncateCrumb(topic.title.ru) },
        ]}
      />
      <PageTitle txt={topic.title.ru} hSizeSm={true} />
      <p class="text-xl opacity-70 mb-4">
        {topic.title.cn} · HSK {levelLabel} · {GRAMMAR_CATEGORIES[topic.category]?.ru}
      </p>

      <FlexRow>
        <Sidebar>
          <GrammarLevelsCard levels={levels.value} curLevel={topic.level} />
        </Sidebar>

        <MainContent>
          <div class="card bg-base-100 border border-primary">
            <div class="card-body">
              <GrammarTopicBody topic={topic} currentWord={currentWord} />
            </div>
          </div>

          <div class="flex justify-between gap-4 mt-6">
            <div>
              {prev && (
                <Link href={grammarTopicUrl(prev.slug)} class="btn btn-outline btn-sm h-auto py-2">
                  ← {prev.title.ru}
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link href={grammarTopicUrl(next.slug)} class="btn btn-outline btn-sm h-auto py-2">
                  {next.title.ru} →
                </Link>
              )}
            </div>
          </div>

          <GrammarWordModals currentWord={currentWord} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useGrammarTopic);
  if (!data) {
    return {
      title: 'Тема не найдена | Chinese+',
      meta: [{ name: 'robots', content: 'noindex' }],
    };
  }

  const { topic } = data;
  const levelLabel = grammarLevelLabel(topic.level);
  const title = `${topic.title.ru} (${topic.title.cn}) — грамматика HSK ${levelLabel} | Chinese+`;
  const description = `${topic.summary} Грамматика HSK ${levelLabel} (HSK 3.0): примеры с пиньинем, переводом и аудио.`;
  const url = `${CONST_URLS.siteUrl}${grammarTopicUrl(topic.slug)}`;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${grammarOgImage(topic.level)}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
