import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { TableCard } from "~/components/hsk/table-card";
import { Pagination } from "~/components/hsk/pagination";
import { ApiService } from "~/misc/actions/request";
import { NewHskTable } from "~/components/hsk/new-hsk-table";
import { PageTitle } from "~/components/common/layout/title";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";

export type NewHskWordType = {
  _id: ObjectId;
  id: number;
  cn: string;
  py: string;
  ru: string;
  lvl: string;
};

export const getHskWords = routeLoader$(async (ev): Promise<NewHskWordType[]> => {
  const lvl = ev.query.get("lvl") || "1";
  const lmt = ev.query.get("pg") || "0";
  return await ApiService.get(`/api/newhskwords?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const loc = useLocation();
  const hskWords = getHskWords();

  return (
    <>
      <PageTitle txt={"Вся лексика для HSK 3.0"} />

      <FlexRow>
        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get("lvl") || "1"}
            isOldHsk={false}
            isForTests={false}
          />
        </Sidebar>

        <MainContent>
          <Pagination
            level={loc.url.searchParams.get("lvl") || "1"}
            curPage={+loc.url.searchParams.get("pg")! || 0}
            isOldHsk={false}
          />

          <NewHskTable hskWords={hskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Лексика HSK 3.0",
  meta: [
    {
      name: "description",
      content: "Все слова нового HSK версии 3.0 разбитые по уровням.",
    },
  ],
};
