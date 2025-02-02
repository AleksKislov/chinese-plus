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
// import { QwikPartytown } from './components/partytown/partytown';
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
        {/* <QwikPartytown forward={['gtag', 'dataLayer.push']} /> */}
        <script
          type="text/partytown"
          dangerouslySetInnerHTML={`
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_Inl1WaFrAWNUDeSpk5UJ3BD9lJhGZ7Uqx7FyDoGqjm7', {
                  api_host:'https://us.i.posthog.com',
                  person_profiles: 'identified_only'
              })`}
        />
        {/* <script
          async
          type="text/partytown"
          src="https://www.googletagmanager.com/gtag/js?id=G-PN0P7BPQCV"
        /> */}
        <RouterHead />
      </head>
      <body lang="en" class="text-neutral-content">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
