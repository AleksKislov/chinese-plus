import { component$, createContextId, useContextProvider, useStore } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

// plain import (not ?inline + useStyles$): emitted as a separate, cacheable CSS file
// instead of ~150KB of CSS inlined into every SSR'd HTML page
import './global.css';

export const IsLightThemeCookieName = 'isLightTheme';

type ReadTodayMap = {
  [key: string]: number[];
};

export type UserWord = {
  _id: ObjectId;
  chinese: string;
  pinyin: string;
  translation: string;
  date: ISODate;
  dictWordId: ObjectId;
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
  wordsMap: Record<string, boolean>;
  wordsCount: number;
  readDailyGoal: number;
  readTodayNum: number;
  readTodayMap: ReadTodayMap;
  hsk2WordsTotal: number;
  role?: 'admin' | 'moderator';
  newAvatar?: NewAvatar;
  bio: string;
}

export interface Config {
  type: string;
  isActive: boolean;
  [x: string]: unknown;
}

export interface Alert {
  bg: AlertBgUnion;
  text: string;
}
type AlertBgUnion = 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error';

export const AlertColorEnum = {
  info: 'alert-info' as AlertBgUnion,
  success: 'alert-success' as AlertBgUnion,
  warning: 'alert-warning' as AlertBgUnion,
  error: 'alert-error' as AlertBgUnion,
};

export const userContext = createContextId<User>('user-context');
export const alertsContext = createContextId<Alert[]>('alerts-context');
export const configContext = createContextId<Config[]>('config-context');

export default component$(() => {
  const userState = useStore<User>({
    _id: '',
    name: '',
    loggedIn: false,
    isAdmin: false,
    isModerator: false,
    email: '',
    finishedTexts: [],
    seenVideos: [],
    wordsMap: {},
    wordsCount: 0,
    hsk2WordsTotal: 0,
    readDailyGoal: 0,
    readTodayNum: 0,
    readTodayMap: {},
    role: undefined,
    newAvatar: undefined,
    bio: '',
  });
  const alertsState = useStore<Alert[]>([]);
  const configState = useStore<Config[]>([]);

  useContextProvider(userContext, userState);
  useContextProvider(alertsContext, alertsState);
  useContextProvider(configContext, configState);

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <meta name="yandex-verification" content="d38c47d88e5dda70" />
        {/* <link rel='manifest' href='/manifest.json' /> */}
        {/*
          Metrika + ads scripts are added only after window "load": async scripts still
          hold the load event, and mc.yandex.ru / yandex.ru are slow or hang from China,
          which kept the tab spinner going after the page was ready. ym() calls and
          yaContextCb callbacks are queued until the scripts arrive.
        */}
        <script
          dangerouslySetInnerHTML={`
                window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
                window.ym.l = 1 * new Date();
                window.yaContextCb = window.yaContextCb || [];

                ym(48737867, "init", {
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true
                });

                (function () {
                  function addScript(src) {
                    for (var j = 0; j < document.scripts.length; j++) {
                      if (document.scripts[j].src === src) return;
                    }
                    var s = document.createElement("script");
                    s.async = true;
                    s.src = src;
                    document.head.appendChild(s);
                  }
                  function loadYandex() {
                    addScript("https://mc.yandex.ru/metrika/tag.js");
                    addScript("https://yandex.ru/ads/system/context.js");
                  }
                  if (document.readyState === "complete") {
                    loadYandex();
                  } else {
                    window.addEventListener("load", loadYandex, { once: true });
                  }
                })();
            `}
        />

        <RouterHead />
      </head>
      <body class="text-neutral-content">
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/48737867"
              style="position:absolute; left:-9999px;"
              alt=""
            />
          </div>
        </noscript>
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
