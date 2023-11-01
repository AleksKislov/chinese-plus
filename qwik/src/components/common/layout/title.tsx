import { component$ } from "@builder.io/qwik";
import { PageHits } from "../content-cards/page-hits";

type PageTitleProps = {
  txt: string;
  hits?: number;
  hSizeSm?: boolean; // true for content page title
};

export const PageTitle = component$(({ txt, hits, hSizeSm }: PageTitleProps) => {
  return (
    <>
      {hSizeSm ? (
        <div class='prose'>
          <h2>
            {txt} <PageHits hits={hits || 0} />
          </h2>
        </div>
      ) : (
        <div class='prose mb-3'>
          <h1>{txt}</h1>
        </div>
      )}
    </>
  );
});
