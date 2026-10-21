import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { NameCharCard } from '~/components/names/name-char-card';
import {
  type NameResponse,
  type NameVariant,
  type RuName,
  dictionaryUrl,
  nameUrl,
  namesHubUrl,
  namesOgImage,
} from '~/components/names/types';

export const useName = routeLoader$(async ({ params, status }): Promise<NameResponse | null> => {
  const res = await ApiService.get(`/api/names/${params.slug}`, undefined, null);
  if (!res?.name) {
    status(404);
    return null;
  }
  return res;
});

const fullNames = (name: RuName) => (name.of || []).map((o) => o.name).join(' и ');

const kindLabel = (name: RuName) => {
  if (name.kind === 'short') return `уменьшительная форма имени ${fullNames(name)}`;
  return name.gender === 'm' ? 'мужское имя' : 'женское имя';
};

const variantsText = (variants: NameVariant[], sep = ', ') =>
  variants.map((v) => `${v.cn} (${v.py})`).join(sep);

const nameFaq = (name: RuName) => {
  const [main, ...others] = name.variants;
  return [
    {
      q: `Как пишется имя ${name.name} на китайском?`,
      a: `${name.name} на китайском пишется ${main.cn} (${main.py}).${
        others.length ? ` Также встречаются варианты: ${variantsText(others)}.` : ''
      }`,
    },
    {
      q: `Как будет ${name.name} по-китайски?`,
      a: `${name.name} по-китайски — ${main.cn}, на пиньине ${main.py}. Это перевод имени иероглифами по звучанию: так имя ${name.name} пишут в словарях и переводах.`,
    },
    {
      q: `Что означают иероглифы имени ${name.name}?`,
      a: `Иероглифы подобраны по звучанию, поэтому имя целиком ничего не означает. По отдельности: ${(
        main.chars || []
      )
        .map((c) => `${c.ch} (${c.py}) — ${c.meaning || 'используется в транскрипции'}`)
        .join('; ')}.`,
    },
    {
      q: `Какое китайское имя выбрать, если меня зовут ${name.name}?`,
      a: `${main.cn} — это транскрипция, она звучит как «${name.name}» и подходит для документов, тату и подписи. Китайское имя в полном смысле составляют отдельно: фамилия из одного иероглифа и имя из одного-двух, часто созвучное с русским. Его обычно выбирают вместе с преподавателем или друзьями-китайцами.`,
    },
    ...name.short.map((s) => ({
      q: `Как будет ${s.name} на китайском?`,
      a: `${s.name} на китайском — ${variantsText(s.variants, ' или ')}.`,
    })),
  ];
};

export default component$(() => {
  const data = useName();

  if (!data.value) {
    return (
      <>
        <PageTitle txt="Имя не найдено" />
        <Link href={namesHubUrl} class="link link-primary">
          ← Все имена на китайском
        </Link>
      </>
    );
  }

  const { name, prev, next } = data.value;
  const [main, ...others] = name.variants;
  const warned = name.variants.filter((v) => v.warn?.length);
  const faq = nameFaq(name);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Имя на китайском', href: namesHubUrl }, { name: name.name }]} />
      <PageTitle txt={`${name.name} на китайском`} />

      <div class="card bg-base-100 border border-primary mb-6">
        <div class="card-body">
          <div class="text-sm opacity-70">
            {kindLabel(name)} · как пишется {name.name} по-китайски
          </div>
          <div class="flex flex-wrap items-baseline gap-x-4">
            <Link prefetch="js" href={dictionaryUrl(main.cn)} class="text-5xl link link-hover">
              {main.cn}
            </Link>
            <span class="text-2xl">{main.py}</span>
          </div>
          <p class="max-w-3xl">
            Перевод имени {name.name} на китайский — {main.cn}, читается «{main.py}». Это
            устоявшаяся транскрипция: так имя {name.name} записывают иероглифами в словарях и
            переводах.
          </p>
          {name.of && (
            <p>
              Полное имя:{' '}
              {name.of.map((o, ind) => (
                <span key={o.slug}>
                  {ind > 0 && ', '}
                  <Link prefetch="js" href={nameUrl(o.slug)} class="link link-primary">
                    {o.name}
                  </Link>
                </span>
              ))}
            </p>
          )}

          <h2 class="text-xl font-bold mt-4">Иероглифы и порядок черт</h2>
          <p class="text-sm opacity-70">
            Нажмите на иероглиф, чтобы повторить анимацию, или на сам знак, чтобы открыть словарь.
          </p>
          <div class="flex flex-wrap gap-3 mt-2">
            {(main.chars || []).map((char, ind) => (
              <NameCharCard key={ind} char={char} id={`name-char-${ind}`} />
            ))}
          </div>
        </div>
      </div>

      {warned.length > 0 && (
        <div role="alert" class="alert alert-warning mb-6">
          <span>
            В вариантах {warned.map((v) => v.cn).join(', ')} есть иероглифы с неприятным значением (
            {[...new Set(warned.flatMap((v) => v.warn || []))].join(', ')}). Лучше выбрать основной
            вариант.
          </span>
        </div>
      )}

      <div class="prose max-w-none">
        {others.length > 0 && (
          <>
            <h2>Другие варианты написания</h2>
            <ul>
              {others.map((v) => (
                <li key={v.cn}>
                  <Link prefetch="js" href={dictionaryUrl(v.cn)}>
                    {v.cn}
                  </Link>{' '}
                  — {v.py}
                </li>
              ))}
            </ul>
          </>
        )}

        {name.short.length > 0 && (
          <>
            <h2>Уменьшительные формы</h2>
            <ul>
              {name.short.map((s) => (
                <li key={s.name}>
                  <Link prefetch="js" href={nameUrl(s.slug)}>
                    <b>{s.name}</b> на китайском
                  </Link>{' '}
                  — {variantsText(s.variants, ' или ')}
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>Почему именно эти иероглифы</h2>
        <p>
          Русские имена в китайском передают по звучанию: для каждого слога берут иероглиф, который
          читается похоже. Поэтому значения отдельных иероглифов не складываются в смысл имени. Для
          транскрипции используют устоявшийся набор знаков, а в женских именах часто выбирают
          «красивые» иероглифы вроде 丽 (красивый), 娜 или 莉 (жасмин).
        </p>
        <p>
          Не стоит придумывать своё написание или доверять автоматическим генераторам: можно
          получить знак с неприятным значением. Если вы хотите сделать тату или печать с именем,
          используйте основной вариант {main.cn}.
        </p>

        <h2>Вопросы и ответы</h2>
        {faq.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </div>

      <div class="flex justify-between gap-4 mt-6">
        <div>
          {prev && (
            <Link href={nameUrl(prev.slug)} class="btn btn-outline btn-sm h-auto py-2">
              ← {prev.name} {prev.cn}
            </Link>
          )}
        </div>
        <Link href={namesHubUrl} class="btn btn-ghost btn-sm h-auto py-2">
          Все имена
        </Link>
        <div>
          {next && (
            <Link href={nameUrl(next.slug)} class="btn btn-outline btn-sm h-auto py-2">
              {next.name} {next.cn} →
            </Link>
          )}
        </div>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }}
      />
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useName);
  if (!data) {
    return {
      title: 'Имя не найдено | Chinese+',
      meta: [{ name: 'robots', content: 'noindex' }],
    };
  }

  const { name } = data;
  const main = name.variants[0];
  const extra =
    name.kind === 'short'
      ? ` Уменьшительное от ${fullNames(name)}.`
      : name.short.length
      ? ` Как будет ${name.short.map((s) => s.name).join(', ')} по-китайски.`
      : '';
  const title = `${name.name} на китайском — ${main.cn}: как пишется имя по-китайски | Chinese+`;
  const description = `Как пишется имя ${name.name} на китайском и как будет ${name.name} по-китайски: ${main.cn} (${main.py}). Перевод имени иероглифами, значение каждого знака и порядок черт.${extra}`;
  const url = `${CONST_URLS.siteUrl}${nameUrl(name.slug)}`;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${namesOgImage}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
