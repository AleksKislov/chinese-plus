import { component$, Slot, useContext, useTask$ } from '@builder.io/qwik';
import Header from '../components/common/layout/header/header';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import { ApiService, BASE_URL } from '~/misc/actions/request';
import { getTokenFromCookie, type UserFromDB } from '~/misc/actions/auth';
import { Footer } from '~/components/common/layout/footer';
import { userContext, configContext, type Config } from '~/root';
import { ThemeTypes } from '~/components/common/layout/header/theme-changer';
import { ChineseSelectionPopup } from '~/components/common/selection/chinese-selection-popup';
import { cachedFetch } from '~/misc/helpers/tools/cached-fetch';
import { useCheckTheme } from '~/misc/loaders/layout-loaders';

// defined outside so header components can use them without importing this file
export { getNewMentions, useCheckTheme } from '~/misc/loaders/layout-loaders';

// version/configs are identical for every visitor - don't hit the backend on every request
const SHARED_LOADER_TTL_MS = 60 * 1000;

// Logs out (deletes the token) only when the BE definitely rejects it. Anything else -
// a 404 page, a BE error or restart - keeps the session; ApiService can't tell these apart
// (it returns null for every failure), hence the plain fetch.
export const useGetUser = routeLoader$(async ({ cookie }): Promise<UserFromDB | null> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth`, { headers: { 'x-auth-token': token } });
    if (res.status === 401) {
      cookie.delete('token', { path: '/' }); // invalid or expired token
      return null;
    }
    if (!res.ok) return null;

    const user: UserFromDB | null = await res.json();
    if (!user) cookie.delete('token', { path: '/' }); // valid token of a deleted user
    return user;
  } catch (err) {
    console.log('[fetch fail] for /api/auth', err);
    return null;
  }
});

export const useGetBackendVersion = routeLoader$(async (): Promise<{ v: string } | null> => {
  return cachedFetch('be-version', SHARED_LOADER_TTL_MS, () =>
    ApiService.get('/api/project/version', undefined, null),
  );
});

export const useGetUserHsk2WordsTotal = routeLoader$(async ({ cookie }): Promise<number> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return 0;
  const res = await ApiService.get('/api/words', token, []);
  return res?.length || 0;
});

export const useGetUserHsk3WordsTotal = routeLoader$(async ({ cookie }): Promise<number> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return 0;
  const res: { count: number } | null = await ApiService.get(
    '/api/userhsk3words/count',
    token,
    null,
  );
  return res?.count || 0;
});

// Lightweight - just the chinese strings, used app-wide for the "is this word known"
// lookup (reader highlighting) and the header word count. The full word list (with
// pinyin/translation/dictWordId) is fetched separately by the /me/words page only.
// Skipped on create/edit text pages - no tooltip/highlighting there, and it's the
// slowest loader for users with a big vocabulary.
export const useGetUserWords = routeLoader$(async ({ cookie, url }): Promise<string[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  if (/^\/(create\/text|edit\/text\/)/.test(url.pathname)) {
    return [];
  }
  return ApiService.get('/api/userwords/light', token, []);
});

export const useFeConfigs = routeLoader$((): Promise<Config[]> => {
  return cachedFetch(
    'fe-configs',
    SHARED_LOADER_TTL_MS,
    () => ApiService.get('/api/project/configs', undefined, []),
    (configs) => configs.length > 0,
  );
});

export default component$(() => {
  const isDarkTheme = useCheckTheme().value;
  const userState = useContext(userContext);
  const user = useGetUser();
  const hsk2WordsTotal = useGetUserHsk2WordsTotal();
  const hsk3WordsTotal = useGetUserHsk3WordsTotal();
  const userWords = useGetUserWords();
  const beVersion = useGetBackendVersion();
  const feConfigs = useFeConfigs();
  const configState = useContext(configContext);
  const loc = useLocation();

  useTask$(({ track }) => {
    track(() => user.value);
    if (!user.value) return;

    userState._id = user.value._id;
    userState.name = user.value.name;
    userState.email = user.value.email;
    userState.loggedIn = true;
    userState.role = user.value.role;
    userState.isAdmin = user.value.role === 'admin';
    userState.isModerator = user.value.role === 'moderator';
    userState.finishedTexts = user.value.finished_texts ? user.value.finished_texts : [];
    userState.seenVideos = user.value.seenVideos ? user.value.seenVideos : [];
    userState.readDailyGoal = user.value.daily_reading_goal || 0;
    userState.readTodayNum = user.value.read_today_num || 0;
    userState.readTodayMap = user.value.read_today_arr || {};
    userState.newAvatar = user.value.newAvatar ? user.value.newAvatar : undefined;
    userState.bio = user.value.bio || '';
  });

  useTask$(({ track }) => {
    track(() => hsk2WordsTotal.value);
    if (hsk2WordsTotal.value === undefined) return;
    userState.hsk2WordsTotal = hsk2WordsTotal.value;
  });

  useTask$(({ track }) => {
    track(() => hsk3WordsTotal.value);
    if (hsk3WordsTotal.value === undefined) return;
    userState.hsk3WordsTotal = hsk3WordsTotal.value;
  });

  useTask$(({ track }) => {
    track(() => userWords.value);
    if (userWords.value === undefined) return;
    userState.wordsMap = Object.fromEntries(userWords.value.map((chinese) => [chinese, true]));
    userState.wordsCount = userWords.value.length;
  });

  // layout loaders re-run on every client navigation - replace, don't append
  useTask$(({ track }) => {
    const res = track(() => feConfigs.value);
    configState.splice(0, configState.length, ...res.filter((x) => x.isActive));
  });

  return (
    <>
      <main
        class={'flex flex-col min-h-screen text-base-content'}
        data-theme={isDarkTheme ? ThemeTypes.dark : ThemeTypes.light}
      >
        {/* page data is fetched on click (no data prefetch), so show that the click registered */}
        {loc.isNavigating && (
          <div class="nav-progress fixed top-0 left-0 z-50 h-1 w-full bg-secondary" />
        )}
        <Header />
        <section class={'relative flex flex-col min-h-screen justify-between '}>
          <div class="relative container mx-auto px-4 lg:px-28">
            <Slot />
          </div>
          <Footer beVersion={beVersion.value?.v || '2.0.3'} />
        </section>
      </main>
      <ChineseSelectionPopup />
    </>
  );
});
