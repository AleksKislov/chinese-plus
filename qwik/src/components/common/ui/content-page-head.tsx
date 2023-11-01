import { component$ } from "@builder.io/qwik";
import { MainContent } from "../layout/main-content";
import { Sidebar } from "../layout/sidebar";
import { PageTitle } from "../layout/title";
import { BackBtn } from "./back-btn";

type ContentPageHeadProps = {
  path: string;
  title: string;
  hits?: number;
};

export const ContentPageHead = component$(({ path, title, hits }: ContentPageHeadProps) => (
  <div class={"flex flex-col md:flex-row"}>
    <Sidebar>
      <BackBtn path={path} />
    </Sidebar>

    <MainContent>
      <PageTitle txt={title} hits={hits} hSizeSm={true} />
    </MainContent>
  </div>
));
