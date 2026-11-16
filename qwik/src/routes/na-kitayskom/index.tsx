import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { namesHubUrl } from '~/components/names/types';
import { type RuWordTopicListItem, ruWordUrl, ruWordsHubUrl } from '~/components/ru-words/types';

export const useRuWordTopics = routeLoader$(async (): Promise<RuWordTopicListItem[]> => {
  return await ApiService.get('/api/ru-words', undefined, []);
});

const FAQ = [
  {
    q: 'Как перевести слово с русского на китайский?',
    a: 'Найдите слово в списке: на его странице — иероглифы, пиньинь, произношение, порядок черт и примеры. Если слова нет, поищите его в китайско-русском словаре, он понимает и русские слова.',
  },
  {
    q: 'Что такое пиньинь?',
    a: 'Пиньинь — официальная запись китайских слов латиницей. Значки над гласными показывают тон: ā — ровный высокий, á — восходящий, ǎ — нисходяще-восходящий, à — резко нисходящий.',
  },
  {
    q: 'Почему одно русское слово переводится несколькими китайскими?',
    a: 'Китайский точнее в некоторых вещах: старший и младший брат, бабушка по маме и по папе называются по-разному, а «пожалуйста» в просьбе и в ответ на «спасибо» — разные слова. Такие варианты указаны на странице слова.',
  },
];

const normalize = (s: string) => s.trim().toLowerCase().replace(/ё/g, 'е');

export default component$(() => {
  const topics = useRuWordTopics();
  const query = useSignal('');

  // filtering only: the list is already loaded on the server
  const filtered = useComputed$(() => {
    const q = normalize(query.value);
    if (!q) return topics.value;
    const matches = (s: string) => normalize(s).startsWith(q);
    return topics.value
      .map((t) => ({
        ...t,
        words: t.words.filter(
          (w) => matches(w.ru) || w.also.some(matches) || w.cn.includes(query.value.trim()),
        ),
      }))
      .filter((t) => t.words.length);
  });

  return (
    <>
      <Breadcrumbs items={[{ name: 'Слова на китайском' }]} />
      <PageTitle txt="Как будет по-китайски: слова на китайском" />
      <p class="mb-4 max-w-3xl">
        Перевод самых нужных русских слов на китайский: как пишется слово иероглифами, пиньинь,
        произношение, порядок черт и примеры предложений. Мама, папа, привет, спасибо, цифры, цвета,
        животные и профессии — по темам.
      </p>

      <input
        type="search"
        class="input input-bordered w-full max-w-md mb-4"
        placeholder="Найти слово, например мама или спасибо"
        aria-label="Поиск слова"
        bind:value={query}
      />

      {!query.value.trim() && (
        <nav aria-label="Темы" class="flex flex-wrap gap-2 mb-6">
          {topics.value.map((t) => (
            <Link
              key={t.slug}
              prefetch="js"
              href={ruWordUrl(t.slug)}
              class="btn btn-sm btn-outline"
            >
              {t.name}
            </Link>
          ))}
        </nav>
      )}

      {filtered.value.length === 0 && (
        <p class="mb-6">
          Такого слова пока нет в списке. Попробуйте{' '}
          <Link
            prefetch="js"
            href={`/dictionary/${encodeURIComponent(query.value.trim())}`}
            class="link link-primary"
          >
            поискать в словаре
          </Link>
          .
        </p>
      )}

      {filtered.value.map((t) => (
        <section key={t.slug} class="mb-6">
          <h2 class="text-xl font-bold mb-2">
            <Link prefetch="js" href={ruWordUrl(t.slug)} class="link link-hover">
              {t.title}
            </Link>
          </h2>
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 list-none p-0">
            {t.words.map((w) => (
              <li key={w.slug}>
                <Link prefetch="js" href={ruWordUrl(w.slug)} class="link link-hover">
                  <span class="font-bold">{w.ru}</span> — {w.cn}{' '}
                  <span class="opacity-60 text-sm">{w.py}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div class="prose max-w-none mt-6">
        <p>
          Ищете, как пишется имя по-китайски? Смотрите раздел{' '}
          <Link prefetch="js" href={namesHubUrl}>
            «Имя на китайском»
          </Link>
          .
        </p>
        <h2>Вопросы и ответы</h2>
        {FAQ.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />
    </>
  );
});

export const head: DocumentHead = () => {
  const title = 'Слова на китайском — как будет по-китайски мама, привет, спасибо | Chinese+';
  const description =
    'Как будет по-китайски: перевод русских слов на китайский иероглифами. Мама, папа, привет, спасибо, цифры, цвета и животные на китайском — пиньинь, произношение, порядок черт и примеры.';
  const url = `${CONST_URLS.siteUrl}${ruWordsHubUrl}`;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
