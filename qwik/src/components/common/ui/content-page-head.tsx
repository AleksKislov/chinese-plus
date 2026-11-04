import { component$ } from '@builder.io/qwik';
import { PageTitle } from '../layout/title';
import { Breadcrumbs, type Crumb } from '../layout/breadcrumbs';

type ContentPageHeadProps = {
  title: string;
  hits?: number;
  // Breadcrumb trail after "Главная" - it also serves as the way back to the section.
  crumbs: Crumb[];
};

export const ContentPageHead = component$(({ title, hits, crumbs }: ContentPageHeadProps) => (
  <>
    <Breadcrumbs items={crumbs} />
    <div class="mb-6">
      <PageTitle txt={title} hits={hits} hSizeSm={true} />
    </div>
  </>
));
