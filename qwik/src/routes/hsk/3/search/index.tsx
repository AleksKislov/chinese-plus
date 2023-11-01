import { component$, useSignal } from "@builder.io/qwik";
import { HskSearchForm } from "~/components/hsk/search-form";
import { type NewHskWordType } from "../table";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { PageTitle } from "~/components/common/layout/title";
import { NewHskTable } from "~/components/hsk/new-hsk-table";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const hskWords = useSignal<NewHskWordType[]>([]);

  return (
    <>
      <PageTitle txt={"Поиск слов HSK 3.0"} />
      <FlexRow>
        <Sidebar>
          <div class='card bg-primary text-primary-content'>
            <div class='card-body'>
              <h2 class='card-title'>Найти слово HSK 3.0</h2>
              <p>
                Найдите нужные вам слова нового HSK 3.0
                <br />1 band - 500 слов
                <br />2 band - 772 слова
                <br />3 band - 973 слова
                <br />4 band - 1000 слов
                <br />5 band - 1071 слово
                <br />6 band - 1140 слов
                <br />
                7,8,9 bands - 5636 слов
              </p>
              <HskSearchForm hskWords={hskWords} isOldHsk={false} />
            </div>
          </div>
        </Sidebar>

        <MainContent>
          <NewHskTable hskWords={hskWords?.value || []} />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Поиск по словам HSK 3.0",
};
