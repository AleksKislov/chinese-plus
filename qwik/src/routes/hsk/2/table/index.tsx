import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
import { TableCard } from "~/components/hsk/table-card";
import { Pagination } from "~/components/hsk/pagination";
import { OldHskTable } from "~/components/hsk/hsk-table";
import { ApiService } from "~/misc/actions/request";
import { PageTitle } from "~/components/common/layout/title";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { getTokenFromCookie } from "~/misc/actions/auth";

export type OldHskWordType = {
  _id: ObjectId;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

export type UserOldHskWordType = {
  _id: ObjectId;
  user: string;
  word_id: number;
  chinese: string;
  pinyin: string;
  translation: string;
  level: number;
};

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get("/api/words", token, []);
});

export const getHskWords = routeLoader$(async ({ query }): Promise<OldHskWordType[]> => {
  const lvl = query.get("lvl") || "1";
  const lmt = query.get("pg") || "0";
  return await ApiService.get(`/api/lexicon?hsk_level=${lvl}&limit=${lmt}`, undefined, []);
});

export default component$(() => {
  const loc = useLocation();
  const hskWords = getHskWords();
  const userHskWords = getUserHsk2Words();

  return (
    <>
      <PageTitle txt={"Вся лексика для HSK 2.0"} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <TableCard
            level={loc.url.searchParams.get("lvl") || "1"}
            isOldHsk={true}
            isForTests={false}
          />
        </Sidebar>

        <MainContent>
          <Pagination
            level={loc.url.searchParams.get("lvl") || "1"}
            curPage={+loc.url.searchParams.get("pg")! || 0}
            isOldHsk={true}
          />

          <OldHskTable hskWords={hskWords?.value || []} userHskWords={userHskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Лексика HSK 2.0 с озвучкой",
  meta: [
    {
      name: "description",
      content:
        "Все слова HSK версии 2.0 разбитые по уровням, озвученные носителем языка. Добавляйте слова с личный словарик для дальнейшего повторения.",
    },
  ],
};
