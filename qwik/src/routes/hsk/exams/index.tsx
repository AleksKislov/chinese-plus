import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation, Link } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { ApiService } from '~/misc/actions/request';
import { type HskExamListItem, SECTION_TITLES_RU } from '~/components/hsk/exams/types';

const NEW_HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '7'];
const OLD_HSK_LEVELS = ['1', '2', '3', '4', '5', '6'];

export const useGetExams = routeLoader$(async (ev): Promise<HskExamListItem[]> => {
  const version = ev.query.get('version') || 'new';
  const lvl = ev.query.get('lvl') || '';
  const lvlParam = lvl ? `&lvl=${lvl}` : '';
  return ApiService.get(`/api/hsk-exams?version=${version}${lvlParam}`, undefined, []);
});

export default component$(() => {
  const exams = useGetExams();
  const loc = useLocation();
  const version = loc.url.searchParams.get('version') || 'new';
  const lvl = loc.url.searchParams.get('lvl') || '';
  const levels = version === 'old' ? OLD_HSK_LEVELS : NEW_HSK_LEVELS;

  const buildHref = (nextVersion: string, nextLvl: string) =>
    `/hsk/exams/?version=${nextVersion}${nextLvl ? `&lvl=${nextLvl}` : ''}`;

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
                <Link
                  key={exam.slug}
                  href={`/hsk/exams/${exam.slug}/`}
                  class="card bg-base-100 border border-base-300 hover:border-primary transition-colors"
                >
                  <div class="card-body p-4">
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
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Пробные экзамены HSK',
  meta: [
    {
      name: 'description',
      content:
        'Полноформатные пробные экзамены HSK: аудирование, чтение и письмо с проверкой ответов и пояснениями.',
    },
  ],
};
