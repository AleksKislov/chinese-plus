import { routeLoader$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';

// Ids (hskword2025 _id) of the words in the user's HSK 3.0 list - marks them in the HSK 3.0
// tables. Shared by /hsk/3/table and /hsk/3/search, which re-export it to register it.

// eslint-disable-next-line qwik/loader-location
export const useGetUserHsk3WordIds = routeLoader$(async ({ cookie }): Promise<string[]> => {
  const token = getTokenFromCookie(cookie);
  if (!token) return [];
  return ApiService.get('/api/userhsk3words/ids', token, []);
});
