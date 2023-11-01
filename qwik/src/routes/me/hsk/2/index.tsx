import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { type RequestEvent, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Alerts } from "~/components/common/alerts/alerts";
import { OldHskTable } from "~/components/hsk/hsk-table";
import { ApiService } from "~/misc/actions/request";
import { PageTitle } from "~/components/common/layout/title";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { type UserOldHskWordType } from "~/routes/hsk/2/table";
import { PrivateHskCard } from "~/components/me/hsk/private-hsk-card";
import { TypingGame } from "~/components/hsk/typing-game";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const getUserHsk2Words = routeLoader$(async ({ cookie }): Promise<UserOldHskWordType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return await ApiService.get("/api/words", token, []);
});

export default component$(() => {
  const userHskWords = getUserHsk2Words();
  const lvlSignal = useSignal("1");
  const wordsSignal = useSignal(userHskWords?.value || []);
  const lvlWordsNum = useSignal({
    1: wordsSignal.value.filter((word) => word.level === 1).length,
    2: wordsSignal.value.filter((word) => word.level === 2).length,
    3: wordsSignal.value.filter((word) => word.level === 3).length,
    4: wordsSignal.value.filter((word) => word.level === 4).length,
    5: wordsSignal.value.filter((word) => word.level === 5).length,
    6: wordsSignal.value.filter((word) => word.level === 6).length,
    total: wordsSignal.value.length,
  });
  useTask$(({ track }) => {
    track(() => lvlSignal.value);
    if (!+lvlSignal.value) {
      wordsSignal.value = userHskWords?.value;
    } else {
      wordsSignal.value = userHskWords?.value.filter((word) => word.level === +lvlSignal.value);
    }
  });

  return (
    <>
      <PageTitle txt={"Мой словарик HSK 2.0"} />

      <FlexRow>
        <Alerts />

        <Sidebar>
          <PrivateHskCard lvlSignal={lvlSignal} lvlWordsNumMap={lvlWordsNum.value} />
        </Sidebar>

        <MainContent>
          <TypingGame
            words={wordsSignal.value.map((x) => ({
              chinese: x.chinese,
              level: "" + x.level,
              id: x.word_id,
              pinyin: x.pinyin,
              translation: x.translation,
            }))}
          />
          <OldHskTable
            hskWords={wordsSignal.value}
            userHskWords={wordsSignal.value}
            isPrivate={true}
          />
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Личный словарик HSK",
};
