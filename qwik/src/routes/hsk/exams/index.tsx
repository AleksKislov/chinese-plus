import { component$, useContext } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation, Link } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { userContext } from '~/root';
import { type HskExamListItem, SECTION_TITLES_RU } from '~/components/hsk/exams/types';
import { useSetExamApproved } from '~/misc/actions/hsk-exams/set-approved';

const NEW_HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '7'];
const OLD_HSK_LEVELS = ['1', '2', '3', '4', '5', '6'];

export const useGetExams = routeLoader$(async (ev): Promise<HskExamListItem[]> => {
  // No version in the URL means "show everything published" - defaulting to
  // one version here would silently hide exams of the other the moment they're
  // imported, with no visible error to explain the empty list.
  const version = ev.query.get('version') || '';
  const lvl = ev.query.get('lvl') || '';
  const versionParam = version ? `version=${version}` : '';
  const lvlParam = lvl ? `lvl=${lvl}` : '';
  const qs = [versionParam, lvlParam].filter(Boolean).join('&');
  // Sent whether or not the visitor is an admin - the backend decides what
  // that token is worth (optional-admin-auth.js never blocks a bad/missing one).
  const token = getTokenFromCookie(ev.cookie);
  return ApiService.get(`/api/hsk-exams${qs ? `?${qs}` : ''}`, token, []);
});

export default component$(() => {
  const exams = useGetExams();
  const setApproved = useSetExamApproved();
  const { isAdmin } = useContext(userContext);
  const loc = useLocation();
  const version = loc.url.searchParams.get('version') || '';
  const lvl = loc.url.searchParams.get('lvl') || '';
  // Before a version tab is picked there's no single level list to show -
  // fall back to the newer standard's numbering for the level-filter row.
  const levels = version === 'old' ? OLD_HSK_LEVELS : NEW_HSK_LEVELS;

  const buildHref = (nextVersion: string, nextLvl: string) =>
    `/hsk/exams/${nextVersion || nextLvl ? '?' : ''}${[
      nextVersion ? `version=${nextVersion}` : '',
      nextLvl ? `lvl=${nextLvl}` : '',
    ]
      .filter(Boolean)
      .join('&')}`;

  return (
    <>
      <PageTitle txt={'Пробные экзамены HSK'} />
      <FlexRow>
        <MainContent>
          <div class="prose mb-4">
            <p>
              Полноформатные пробные экзамены с аудированием, чтением и письмом. Ответы можно
              проверить сразу — с пояснениями и текстами аудио.
            </p>
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <Link
              href={'/hsk/exams/'}
              class={`btn btn-sm ${!version ? 'btn-primary' : 'btn-outline'}`}
            >
              Все версии
            </Link>
            {[
              { key: 'new', title: 'HSK 3.0' },
              { key: 'old', title: 'HSK 2.0' },
            ].map(({ key, title }) => (
              <Link
                key={key}
                href={buildHref(key, '')}
                class={`btn btn-sm ${version === key ? 'btn-primary' : 'btn-outline'}`}
              >
                {title}
              </Link>
            ))}
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <Link
              href={buildHref(version, '')}
              class={`btn btn-xs ${!lvl ? 'btn-secondary' : 'btn-outline'}`}
            >
              Все уровни
            </Link>
            {levels.map((l) => (
              <Link
                key={l}
                href={buildHref(version, l)}
                class={`btn btn-xs ${lvl === l ? 'btn-secondary' : 'btn-outline'}`}
              >
                {l}
              </Link>
            ))}
          </div>

          {!exams.value.length ? (
            <div class="alert">
              <span>Пока нет опубликованных экзаменов для этого уровня.</span>
            </div>
          ) : (
            <div class="grid gap-3 sm:grid-cols-2">
              {exams.value.map((exam) => (
                <div
                  key={exam.slug}
                  class={`card bg-base-100 border transition-colors ${
                    !exam.isApproved ? 'border-warning' : 'border-base-300 hover:border-primary'
                  }`}
                >
                  <Link href={`/hsk/exams/${exam.slug}/`} class="card-body p-4">
                    <h3 class="card-title text-base">
                      {exam.title.ru || exam.title.cn || exam.slug}
                    </h3>
                    {exam.title.cn && exam.title.ru && (
                      <p class="text-sm opacity-70">{exam.title.cn}</p>
                    )}
                    {exam.descriptionRu && <p class="text-sm opacity-80">{exam.descriptionRu}</p>}
                    <div class="flex flex-wrap gap-1 mt-2">
                      <span class="badge badge-primary badge-sm">
                        {exam.version === 'new' ? 'HSK 3.0' : 'HSK 2.0'} · {exam.level}
                      </span>
                      <span class="badge badge-ghost badge-sm">{exam.questionsNum} заданий</span>
                      {exam.durationMinutes && (
                        <span class="badge badge-ghost badge-sm">{exam.durationMinutes} мин</span>
                      )}
                      {exam.sectionTypes.map((t) => (
                        <span key={t} class="badge badge-outline badge-sm">
                          {SECTION_TITLES_RU[t]}
                        </span>
                      ))}
                      {isAdmin && (
                        <span
                          class={`badge badge-sm ${
                            exam.isApproved ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {exam.isApproved ? 'одобрен' : 'не одобрен'}
                        </span>
                      )}
                    </div>
                  </Link>
                  {isAdmin && (
                    <div class="px-4 pb-4">
                      <button
                        type="button"
                        class="btn btn-xs btn-outline w-full"
                        onClick$={async () => {
                          await setApproved.submit({
                            slug: exam.slug,
                            isApproved: !exam.isApproved,
                          });
                          window.location.reload();
                        }}
                      >
                        {exam.isApproved ? 'Снять с публикации' : 'Одобрить'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = () => {
  const title = 'Chinese+ Пробные экзамены HSK';
  const description =
    'Полноформатные пробные экзамены HSK: аудирование, чтение и письмо с проверкой ответов и пояснениями.';
  const url = `${CONST_URLS.siteUrl}/hsk/exams/`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: CONST_URLS.defaultTextPic },
    ],
  };
};
