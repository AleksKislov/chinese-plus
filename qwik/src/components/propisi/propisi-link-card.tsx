import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {
  type HskSheetVersion,
  HSK_SHEET_LEVELS,
  hskLevelTitle,
  hskSheetPath,
  propisiUrl,
} from './types';

type PropisiLinkCardProps = { version?: HskSheetVersion; level?: string };

// sidebar link to the writing sheets: of an HSK level, or the generator itself
export const PropisiLinkCard = component$(({ version, level }: PropisiLinkCardProps) => {
  const hasLevel = version && level && HSK_SHEET_LEVELS[version].includes(level);

  return (
    <div class="card w-full bg-base-200 my-3">
      <div class="card-body">
        <h2 class="card-title">Прописи иероглифов</h2>
        <p>
          {hasLevel ? (
            <>
              Распечатайте{' '}
              <Link
                prefetch="js"
                class="link link-hover link-secondary font-bold"
                href={hskSheetPath(version, level)}
              >
                прописи {hskLevelTitle(version, level)}
              </Link>
              : сетка 田字格, порядок черт, пиньинь и перевод.
            </>
          ) : (
            <>
              Сделайте{' '}
              <Link
                prefetch="js"
                class="link link-hover link-secondary font-bold"
                href={propisiUrl}
              >
                прописи
              </Link>{' '}
              для любых иероглифов: сетка 田字格, порядок черт, пиньинь — и сразу в PDF.
            </>
          )}
        </p>
      </div>
    </div>
  );
});
