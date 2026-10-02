import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { type HskVersion, HSK_LEVELS, examsPath, fromWordsLevel, levelLabel } from './exams/levels';

type HskExamsLinkCardProps = {
  version: HskVersion;
  level: string;
};

export const HskExamsLinkCard = component$(({ version, level }: HskExamsLinkCardProps) => {
  const examLvl = fromWordsLevel(version, level);
  const lvl = HSK_LEVELS[version].includes(examLvl) ? examLvl : '';
  return (
    <div class="card w-full bg-base-200 my-3">
      <div class="card-body">
        <h2 class="card-title">Готовитесь к HSK?</h2>
        <p>
          Проверьте себя на{' '}
          <Link
            prefetch="js"
            class="link link-hover link-secondary font-bold"
            href={examsPath(version, lvl)}
          >
            пробном экзамене HSK{lvl ? ` ${levelLabel(version, lvl)}` : ''}
          </Link>{' '}
          — с аудированием, проверкой ответов и пояснениями.
        </p>
      </div>
    </div>
  );
});
