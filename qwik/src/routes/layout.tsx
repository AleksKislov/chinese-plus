import { component$, Slot, useContext, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import Header from "../components/common/layout/header/header";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { getTokenFromCookie, logout, type UserFromDB } from "~/misc/actions/auth";
import { Footer } from "~/components/common/layout/footer";
import { IsLightThemeCookieName, type UserWord } from "~/root";
import { userContext } from "~/root";
import { type CommentType } from "~/components/common/comments/comment-card";

export const getNewMentions = routeLoader$(async ({ cookie }): Promise<CommentType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get("/api/comments/to_me/false", token, []);
});

export const useGetUser = routeLoader$(async ({ cookie }): Promise<UserFromDB | null> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return null;
  return ApiService.get("/api/auth", token, null);
});

export const useGetUserHsk2WordsTotal = routeLoader$(async ({ cookie }): Promise<number> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return 0;
  const res = await ApiService.get("/api/words", token, []);
  return res?.length || 0;
});

export const useGetUserWords = routeLoader$(async ({ cookie }): Promise<UserWord[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get("/api/userwords", token, []);
});

export const useCheckTheme = routeLoader$(({ cookie }): boolean => {
  const isLightTheme = Boolean(+(cookie.get(IsLightThemeCookieName)?.value || "0"));
  return !isLightTheme;
});

export default component$(() => {
  const userState = useContext(userContext);
  const user = useGetUser();
  const hsk2WordsTotal = useGetUserHsk2WordsTotal();
  const userWords = useGetUserWords();

  useTask$(({ track }) => {
    track(() => user.value);
    if (!user.value) return;

    userState._id = user.value._id;
    userState.name = user.value.name;
    userState.email = user.value.email;
    userState.loggedIn = true;
    userState.role = user.value.role;
    userState.isAdmin = user.value.role === "admin";
    userState.isModerator = user.value.role === "moderator";
    userState.finishedTexts = user.value.finished_texts ? user.value.finished_texts : [];
    userState.seenVideos = user.value.seenVideos ? user.value.seenVideos : [];
    userState.readDailyGoal = user.value.daily_reading_goal || 0;
    userState.readTodayNum = user.value.read_today_num || 0;
    userState.readTodayMap = user.value.read_today_arr || {};
    userState.newAvatar = user.value.newAvatar ? user.value.newAvatar : undefined;
  });

  useTask$(({ track }) => {
    track(() => hsk2WordsTotal.value);
    if (hsk2WordsTotal.value === undefined) return;
    userState.hsk2WordsTotal = hsk2WordsTotal.value;
  });

  useTask$(({ track }) => {
    track(() => userWords.value);
    if (userWords.value === undefined) return;
    userState.words = userWords.value;
  });

  useVisibleTask$(({ track }) => {
    track(() => user.value);
    if (user.value === undefined) return;
    if (user.value === null) logout();
  });

  return (
    <>
      <main class={"flex flex-col min-h-screen text-base-content"}>
        <Header />
        <section class={"relative flex flex-col min-h-screen justify-between "}>
          <div class='relative container mx-auto px-4 lg:px-28'>
            <Slot />
          </div>
          <Footer />
        </section>
      </main>
    </>
  );
});
