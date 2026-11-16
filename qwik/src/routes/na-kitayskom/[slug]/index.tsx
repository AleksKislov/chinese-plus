import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { NameCharCard } from '~/components/names/name-char-card';
import { dictionaryUrl, nameUrl } from '~/components/names/types';
import { sheetUrl } from '~/components/propisi/types';
import { HskLevelBadge } from '~/components/hsk/hsk-level-badge';
import { wordLevelLabel } from '~/components/hsk/words-seo';
import { AudioBtn } from '~/components/ru-words/audio-btn';
import {
  type RuTopicPage,
  type RuWordPage,
  type RuWordResponse,
  capitalize,
  ruWordUrl,
  ruWordsHubUrl,
} from '~/components/ru-words/types';

export const useRuWord = routeLoader$(
  async ({ params, status }): Promise<RuWordResponse | null> => {
    const res = await ApiService.get(`/api/ru-words/${params.slug}`, undefined, null);
    if (!res?.type) {
      status(404);
      return null;
    }
    return res;
  },
);

const HUB_CRUMB = { name: 'Слова на китайском', href: ruWordsHubUrl };

const wordFaq = ({ word, chars }: RuWordPage) => {
  const faq = [
    {
      q: `Как будет «${word.ru}» по-китайски?`,
      a: `«${capitalize(word.ru)}» по-китайски — ${word.cn}, на пиньине ${word.py}.${
        word.alt.length
          ? ` Также говорят: ${word.alt.map((a) => `${a.cn} (${a.py}) — ${a.ru}`).join('; ')}.`
          : ''
      }`,
    },
    {
      q: `Как пишется «${word.ru}» на китайском иероглифами?`,
      a:
        chars.length > 1
          ? `«${capitalize(word.ru)}» пишется ${chars.length} иероглифами: ${chars
              .map((c) => `${c.ch} (${c.py}${c.meaning ? ` — ${c.meaning}` : ''})`)
              .join(', ')}.`
          : `«${capitalize(word.ru)}» пишется одним иероглифом ${word.cn} (${word.py}).`,
    },
    {
      q: `Как произносится ${word.cn}?`,
      a: `${word.cn} читается «${
        word.py
      }». Значки над гласными в пиньине — тоны: ā — ровный высокий, á — восходящий, ǎ — нисходяще-восходящий, à — резко нисходящий, без значка — нейтральный.${
        word.hsk
          ? ` Слово входит в список HSK 3.0, уровень ${wordLevelLabel(
              word.hsk,
            )}, — послушайте запись на странице.`
          : ''
      }`,
    },
  ];
  if (word.note) faq.push({ q: `Что нужно знать о слове ${word.cn}?`, a: word.note });
  return faq;
};

const FaqJsonLd = ({ faq }: { faq: { q: string; a: string }[] }) => (
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
);

const WordView = component$(({ data }: { data: RuWordPage }) => {
  const { word, chars, examples, topic, related, prev, next, nameSlug } = data;
  const Ru = capitalize(word.ru);
  const faq = wordFaq(data);

  return (
    <>
      <Breadcrumbs
        items={[HUB_CRUMB, { name: topic.title, href: ruWordUrl(topic.slug) }, { name: Ru }]}
      />
      <PageTitle txt={`${Ru} на китайском`} />

      <div class="card bg-base-100 border border-primary mb-6">
        <div class="card-body">
          <div class="text-sm opacity-70">как будет {word.ru} по-китайски</div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link prefetch="js" href={dictionaryUrl(word.cn)} class="text-5xl link link-hover">
              {word.cn}
            </Link>
            <span class="text-2xl">{word.py}</span>
            <AudioBtn audio={word.audio} label={`Произношение ${word.cn}`} size="md" />
            {word.hsk && <HskLevelBadge level={word.hsk} />}
          </div>
          <p class="max-w-3xl">
            {Ru} по-китайски — {word.cn}, читается «{word.py}».
            {word.meaning && <> Значение в словаре: {word.meaning}.</>}
          </p>
          {word.also.length > 0 && (
            <p class="text-sm opacity-80">Так же переводится: {word.also.join(', ')}.</p>
          )}
          {word.note && <p class="max-w-3xl">{word.note}</p>}

          <h2 class="text-xl font-bold mt-4">Иероглифы и порядок черт</h2>
          <p class="text-sm opacity-70">
            Нажмите на иероглиф, чтобы повторить анимацию, или на сам знак, чтобы открыть словарь.
          </p>
          <div class="flex flex-wrap gap-3 mt-2">
            {chars.map((char, ind) => (
              <NameCharCard key={ind} char={char} id={`word-char-${ind}`} />
            ))}
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <Link
              prefetch="js"
              href={sheetUrl({ kind: 'chars', chars: word.cn })}
              class="btn btn-outline btn-primary btn-sm"
            >
              Пропись для {word.cn} →
            </Link>
            <Link prefetch="js" href={dictionaryUrl(word.cn)} class="btn btn-outline btn-sm">
              {word.cn} в словаре →
            </Link>
          </div>
        </div>
      </div>

      <div class="prose max-w-none">
        {word.alt.length > 0 && (
          <>
            <h2>Как ещё сказать «{word.ru}» по-китайски</h2>
            <ul>
              {word.alt.map((a) => (
                <li key={a.cn}>
                  <Link prefetch="js" href={dictionaryUrl(a.cn)}>
                    {a.cn}
                  </Link>{' '}
                  ({a.py}) — {a.ru}{' '}
                  <span class="not-prose inline-block align-middle">
                    <AudioBtn audio={a.audio} label={`Произношение ${a.cn}`} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {examples.length > 0 && (
          <>
            <h2>Примеры со словом {word.cn}</h2>
            <ul>
              {examples.map((e) => (
                <li key={e.zh}>
                  <span class="text-lg">{e.zh}</span>
                  {e.pinyin && <span class="opacity-70"> {e.pinyin}</span>} — {e.translation}
                </li>
              ))}
            </ul>
          </>
        )}

        {nameSlug && (
          <p>
            {Ru} — это ещё и имя:{' '}
            <Link prefetch="js" href={nameUrl(nameSlug)}>
              как пишется имя {Ru} по-китайски
            </Link>
            .
          </p>
        )}

        <h2>Вопросы и ответы</h2>
        {faq.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}

        <h2>
          <Link href={ruWordUrl(topic.slug)}>{topic.title}</Link>
        </h2>
      </div>
      <ul class="flex flex-wrap gap-2 list-none p-0 mt-2">
        {related.map((w) => (
          <li key={w.slug}>
            <Link
              prefetch="js"
              href={ruWordUrl(w.slug)}
              class="btn btn-sm btn-ghost border-base-300"
            >
              {w.ru} {w.cn}
            </Link>
          </li>
        ))}
      </ul>

      <div class="flex justify-between gap-4 mt-6">
        <div>
          {prev && (
            <Link href={ruWordUrl(prev.slug)} class="btn btn-outline btn-sm h-auto py-2">
              ← {prev.ru} {prev.cn}
            </Link>
          )}
        </div>
        <Link href={ruWordsHubUrl} class="btn btn-ghost btn-sm h-auto py-2">
          Все слова
        </Link>
        <div>
          {next && (
            <Link href={ruWordUrl(next.slug)} class="btn btn-outline btn-sm h-auto py-2">
              {next.ru} {next.cn} →
            </Link>
          )}
        </div>
      </div>

      <FaqJsonLd faq={faq} />
    </>
  );
});

const MAX_SHEET_CHARS = 30;
// the topic's characters, each once: 星期一, 星期二 -> 星期一二
const sheetChars = (cn: string[]) => [...new Set(cn.join(''))].slice(0, MAX_SHEET_CHARS).join('');

const TopicView = component$(({ data }: { data: RuTopicPage }) => {
  const { topic, words, topics } = data;

  return (
    <>
      <Breadcrumbs items={[HUB_CRUMB, { name: topic.title }]} />
      <PageTitle txt={topic.title} />
      <p class="mb-4 max-w-3xl">{topic.intro}</p>

      <div class="overflow-x-auto mb-6">
        <table class="table">
          <thead>
            <tr>
              <th>По-русски</th>
              <th>По-китайски</th>
              <th>Пиньинь</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.slug}>
                <td>
                  <Link prefetch="js" href={ruWordUrl(w.slug)} class="link link-hover font-bold">
                    {w.ru}
                  </Link>
                </td>
                <td class="text-2xl">
                  <Link prefetch="js" href={ruWordUrl(w.slug)} class="link link-hover">
                    {w.cn}
                  </Link>
                </td>
                <td>{w.py}</td>
                <td>
                  <AudioBtn audio={w.audio} label={`Произношение ${w.cn}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p class="mb-6">
        Нажмите на слово, чтобы увидеть порядок черт, значение каждого иероглифа и примеры.{' '}
        <Link
          prefetch="js"
          href={sheetUrl({ kind: 'chars', chars: sheetChars(words.map((w) => w.cn)) })}
          class="link link-primary"
        >
          Распечатать пропись
        </Link>
        .
      </p>

      <h2 class="text-xl font-bold mb-2">Другие темы</h2>
      <ul class="flex flex-wrap gap-2 list-none p-0">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link prefetch="js" href={ruWordUrl(t.slug)} class="btn btn-sm btn-outline">
              {t.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
});

export default component$(() => {
  const data = useRuWord();

  if (!data.value) {
    return (
      <>
        <PageTitle txt="Слово не найдено" />
        <Link href={ruWordsHubUrl} class="link link-primary">
          ← Все слова на китайском
        </Link>
      </>
    );
  }

  return data.value.type === 'word' ? (
    <WordView data={data.value} />
  ) : (
    <TopicView data={data.value} />
  );
});

const PREVIEW_WORDS = 4;

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useRuWord);
  if (!data) {
    return {
      title: 'Слово не найдено | Chinese+',
      meta: [{ name: 'robots', content: 'noindex' }],
    };
  }

  let title: string;
  let description: string;
  let slug: string;

  if (data.type === 'word') {
    const { word } = data;
    const Ru = capitalize(word.ru);
    slug = word.slug;
    title = `${Ru} на китайском — ${word.cn} (${word.py}): как пишется и произносится | Chinese+`;
    description = `Как будет ${word.ru} по-китайски: ${word.cn} (${
      word.py
    }). Иероглифы и порядок черт, произношение${
      word.audio ? ' с аудио' : ''
    }, примеры предложений.${
      word.alt.length
        ? ` Другие варианты: ${word.alt.map((a) => `${a.cn} — ${a.ru}`).join(', ')}.`
        : ''
    }`;
  } else {
    const { topic, words } = data;
    const preview = words
      .slice(0, PREVIEW_WORDS)
      .map((w) => w.cn)
      .join(', ');
    slug = topic.slug;
    title = `${topic.title} — ${preview}…: как пишутся и произносятся | Chinese+`;
    description = `${topic.title}: ${words
      .slice(0, 8)
      .map((w) => `${w.ru} — ${w.cn}`)
      .join(', ')} и другие. Пиньинь, произношение и порядок черт.`;
  }

  const url = `${CONST_URLS.siteUrl}${ruWordUrl(slug)}`;
  return {
    title,
    meta: [
      { name: 'description', content: description.slice(0, 300) },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description.slice(0, 300) },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
