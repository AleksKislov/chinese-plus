import {
  component$,
  useStyles$,
  createContextId,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import globalStyles from "./global.css?inline";
import { QwikPartytown } from "./components/partytown/partytown";

type ReadTodayMap = {
  [key: string]: number[];
};

export type UserWord = {
  _id: ObjectId;
  chinese: string;
  pinyin: string;
  translation: string;
  date: ISODate;
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
  // newMentions: CommentType[];
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
    // newMentions: [],
    role: undefined,
    newAvatar: undefined,
  });
  const alertsState = useStore<Alert[]>([]);
  const isDarkThemeState = useStore({ bool: true });

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
