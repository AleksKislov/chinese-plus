import {
  component$,
  useStyles$,
  useVisibleTask$,
  createContextId,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import Cookies from "js-cookie";
import { logout, StatusCodes, getUser } from "./misc/actions/auth";

import globalStyles from "./global.css?inline";
import { getUserWords, type UserWord } from "./misc/actions/get-user-words";
import { getUserHsk2WordsTotal } from "./misc/actions/get-user-hsk2-total";
import { type CommentType } from "./components/common/comments/comment-card";
import { QwikPartytown } from "./components/partytown/partytown";

type ReadTodayMap = {
  [key: string]: number[];
};

export interface User {
  _id: ObjectId;
  name: string;
  loggedIn: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  email: string;
  finishedTexts: string[];
  seenVideos: string[];
  words: UserWord[];
  readDailyGoal: number;
  readTodayNum: number;
  readTodayMap: ReadTodayMap;
  newMentions: CommentType[];
  hsk2WordsTotal: number;
  role?: "admin" | "moderator";
  newAvatar?: NewAvatar;
}

export interface Alert {
  bg: AlertBgUnion;
  text: string;
}
type AlertBgUnion = "alert-info" | "alert-success" | "alert-warning" | "alert-error";

export const AlertColorEnum = {
  info: "alert-info" as AlertBgUnion,
  success: "alert-success" as AlertBgUnion,
  warning: "alert-warning" as AlertBgUnion,
  error: "alert-error" as AlertBgUnion,
};

export const userContext = createContextId<User>("user-context");
export const alertsContext = createContextId<Alert[]>("alerts-context");
export const isDarkThemeContext = createContextId<{ bool: boolean }>("theme-context");

export default component$(() => {
  useStyles$(globalStyles);
  const userState = useStore<User>({
    _id: "",
    name: "",
    loggedIn: false,
    isAdmin: false,
    isModerator: false,
    email: "",
    finishedTexts: [],
    seenVideos: [],
    words: [],
    hsk2WordsTotal: 0,
    readDailyGoal: 0,
    readTodayNum: 0,
    readTodayMap: {},
    newMentions: [],
    role: undefined,
    newAvatar: undefined,
  });
  const alertsState = useStore<Alert[]>([]);
  const isDarkThemeState = useStore({ bool: true });

  useVisibleTask$(async () => {
    const cntrlr = new AbortController();
    const token = Cookies.get("token");
    if (!token) return;
    const [userResp, userWords, hsk2WordsTotal] = await Promise.allSettled([
      getUser(token, cntrlr),
      getUserWords(token),
      getUserHsk2WordsTotal(token),
    ]);
    // console.log(TailwindConf);

    if (userResp.status === "rejected") return cntrlr.abort;
    const resp = userResp.value;
    if (resp.err === StatusCodes.Unauthorized) {
      logout();
    }
    if (resp.user) {
      userState._id = resp.user._id;
      userState.name = resp.user.name;
      userState.email = resp.user.email;
      userState.loggedIn = true;
      userState.role = resp.user.role;
      userState.isAdmin = resp.user.role === "admin";
      userState.isModerator = resp.user.role === "moderator";
      userState.finishedTexts = resp.user.finished_texts ? resp.user.finished_texts : [];
      userState.seenVideos = resp.user.seenVideos ? resp.user.seenVideos : [];
      userState.words = userWords.status === "fulfilled" ? userWords.value : [];
      userState.readDailyGoal = resp.user.daily_reading_goal || 0;
      userState.readTodayNum = resp.user.read_today_num || 0;
      userState.readTodayMap = resp.user.read_today_arr || {};
      userState.hsk2WordsTotal = hsk2WordsTotal.status === "fulfilled" ? hsk2WordsTotal.value : 0;
      userState.newAvatar = resp.user.newAvatar ? resp.user.newAvatar : undefined;
    }
    return cntrlr.abort;
  });

  useContextProvider(userContext, userState);
  useContextProvider(alertsContext, alertsState);
  useContextProvider(isDarkThemeContext, isDarkThemeState);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet='utf-8' />
        {/* <link rel='manifest' href='/manifest.json' /> */}
        <QwikPartytown forward={["dataLayer.push"]} />
        <script
          async
          type='text/partytown'
          src='https://www.googletagmanager.com/gtag/js?id=UA-73132243-4'
        />
        <RouterHead />
      </head>
      <body
        lang='en'
        data-theme={isDarkThemeState.bool ? "night" : "emerald"}
        class='text-neutral-content'
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
