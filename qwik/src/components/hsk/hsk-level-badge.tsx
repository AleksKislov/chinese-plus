import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { wordLevelLabel, wordsPageUrl } from './words-seo';

// word -> its lowest HSK 3.0 level, from api/newhskwords/levels
export type HskLevels = Record<string, string>;

// links to the word list of the level
export const HskLevelBadge = component$(({ level }: { level: string }) => (
  <div
    class="tooltip tooltip-bottom tooltip-info not-prose"
    data-tip={`Слово из списка HSK 3.0, уровень ${wordLevelLabel(level)}`}
  >
    <Link
      prefetch="js"
      href={wordsPageUrl('new', 'table', level)}
      class="badge badge-info badge-outline whitespace-nowrap no-underline"
    >
      HSK · {wordLevelLabel(level)}
    </Link>
  </div>
));
