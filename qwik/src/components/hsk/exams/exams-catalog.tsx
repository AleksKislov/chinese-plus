import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHeadValue, type RequestEventLoader } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs, type Crumb } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import CONST_URLS from '~/misc/consts/urls';
import { ExamCard } from './exam-card';
import { type HskExamListItem, SECTION_TITLES_RU } from './types';
import {
  type HskVersion,
  HSK_LEVELS,
  NEW_LEVEL_WORDS,
  OLD_LEVEL_FORMAT,
  VERSION_NAME,
  examsPath,
  levelLabel,
  levelName,
  levelWords,
  ogImagePath,
  pluralRu,
  wordTestsPath,
  wordsPath,
} from './levels';

export type ExamsCatalogData = {
  version: HskVersion | '';
  lvl: string;
  notFound: boolean;
  // Exams shown on this page (already narrowed to its version/level).
  exams: HskExamListItem[];
  // Published exams per "{version}-{level}", for the level buttons.
  counts: Record<string, number>;
};

const HUB_TITLE = 'Пробные экзамены HSK';
const VERSIONS: HskVersion[] = ['old', 'new'];

/** Shared by the hub, /hsk/exams/{2|3}/ and /hsk/exams/{2|3}/{lvl}/ route loaders. */
export const loadExamsCatalog = async (
  ev: RequestEventLoader,
  version: HskVersion | '',
  lvl = '',
): Promise<ExamsCatalogData> => {
  if (version && lvl && !HSK_LEVELS[version].includes(lvl)) {
    ev.status(404);
    return { version, lvl, notFound: true, exams: [], counts: {} };
  }

  // Sent whether or not the visitor is an admin - the backend decides what
  // that token is worth (optional-admin-auth.js never blocks a bad/missing one).
  const token = getTokenFromCookie(ev.cookie);
  // One request for every page: the list is small, and the level buttons need
  // counts across all levels anyway.
  const all: HskExamListItem[] = await ApiService.get('/api/hsk-exams', token, []);

  const counts: Record<string, number> = {};
  for (const e of all)
    counts[`${e.version}-${e.level}`] = (counts[`${e.version}-${e.level}`] || 0) + 1;

  return {
    version,
    lvl,
    notFound: false,
    exams: all.filter((e) => (!version || e.version === version) && (!lvl || e.level === lvl)),
    counts,
  };
};

const sectionsText = (sections: string[]) =>
  sections
    .map((s) => SECTION_TITLES_RU[s as keyof typeof SECTION_TITLES_RU].toLowerCase())
    .join(', ');

const pageTexts = ({ version, lvl, exams }: ExamsCatalogData) => {
  if (!version) {
    return {
      h1: 'Пробные экзамены HSK онлайн',
      title: 'Пробные экзамены HSK онлайн бесплатно — все уровни | Chinese+',
      description:
        'Бесплатные пробные тесты HSK онлайн для всех уровней HSK 2.0 и HSK 3.0: аудирование, чтение и письмо, мгновенная проверка ответов с пояснениями и текстами аудио.',
    };
  }

  if (!lvl) {
    return version === 'old'
      ? {
          h1: 'Пробные экзамены HSK 2.0 — уровни 1–6',
          title: 'Пробные экзамены HSK 2.0 онлайн — HSK 1–6 с ответами | Chinese+',
          description:
            'Бесплатные пробные экзамены HSK 1–6 (стандарт HSK 2.0) онлайн, в том числе официальные варианты: аудирование, чтение и письмо с проверкой ответов и пояснениями.',
        }
      : {
          h1: 'Пробные экзамены HSK 3.0 — новый стандарт',
          title: 'Пробные экзамены HSK 3.0 онлайн — новый стандарт, уровни 1–9 | Chinese+',
          description:
            'Бесплатные пробные экзамены по новому стандарту HSK 3.0 онлайн: аудирование и чтение с мгновенной проверкой ответов, пояснениями и текстами аудио.',
        };
  }

  const name = levelName(version, lvl);
  const n = exams.length;
  const variants = n
    ? ` — ${n} ${pluralRu(n, ['вариант', 'варианта', 'вариантов'])} с ответами`
    : '';
  const format = version === 'old' ? OLD_LEVEL_FORMAT[lvl] : undefined;

  return {
    h1: `Пробный экзамен ${name} онлайн`,
    title: `Пробный экзамен ${name} онлайн${variants} | Chinese+`,
    description: format
      ? `Бесплатные пробные экзамены HSK ${lvl} онлайн: ${format.questions} заданий, около ${
          format.durationMinutes
        } минут, ${sectionsText(
          format.sections,
        )}. Мгновенная проверка ответов с пояснениями и текстами аудио.`
      : `Бесплатный пробный экзамен HSK ${levelLabel(
          version,
          lvl,
        )} по новому стандарту HSK 3.0 онлайн: проверка ответов с пояснениями и текстами аудио.`,
  };
};

export const examsCatalogHead = (data: ExamsCatalogData): DocumentHeadValue => {
  if (data.notFound) {
    return {
      title: 'Страница не найдена | Chinese+',
      meta: [{ name: 'robots', content: 'noindex' }],
    };
  }

  const { title, description } = pageTexts(data);
  const url = `${CONST_URLS.siteUrl}${examsPath(data.version, data.lvl)}`;
  const image = `${CONST_URLS.siteUrl}${ogImagePath(data.version, data.lvl)}`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      // A level with nothing published yet is a thin page - keep it out of the
      // index (it's also left out of the sitemap) until an exam lands on it.
      ...(data.lvl && !data.exams.length ? [{ name: 'robots', content: 'noindex, follow' }] : []),
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  };
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Пробные экзамены HSK на сайте бесплатные?',
    a: 'Да. Все пробные экзамены открыты бесплатно и без регистрации — достаточно открыть вариант и начать отвечать.',
  },
  {
    q: 'Как проходит пробный экзамен?',
    a: 'Как настоящий: аудирование звучит одной записью со всеми инструкциями и паузами, вы отвечаете по ходу, затем переходите к чтению и письму. Кнопка «Проверить экзамен» показывает результат, правильные ответы, пояснения и тексты аудио.',
  },
  {
    q: 'Чем HSK 2.0 отличается от HSK 3.0?',
    a: 'HSK 2.0 — привычный экзамен из шести уровней с лексикой от 150 до 5000 слов. HSK 3.0 — новый стандарт из девяти уровней: лексика — от 300 до 10 960 слов, а уровни 7–9 сдаются одним экзаменом.',
  },
  {
    q: 'Сколько баллов нужно, чтобы сдать HSK?',
    a: 'На HSK 1 и HSK 2 максимум — 200 баллов, проходной — 120. На HSK 3–6 максимум — 300 баллов, проходной — 180.',
  },
  {
    q: 'Сколько длится экзамен HSK?',
    a: 'В стандарте HSK 2.0 — от 40 минут на HSK 1 до 140 минут на HSK 6. Точная длительность и число заданий указаны на странице каждого уровня.',
  },
  {
    q: 'Засчитывается ли пробный экзамен как официальный?',
    a: 'Нет, это тренировка: результат нигде не регистрируется и сертификат не выдаётся. Зато формат, типы заданий и время совпадают с настоящим экзаменом.',
  },
];

const LevelButtons = component$(({ data }: { data: ExamsCatalogData }) => {
  const version = data.version as HskVersion;
  return (
    <div class="flex flex-wrap gap-2 mb-6">
      <Link
        href={examsPath(version)}
        class={`btn btn-xs ${!data.lvl ? 'btn-secondary' : 'btn-outline'}`}
      >
        Все уровни
      </Link>
      {HSK_LEVELS[version].map((l) => {
        const count = data.counts[`${version}-${l}`] || 0;
        return (
          <Link
            key={l}
            href={examsPath(version, l)}
            class={`btn btn-xs ${
              data.lvl === l ? 'btn-secondary' : count ? 'btn-outline' : 'btn-ghost opacity-60'
            }`}
          >
            HSK {levelLabel(version, l)}
            {!!count && <span class="opacity-70">({count})</span>}
          </Link>
        );
      })}
    </div>
  );
});

const ExamsGrid = component$(({ exams }: { exams: HskExamListItem[] }) => (
  <div class="grid gap-3 sm:grid-cols-2 mb-6">
    {exams.map((exam) => (
      <ExamCard key={exam.slug} exam={exam} />
    ))}
  </div>
));

// Hub and version pages: one block per level, headed by a link to that level's page.
const GroupedExams = component$(({ data }: { data: ExamsCatalogData }) => (
  <>
    {(data.version ? [data.version] : VERSIONS).flatMap((v) =>
      HSK_LEVELS[v].map((l) => {
        const exams = data.exams.filter((e) => e.version === v && e.level === l);
        if (!exams.length) return null;
        return (
          <div key={`${v}-${l}`}>
            <div class="prose mb-2">
              <h2 class="mb-0">
                <Link href={examsPath(v, l)} class="link link-hover">
                  Пробные экзамены {levelName(v, l)}
                </Link>
              </h2>
            </div>
            <ExamsGrid exams={exams} />
          </div>
        );
      }),
    )}
  </>
));

const OldFormatTable = component$(() => (
  <div class="overflow-x-auto mb-6">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Уровень</th>
          <th>Слов</th>
          <th>Заданий</th>
          <th>Время</th>
          <th>Проходной балл</th>
        </tr>
      </thead>
      <tbody>
        {HSK_LEVELS.old.map((l) => {
          const f = OLD_LEVEL_FORMAT[l];
          return (
            <tr key={l}>
              <td>
                <Link href={examsPath('old', l)} class="link link-hover">
                  HSK {l}
                </Link>
              </td>
              <td>{f.words}</td>
              <td>{f.questions}</td>
              <td>~{f.durationMinutes} мин</td>
              <td>
                {f.passScore} из {f.maxScore}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
));

const NewWordsTable = component$(() => (
  <div class="overflow-x-auto mb-6">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Уровень</th>
          <th>Слов (всего к уровню)</th>
        </tr>
      </thead>
      <tbody>
        {HSK_LEVELS.new.map((l) => (
          <tr key={l}>
            <td>
              <Link href={examsPath('new', l)} class="link link-hover">
                HSK {levelLabel('new', l)}
              </Link>
            </td>
            <td>{NEW_LEVEL_WORDS[l]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

const LevelFormat = component$(({ data }: { data: ExamsCatalogData }) => {
  const version = data.version as HskVersion;
  const lvl = data.lvl;
  const label = levelLabel(version, lvl);
  const format = version === 'old' ? OLD_LEVEL_FORMAT[lvl] : undefined;
  // HSK 3.0 papers are still being rolled out - describe the format from the
  // published practice paper rather than state official numbers we can't back.
  const sample = data.exams[0];

  return (
    <div class="prose max-w-none mb-6">
      <h2>Формат экзамена HSK {label}</h2>
      <ul>
        <li>
          Лексика: <b>{levelWords(version, lvl)}</b> слов
          {version === 'new' && ' (с учётом предыдущих уровней)'} —{' '}
          <Link href={wordsPath(version, lvl)}>список слов HSK {label}</Link>
        </li>
        {format ? (
          <>
            <li>
              Заданий: <b>{format.questions}</b>, время — около{' '}
              <b>{format.durationMinutes} минут</b>
            </li>
            <li>Разделы: {sectionsText(format.sections)}</li>
            <li>
              Проходной балл: <b>{format.passScore}</b> из {format.maxScore}
            </li>
          </>
        ) : (
          sample && (
            <>
              <li>
                Заданий в пробном варианте: <b>{sample.questionsNum}</b>
                {sample.durationMinutes && (
                  <>
                    , время — около <b>{sample.durationMinutes} минут</b>
                  </>
                )}
              </li>
              <li>Разделы: {sectionsText(sample.sectionTypes)}</li>
            </>
          )
        )}
      </ul>
      <p>
        Перед экзаменом повторите слова в{' '}
        <Link href={wordTestsPath(version, lvl)}>тестах на лексику HSK {label}</Link>.
      </p>
    </div>
  );
});

export const ExamsCatalog = component$(({ data }: { data: ExamsCatalogData }) => {
  const { version, lvl } = data;

  if (data.notFound) {
    return (
      <>
        <PageTitle txt={'Страница не найдена'} />
        <div class="prose">
          <p>
            Такого уровня нет. Все экзамены — на странице{' '}
            <Link href={examsPath()}>пробных экзаменов HSK</Link>.
          </p>
        </div>
      </>
    );
  }

  const crumbs: Crumb[] = !version
    ? [{ name: HUB_TITLE }]
    : !lvl
    ? [{ name: HUB_TITLE, href: examsPath() }, { name: VERSION_NAME[version] }]
    : [
        { name: HUB_TITLE, href: examsPath() },
        { name: VERSION_NAME[version], href: examsPath(version) },
        { name: `HSK ${levelLabel(version, lvl)}` },
      ];

  const { h1 } = pageTexts(data);
  const format = version === 'old' && lvl ? OLD_LEVEL_FORMAT[lvl] : undefined;

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <PageTitle txt={h1} />
      <FlexRow>
        <MainContent>
          <div class="prose max-w-none mb-4">
            {!version && (
              <p>
                Бесплатные пробные экзамены HSK онлайн в формате настоящего экзамена: аудирование,
                чтение и письмо. Аудирование звучит одной записью, как на экзамене, а после проверки
                видны правильные ответы, пояснения и тексты аудио. Регистрация не нужна.
              </p>
            )}
            {version === 'old' && !lvl && (
              <p>
                HSK 2.0 — привычный стандарт экзамена из шести уровней. Здесь собраны пробные
                варианты для уровней 1–6, в том числе официальные, с проверкой ответов и
                пояснениями.
              </p>
            )}
            {version === 'new' && !lvl && (
              <p>
                HSK 3.0 — новый стандарт из девяти уровней: лексика выросла до 10 960 слов, а уровни
                7–9 сдаются одним экзаменом. Здесь — пробные экзамены по новому формату.
              </p>
            )}
            {lvl && format && (
              <p>
                Пробные экзамены HSK {lvl} онлайн с мгновенной проверкой ответов. Для уровня HSK{' '}
                {lvl} нужно знать {format.words} слов; экзамен длится около {format.durationMinutes}{' '}
                минут и включает {sectionsText(format.sections)}.
              </p>
            )}
            {lvl && version === 'new' && (
              <p>
                Пробные экзамены уровня {levelLabel(version, lvl)} по новому стандарту HSK 3.0 с
                мгновенной проверкой ответов. Для этого уровня нужно знать {NEW_LEVEL_WORDS[lvl]}{' '}
                слов.
              </p>
            )}
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <Link
              href={examsPath()}
              class={`btn btn-sm ${!version ? 'btn-primary' : 'btn-outline'}`}
            >
              Все версии
            </Link>
            {VERSIONS.map((v) => (
              <Link
                key={v}
                href={examsPath(v)}
                class={`btn btn-sm ${version === v ? 'btn-primary' : 'btn-outline'}`}
              >
                {VERSION_NAME[v]}
              </Link>
            ))}
          </div>

          {version && <LevelButtons data={data} />}

          {!data.exams.length ? (
            <div class="alert mb-6">
              <span>
                Пока нет опубликованных экзаменов для этого уровня — загляните позже или выберите
                другой уровень.
              </span>
            </div>
          ) : lvl ? (
            <ExamsGrid exams={data.exams} />
          ) : (
            <GroupedExams data={data} />
          )}

          {lvl && <LevelFormat data={data} />}

          {version && !lvl && (
            <div class="prose max-w-none mb-2">
              <h2>
                {version === 'old'
                  ? 'Формат экзамена HSK 2.0 по уровням'
                  : 'Лексика HSK 3.0 по уровням'}
              </h2>
            </div>
          )}
          {version === 'old' && !lvl && <OldFormatTable />}
          {version === 'new' && !lvl && <NewWordsTable />}

          {!version && (
            <>
              <div class="prose max-w-none mb-2">
                <h2>Частые вопросы</h2>
              </div>
              <div class="join join-vertical w-full mb-6">
                {FAQ.map(({ q, a }, ind) => (
                  <div key={ind} class="collapse collapse-arrow join-item border border-base-300">
                    <input type="checkbox" aria-label={q} />
                    <h3 class="collapse-title font-semibold text-base">{q}</h3>
                    <div class="collapse-content">
                      <p>{a}</p>
                    </div>
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
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});
