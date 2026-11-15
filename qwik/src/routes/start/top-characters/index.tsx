import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { CharactersLinkCard } from '~/components/common/content-cards/characters-link-card';
import { BannerAds } from '~/components/common/ads/sidebar-ads';
import { JsonLd } from '~/components/common/seo/json-ld';
import YANDEX_ADS from '~/misc/consts/ads';
import topChars from '~/misc/consts/top-chars';
import { configContext } from '~/root';

// Sections of the list: [first rank, last rank]; each gets an anchor (#top-100, #top-300…)
const SECTIONS: [number, number][] = [
  [1, 100],
  [101, 300],
  [301, 500],
  [501, 1000],
];

/** Share of a text the characters up to this rank cover: 41.77 -> '42%'. */
const coverageAt = (rank: number) => `${Math.round(topChars[rank - 1][4])}%`;

// Coverage beyond the exported top 1000, from the same Jun Da list (cumulative frequency at the rank)
const COVERAGE_BEYOND: [number, string][] = [
  [1500, '95%'],
  [2000, '97%'],
  [3000, '99%'],
];
const COVERAGE: [number, string][] = [
  ...[100, 500, 1000].map((rank): [number, string] => [rank, coverageAt(rank)]),
  ...COVERAGE_BEYOND,
];

// HSK 3.0 (2021 standard): cumulative characters to recognize and words, by level
const HSK3_LEVELS: [string, number, number][] = [
  ['1', 300, 500],
  ['2', 600, 1272],
  ['3', 900, 2245],
  ['4', 1200, 3245],
  ['5', 1500, 4316],
  ['6', 1800, 5456],
  ['7–9', 3000, 11092],
];

// Where each figure of the page comes from: [link label, url]
const SOURCES: { text: string; links: [string, string][] }[] = [
  {
    text: 'Частотность и покрытие текста (4-й столбец — накопленная частота в %), размер корпуса — 193 504 018 иероглифов (внизу страницы)',
    links: [
      [
        'Jun Da, Modern Chinese Character Frequency List',
        'https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO',
      ],
    ],
  },
  {
    text: 'Таблица общеупотребительных стандартных иероглифов: 8105 иероглифов, 3500 + 3000 + 1605',
    links: [
      [
        'постановление Госсовета КНР (2013)',
        'https://www.gov.cn/zwgk/2013-08/19/content_2469793.htm',
      ],
      ['Wikipedia', 'https://en.wikipedia.org/wiki/Table_of_General_Standard_Chinese_Characters'],
    ],
  },
  {
    text: 'Иероглифы и слова по уровням HSK 3.0',
    links: [['Wikipedia: HSK', 'https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi']],
  },
  {
    text: 'Число иероглифов в словарях',
    links: [
      ['Чжунхуа цзыхай', 'https://en.wikipedia.org/wiki/Zhonghua_Zihai'],
      ['Ханьюй да цзыдянь', 'https://en.wikipedia.org/wiki/Hanyu_Da_Zidian'],
      ['Канси цзыдянь', 'https://ru.wikipedia.org/wiki/Канси_цзыдянь'],
    ],
  },
];

const hskLabel = (level: string) => (level === '789' ? '7–9' : level);

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Сколько иероглифов в китайском языке?',
    a: 'Точного числа нет: в крупнейшем словаре «Чжунхуа цзыхай» (1994) — 85 568 знаков, но большинство из них устаревшие и редкие варианты. Официальная Таблица общеупотребительных стандартных иероглифов КНР (2013) содержит 8105 иероглифов, из них 3500 — самые употребительные.',
  },
  {
    q: 'Сколько иероглифов нужно знать, чтобы читать по-китайски?',
    a: `1000 самых частых иероглифов составляют ${coverageAt(
      1000,
    )} иероглифов любого текста, 2000 — 97%, 3000 — 99%. Для свободного чтения обычно называют 3000 иероглифов, но кроме самих иероглифов нужно знать и слова из них.`,
  },
  {
    q: 'Сколько иероглифов нужно для HSK?',
    a: 'По стандарту HSK 3.0 (2021): 300 иероглифов для 1 уровня, по 300 новых на каждом следующем — 1800 к 6 уровню, и 3000 для уровней 7–9.',
  },
  {
    q: 'Какие иероглифы учить первыми?',
    a: `Самые частые: всего 100 иероглифов из начала списка — это ${coverageAt(
      100,
    )} любого текста. Учите их по порядку и сразу вместе со словами, в которые они входят.`,
  },
];

export default component$(() => {
  const configState = useContext(configContext);
  const bannerAds = configState.find((x) => x.type === YANDEX_ADS.banner);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Основные иероглифы' }]} />
      <PageTitle txt={'Основные китайские иероглифы: 1000 самых частых'} />

      <FlexRow>
        <Sidebar noAds={true}>
          <div class="card bg-primary text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Как учить по списку</h2>
              <p>
                Идите по порядку: первые сотни иероглифов встречаются в каждом тексте. Нажмите на
                иероглиф, чтобы открыть его в словаре и выучить вместе со словами, в которые он
                входит.
              </p>
            </div>
          </div>
          <CharactersLinkCard />
        </Sidebar>

        <MainContent>
          <div class="prose">
            <p>
              <strong>
                Китайских иероглифов десятки тысяч, но в обычных текстах используется лишь малая их
                часть.
              </strong>{' '}
              Всего 100 самых частых иероглифов составляют {coverageAt(100)} почти любого текста,
              первая тысяча — {coverageAt(1000)}.
            </p>

            <h2>Сколько иероглифов в китайском языке</h2>
            <p>
              Точного числа нет: словари собирают иероглифы за всю историю письменности, вместе с
              устаревшими и вариантными написаниями. В крупнейшем словаре «Чжунхуа цзыхай»
              (中华字海, 1994) — 85 568 знаков, в «Большом словаре китайских иероглифов»
              (汉语大字典, 2-е изд., 2010) — 60 370, в словаре Канси (康熙字典, 1716) — около 47
              тысяч.
            </p>
            <p>
              Для современного языка в КНР есть официальная{' '}
              <strong>Таблица общеупотребительных стандартных иероглифов</strong> (通用规范汉字表),
              утверждённая Госсоветом в 2013 году. В ней <strong>8105 иероглифов</strong>: 3500 —
              часто употребительные, ещё 3000 — употребительные, но реже, и 1605 — иероглифы для
              имён, географических названий и терминов.
            </p>

            <h2>Сколько иероглифов нужно знать</h2>
            <p>
              Сколько иероглифов текста вы узнаете, если знаете самые частые (доля всех иероглифов в
              текстах корпуса):
            </p>
          </div>

          <div class="overflow-x-auto my-3">
            <table class="table table-compact w-auto text-base-content">
              <thead>
                <tr>
                  <th>Самых частых иероглифов</th>
                  {COVERAGE.map(([rank]) => (
                    <th key={rank}>{rank}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Доля в тексте</td>
                  {COVERAGE.map(([rank, share]) => (
                    <td key={rank}>{share}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div class="prose">
            <p>
              Это доля иероглифов, а не понятных слов: слова часто состоят из двух иероглифов, а
              значение слова не всегда складывается из значений его частей. Поэтому для свободного
              чтения обычно называют около 3000 иероглифов и знание слов из них.
            </p>
            <p>
              Ориентир для экзамена — стандарт{' '}
              <a class="link link-secondary" href="/hsk/3/table">
                HSK 3.0
              </a>{' '}
              (2021): сколько иероглифов и слов нужно знать к каждому уровню, нарастающим итогом.
            </p>
          </div>

          <div class="overflow-x-auto my-3">
            <table class="table table-compact w-auto text-base-content">
              <thead>
                <tr>
                  <th>Уровень HSK</th>
                  {HSK3_LEVELS.map(([level]) => (
                    <th key={level}>{level}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Иероглифов</td>
                  {HSK3_LEVELS.map(([level, chars]) => (
                    <td key={level}>{chars}</td>
                  ))}
                </tr>
                <tr>
                  <td>Слов</td>
                  {HSK3_LEVELS.map(([level, , words]) => (
                    <td key={level}>{words}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div class="prose">
            <h2>Список 1000 самых частых иероглифов</h2>
            <p>
              Список составлен по частотному словарю современного китайского языка Цзюнь Да (Jun
              Da), посчитанному на корпусе из 193 млн иероглифов. Для каждого иероглифа указаны
              пиньинь (основное чтение), краткий перевод и уровень HSK 3.0, на котором он впервые
              встречается в словах. В колонке «Покрытие» — какую долю текста дают все иероглифы до
              этой строки включительно. Нажмите на иероглиф, чтобы открыть его в словаре: другие
              чтения, значения, слова и примеры.
            </p>
          </div>

          <div class="flex flex-wrap gap-2 my-4">
            {SECTIONS.map(([from, to]) => (
              <a key={to} href={`#top-${to}`} class="btn btn-sm btn-outline">
                {from}–{to}
              </a>
            ))}
            <a href="#faq" class="btn btn-sm btn-outline">
              Вопросы и ответы
            </a>
          </div>

          {bannerAds?.isActive && <BannerAds />}

          {SECTIONS.map(([from, to]) => (
            <section key={to} id={`top-${to}`} class="scroll-mt-20">
              <h3 class="text-xl font-bold mt-8 mb-3">
                Иероглифы {from}–{to}{' '}
                <span class="text-base font-normal opacity-70">
                  (вместе с предыдущими — {coverageAt(to)} текста)
                </span>
              </h3>
              <div class="overflow-x-auto">
                <table class="table table-compact table-zebra w-full text-base-content">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Иероглиф</th>
                      <th>Пиньинь</th>
                      <th>Перевод</th>
                      <th>HSK</th>
                      <th>Покрытие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topChars.slice(from - 1, to).map(([cn, py, gloss, hsk, cumulative], i) => (
                      <tr key={cn}>
                        <td>{from + i}</td>
                        <td>
                          <a
                            class="text-2xl link link-hover"
                            href={`/dictionary/${encodeURIComponent(cn)}`}
                          >
                            {cn}
                          </a>
                        </td>
                        <td>{py}</td>
                        <td class="whitespace-normal">{gloss}</td>
                        <td>{hskLabel(hsk)}</td>
                        <td>{cumulative.toFixed(1).replace('.', ',')}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <div id="faq" class="prose mt-8 scroll-mt-20">
            <h2>Вопросы и ответы</h2>
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}

            <h2>Источники</h2>
            <ul class="text-sm">
              {SOURCES.map(({ text, links }) => (
                <li key={text}>
                  {text}:{' '}
                  {links.map(([label, href], i) => (
                    <span key={href}>
                      {i > 0 && ', '}
                      <a class="link" href={href} target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
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
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Основные китайские иероглифы: 1000 самых частых и сколько нужно знать | Chinese+',
  meta: [
    {
      name: 'description',
      content:
        'Сколько иероглифов в китайском языке и сколько нужно знать: 8105 в официальной таблице, 3000 для HSK 7–9. Список 1000 самых частых иероглифов с пиньинем, переводом и уровнем HSK.',
    },
  ],
};
