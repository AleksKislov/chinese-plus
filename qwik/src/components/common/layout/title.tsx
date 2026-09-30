import { component$ } from '@builder.io/qwik';
import { PageHits } from '../content-cards/page-hits';

type PageTitleProps = {
  txt: string;
  hits?: number;
  hSizeSm?: boolean; // true for content page title (smaller h1)
};

export const PageTitle = component$(({ txt, hits, hSizeSm }: PageTitleProps) => {
  return (
    <>
      {hSizeSm ? (
        // The page's only H1 (content pages have no other), sized like an h2 and
        // not capped at prose line length so long titles use the full width.
        <div class="prose max-w-none">
          <h1 class="text-2xl font-bold">
            {txt} {hits && <PageHits hits={hits || 0} />}
          </h1>
        </div>
      ) : (
        <div class="prose mb-3">
          <h1>{txt}</h1>
        </div>
      )}
    </>
  );
});
