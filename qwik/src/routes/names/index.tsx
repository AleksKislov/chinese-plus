import { component$, useComputed$, useSignal } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { type NameListItem, nameUrl, namesHubUrl, namesOgImage } from '~/components/names/types';

export const useNames = routeLoader$(async (): Promise<NameListItem[]> => {
  return await ApiService.get('/api/names', undefined, []);
});

const FAQ = [
  {
    q: 'Как перевести своё имя на китайский?',
    a: 'Русские имена не переводят, а передают по звучанию: для каждого слога берут иероглиф с похожим чтением. У большинства имён есть устоявшееся написание — найдите своё имя в списке.',
  },
  {
    q: 'Что означает моё имя на китайском?',
    a: 'Имя целиком ничего не означает: иероглифы подобраны по звучанию. На странице каждого имени есть значения отдельных иероглифов.',
  },
  {
    q: 'Можно ли доверять генераторам китайских имён?',
    a: 'Лучше нет: генераторы подбирают знаки механически и могут выдать иероглиф с неприятным значением, например 猪 «свинья» или 死 «смерть». Для тату и печатей используйте устоявшийся вариант.',
  },
  {
    q: 'Чем китайское имя отличается от транскрипции?',
    a: 'Транскрипция (亚历山大 для Александра) звучит как русское имя. Китайское имя — это отдельное имя из фамилии и имени по китайским правилам, его обычно выбирают вместе с преподавателем или друзьями-китайцами.',
  },
];

const NameList = component$(({ names }: { names: NameListItem[] }) => (
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 list-none p-0">
    {names.map((n) => (
      <li key={n.slug}>
        <Link prefetch="js" href={nameUrl(n.slug)} class="link link-hover">
          <span class="font-bold">{n.name}</span> — {n.cn}{' '}
          <span class="opacity-60 text-sm">{n.py}</span>
        </Link>
        {n.short.length > 0 && (
          <span class="text-sm">
            {' ('}
            {n.short.map((s, ind) => (
              <span key={s.slug}>
                {ind > 0 && ', '}
                <Link prefetch="js" href={nameUrl(s.slug)} class="link link-hover opacity-70">
                  {s.name}
                </Link>
              </span>
            ))}
            {')'}
          </span>
        )}
      </li>
    ))}
  </ul>
));

export default component$(() => {
  const names = useNames();
  const query = useSignal('');

  // filtering only: the list is already loaded on the server
  const filtered = useComputed$(() => {
    const q = query.value.trim().toLowerCase().replace(/ё/g, 'е');
    // short forms have pages too, but are listed next to their full names
    const full = names.value.filter((n) => n.kind === 'full');
    if (!q) return full;
    const matches = (s: string) => s.toLowerCase().replace(/ё/g, 'е').startsWith(q);
    return full.filter((n) => matches(n.name) || n.short.some((s) => matches(s.name)));
  });

  const male = filtered.value.filter((n) => n.gender === 'm');
  const female = filtered.value.filter((n) => n.gender === 'f');

  return (
    <>
      <Breadcrumbs items={[{ name: 'Имя на китайском' }]} />
      <PageTitle txt="Имя на китайском" />
      <p class="mb-4 max-w-3xl">
        Как пишутся русские имена по-китайски: перевод имени на китайский иероглифами, устоявшиеся
        варианты из словаря, пиньинь, значение каждого иероглифа и порядок черт. Уменьшительные
        формы (Саша, Маша, Женя) — в скобках рядом с полным именем.
      </p>

      <input
        type="search"
        class="input input-bordered w-full max-w-md mb-6"
        placeholder="Найти имя, например Александр или Саша"
        aria-label="Поиск имени"
        bind:value={query}
      />

      {filtered.value.length === 0 && (
        <p class="mb-6">
          Такого имени пока нет в списке. Попробуйте{' '}
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

      {male.length > 0 && (
        <section class="mb-6">
          <h2 class="text-xl font-bold mb-2">Мужские имена</h2>
          <NameList names={male} />
        </section>
      )}
      {female.length > 0 && (
        <section class="mb-6">
          <h2 class="text-xl font-bold mb-2">Женские имена</h2>
          <NameList names={female} />
        </section>
      )}

      <div class="prose max-w-none mt-6">
        <h2>Как русские имена пишутся по-китайски</h2>
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
  const title = 'Имя на китайском — как пишутся русские имена по-китайски иероглифами | Chinese+';
  const description =
    'Русские имена на китайском: как будет Александр, Мария, Денис, Анастасия по-китайски. Перевод имени на китайский иероглифами, пиньинь, значение каждого иероглифа и порядок черт.';
  const url = `${CONST_URLS.siteUrl}${namesHubUrl}`;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${namesOgImage}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
