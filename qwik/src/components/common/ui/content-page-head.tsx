import { component$ } from '@builder.io/qwik';
import { MainContent } from '../layout/main-content';
import { Sidebar } from '../layout/sidebar';
import { PageTitle } from '../layout/title';
import { BackBtn } from './back-btn';
import { Breadcrumbs, type Crumb } from '../layout/breadcrumbs';

type ContentPageHeadProps = {
  path: string;
  title: string;
  hits?: number;
  // Breadcrumb trail (after "Главная") rendered above the head; omitted = no trail.
  crumbs?: Crumb[];
};

export const ContentPageHead = component$(({ path, title, hits, crumbs }: ContentPageHeadProps) => (
  <>
    {crumbs && <Breadcrumbs items={crumbs} />}
    <div class={'flex flex-col md:flex-row'}>
      <Sidebar noAds={true}>
        <BackBtn path={path} />
      </Sidebar>

      <MainContent>
        <PageTitle txt={title} hits={hits} hSizeSm={true} />
      </MainContent>
    </div>
  </>
));
