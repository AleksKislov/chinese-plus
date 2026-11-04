import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, Link, type RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
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
import { NEW_LEVEL_WORDS } from '~/components/hsk/exams/levels';
import { grammarTopicsText, loadGrammarLevels } from '~/components/grammar/grammar-level-page';
import {
  GRAMMAR_LEVELS,
  grammarHubUrl,
  grammarLevelLabel,
  grammarLevelUrl,
  grammarOgImage,
} from '~/components/grammar/types';

// Levels used to be ?lvl= on this page; they have their own pages now.
export const onGet: RequestHandler = ({ query, redirect }) => {
  const lvl = query.get('lvl');
  if (lvl === null) return;
  throw redirect(301, GRAMMAR_LEVELS.includes(lvl) ? grammarLevelUrl(lvl) : grammarHubUrl);
};

export const useGrammarLevels = routeLoader$(() => loadGrammarLevels());

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);
  const levels = useGrammarLevels();
  const total = levels.value.reduce((sum, l) => sum + l.count, 0);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Грамматика HSK 3.0' }]} />
      <PageTitle txt="Грамматика китайского языка по уровням HSK 3.0" />

      <FlexRow>
        <Sidebar>
          <PhoneticsLinkCard />
          <CharactersLinkCard />
        </Sidebar>

        <MainContent>
          {bannerAds?.isActive && <BannerAds />}

          <div class="prose max-w-none mb-6">
            <p>
              Вся грамматика китайского языка по новому стандарту HSK 3.0
              {total ? <> — {grammarTopicsText(total)} для уровней 1–9</> : ''}. Темы идут в порядке
              официальной программы экзамена: от первых конструкций HSK 1 до сложных оборотов HSK
              7–9.
            </p>
            <ul>
              <li>короткое объяснение каждой темы на русском;</li>
              <li>конструкция и примеры с пиньинем и переводом;</li>
              <li>аудио к каждому примеру и перевод любого слова по нажатию.</li>
            </ul>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 mb-6">
            {levels.value.map(({ level, count }) => {
              const words = NEW_LEVEL_WORDS[level === '789' ? '7' : level];
              return (
                <Link
                  key={level}
                  href={grammarLevelUrl(level)}
                  class="card bg-base-100 border border-base-300 hover:border-primary transition-colors"
                >
                  <div class="card-body p-4">
                    <h2 class="card-title text-lg">Грамматика HSK {grammarLevelLabel(level)}</h2>
                    <p class="text-sm opacity-80">
                      {grammarTopicsText(count)}
                      {words ? ` · лексика уровня — ${words} слов` : ''}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const levels = resolveValue(useGrammarLevels);
  const total = levels.reduce((sum, l) => sum + l.count, 0);
  const title = 'Грамматика китайского языка по уровням HSK 3.0 — с примерами и аудио | Chinese+';
  const description = `Грамматика китайского языка по новому стандарту HSK 3.0${
    total ? `: ${grammarTopicsText(total)} для уровней 1–9` : ''
  }. Объяснения на русском, примеры с пиньинем, переводом и аудио.`;
  const url = `${CONST_URLS.siteUrl}${grammarHubUrl}`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${grammarOgImage()}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
