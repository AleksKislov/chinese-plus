import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { CharactersLinkCard } from "~/components/common/content-cards/characters-link-card";
import { FlexRow } from "~/components/common/layout/flex-row";
import { MainContent } from "~/components/common/layout/main-content";
import { Sidebar } from "~/components/common/layout/sidebar";
import { PageTitle } from "~/components/common/layout/title";
import { TonesPractice } from "~/components/start/tones-practice/tones-practice";

export default component$(() => {
  return (
    <>
      <PageTitle txt={"Практика тонов"} />

      <FlexRow>
        <Sidebar>
          <div class='card w-full bg-base-200'>
            <div class='card-body'>
              <h2 class='card-title'>Черточки</h2>
              <p>
                Практика тонов:{" "}
                <Link href='/start/radicals' class='link hover:link-success font-bold'>
                  тест
                </Link>
              </p>
            </div>
          </div>
          <CharactersLinkCard />
        </Sidebar>
        <MainContent>
          <TonesPractice />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Практика произнесения тонов",
  meta: [
    {
      name: "description",
      content:
        "Тренируйтесь произносить тоны китайского языка с наглядным отображением произнесенного звука",
    },
  ],
};
