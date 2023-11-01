import { component$, useContext } from "@builder.io/qwik";
import {
  routeLoader$,
  type RequestEvent,
  routeAction$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ReadResultCard } from "~/components/me/read-result-card";
import { ApiService } from "~/misc/actions/request";
import { userContext } from "~/root";
import { type TextsNumInfo } from "../read/texts";
import { type ReadStatType, ReadingDiagram } from "~/components/me/reading-diagram";
import { PersonalStats } from "~/components/me/personal-stats";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { PersonalMentions } from "~/components/me/mentions";
import { type CommentType } from "~/components/common/comments/comment-card";
import { UserMainInfo } from "~/components/me/user-main-info";

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, "/login");
};

export const getTextsStats = routeLoader$((): Promise<TextsNumInfo> => {
  return ApiService.get(`/api/texts/texts_num`, undefined, {});
});

export const getOldMentions = routeLoader$(async ({ cookie }): Promise<CommentType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get("/api/comments/to_me/true", token, []);
});

// await axios.post("/api/comments/mark_mentions_as_seen", {}, config);
export const markMentionsAsOld = routeAction$((_param, ev) => {
  const token = getTokenFromCookie(ev.cookie);
  return ApiService.post("/api/comments/mark_mentions_as_seen", {}, token);
});

export const getReadStats = routeLoader$(async ({ cookie }): Promise<ReadStatType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get(`/api/users/reading_results`, token, []);

  // for tests
  // return [
  //   {
  //     // user_id: "5f301a8f0aa5c18",
  //     have_read: 371,
  //     daily_goal: 400,
  //     createdAt: "2023-08-22T23:27:13.504Z",
  //   },
  // ];
});

export default component$(() => {
  const textsStats = getTextsStats();
  const readStats = getReadStats();
  const {
    newAvatar,
    name,
    finishedTexts,
    readDailyGoal,
    readTodayNum,
    newMentions,
    hsk2WordsTotal,
    words,
    role,
    _id: userId,
  } = useContext(userContext);

  return (
    <>
      <PageTitle txt={"Личный кабинет"} />

      <FlexRow>
        <div class='w-full basis-1/2  mt-3'>
          <UserMainInfo
            id={userId}
            newAvatar={newAvatar}
            role={role}
            name={name}
            isPrivate={true}
          />
          <PersonalStats
            approvedTextsNum={textsStats.value.approved}
            finishedTextsTotal={finishedTexts.length}
            userWordsTotal={words.length}
            hsk2Total={hsk2WordsTotal}
          />
        </div>

        <div class='w-full basis-1/2'>
          <ReadResultCard />
        </div>
      </FlexRow>

      <FlexRow>
        <ReadingDiagram
          data={readStats.value}
          readDailyGoal={readDailyGoal}
          readTodayNum={readTodayNum}
        />
      </FlexRow>

      <FlexRow>
        <PersonalMentions newMentions={newMentions} />
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Личный кабинет",
};
