import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { userContext } from '~/root';
import { useSetExamApproved } from '~/misc/actions/hsk-exams/set-approved';
import { type HskExamListItem, SECTION_TITLES_RU } from './types';
import { VERSION_NAME, levelLabel } from './levels';

export const ExamCard = component$(({ exam }: { exam: HskExamListItem }) => {
  const { isAdmin } = useContext(userContext);
  const setApproved = useSetExamApproved();

  return (
    <div
      class={`card bg-base-100 border transition-colors ${
        !exam.isApproved ? 'border-warning' : 'border-base-300 hover:border-primary'
      }`}
    >
      <Link href={`/hsk/exams/${exam.slug}/`} class="card-body p-4">
        <h3 class="card-title text-base">{exam.title.ru || exam.title.cn || exam.slug}</h3>
        {exam.title.cn && exam.title.ru && <p class="text-sm opacity-70">{exam.title.cn}</p>}
        {exam.descriptionRu && <p class="text-sm opacity-80">{exam.descriptionRu}</p>}
        <div class="flex flex-wrap gap-1 mt-2">
          <span class="badge badge-primary badge-sm">
            {VERSION_NAME[exam.version]} · {levelLabel(exam.version, exam.level)}
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
            <span class={`badge badge-sm ${exam.isApproved ? 'badge-success' : 'badge-warning'}`}>
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
              await setApproved.submit({ slug: exam.slug, isApproved: !exam.isApproved });
              window.location.reload();
            }}
          >
            {exam.isApproved ? 'Снять с публикации' : 'Одобрить'}
          </button>
        </div>
      )}
    </div>
  );
});
