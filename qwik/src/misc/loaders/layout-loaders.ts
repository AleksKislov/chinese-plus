import { routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { IsLightThemeCookieName } from '~/root';
import { type CommentType } from '~/components/common/comments/comment-card';

// Loaders used by header components. They live here (and are re-exported from
// routes/layout.tsx, which registers them) so that header -> layout -> header
// import cycles don't break Vite SSR.

// eslint-disable-next-line qwik/loader-location
export const getNewMentions = routeLoader$(async ({ cookie }): Promise<CommentType[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get('/api/comments/to_me/false', token, []);
});

// eslint-disable-next-line qwik/loader-location
export const useCheckTheme = routeLoader$(({ cookie }): boolean => {
  const isLightTheme = Boolean(+(cookie.get(IsLightThemeCookieName)?.value || '0'));
  return !isLightTheme;
});
