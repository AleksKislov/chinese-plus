import {
  component$,
  useStyles$,
  createContextId,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import globalStyles from './global.css?inline';
import { QwikPartytown } from './components/partytown/partytown';
import type { DonateGoal } from './routes/(club)/donate';

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
  words: UserWord[];
  readDailyGoal: number;
  readTodayNum: number;
  readTodayMap: ReadTodayMap;
  hsk2WordsTotal: number;
  role?: 'admin' | 'moderator';
  newAvatar?: NewAvatar;
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
export const goalsContext = createContextId<DonateGoal[]>('goals-context');

export default component$(() => {
  useStyles$(globalStyles);
  const userState = useStore<User>({
    _id: '',
    name: '',
    loggedIn: false,
    isAdmin: false,
    isModerator: false,
    email: '',
    finishedTexts: [],
    seenVideos: [],
    words: [],
    hsk2WordsTotal: 0,
    readDailyGoal: 0,
    readTodayNum: 0,
    readTodayMap: {},
    role: undefined,
    newAvatar: undefined,
  });
  const alertsState = useStore<Alert[]>([]);
  const configState = useStore<Config[]>([]);
  const goalsState = useStore<DonateGoal[]>([]);

  useContextProvider(userContext, userState);
  useContextProvider(alertsContext, alertsState);
  useContextProvider(configContext, configState);
  useContextProvider(goalsContext, goalsState);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        {/* <link rel='manifest' href='/manifest.json' /> */}
        <QwikPartytown forward={['ym']} />
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(48737867, "init", {
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true
                });            
            `}
        />
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/48737867"
              style="position:absolute; left:-9999px;"
              alt=""
            />
          </div>
        </noscript>
        <RouterHead />
      </head>
      <body lang="en" class="text-neutral-content">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
