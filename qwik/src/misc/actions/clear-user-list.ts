import { server$ } from '@builder.io/qwik-city';
import { ApiService } from './request';
import { getTokenFromCookie } from './auth';

// the user's word lists that can be emptied at once ("Очистить список" on their /me pages)
export type UserListKind = 'words' | 'hsk2' | 'hsk3';

const LIST_API: Record<UserListKind, string> = {
  words: '/api/userwords', // /me/words: words from the dictionary and texts
  hsk2: '/api/words', // /me/hsk/2
  hsk3: '/api/userhsk3words', // /me/hsk/3
};

// server$: runs on the FE server (see CLAUDE.md); the page reloads afterwards anyway, so an
// action re-running every route loader first would be wasted
export const clearUserList = server$(async function (
  kind: UserListKind,
): Promise<{ deleted: number } | { error: string }> {
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: 'Войдите на сайт' };
  const path = LIST_API[kind];
  if (!path) return { error: 'Неизвестный список' };
  const res = await ApiService.delete(path, token, null);
  return typeof res?.deleted === 'number'
    ? { deleted: res.deleted }
    : { error: 'Не удалось очистить список, попробуйте ещё раз' };
});
