import type { Cookie } from '@builder.io/qwik-city';

/**
 * Where to go after login / registration, from `/login?next=…` (e.g. "add to my words" in the
 * browser extension: /dictionary/<word>?add=1). Kept in a cookie, because Google OAuth
 * (BE /api/auth/google -> /login_success/<token>) can't carry it in the URL, and the user may go
 * from /login to /register.
 */
const LOGIN_NEXT_COOKIE = 'login_next';

/**
 * A path on this site only: not another host ("//evil.com", "/\evil.com"), printable ASCII only
 * (it becomes a Location header; non-ASCII is percent-encoded in a real URL).
 */
export const safeNextPath = (next: string | null | undefined): string | null =>
  next && next.length <= 500 && /^\/(?![/\\])[\x21-\x7e]*$/.test(next) ? next : null;

export const loginUrl = (next: string) => `/login?next=${encodeURIComponent(next)}`;

/** Saves a valid `next` for after the login; anything else forgets an old one. */
export function rememberLoginNext(cookie: Cookie, next: string | null) {
  const path = safeNextPath(next);
  if (!path) {
    cookie.delete(LOGIN_NEXT_COOKIE, { path: '/' });
    return;
  }
  cookie.set(LOGIN_NEXT_COOKIE, path, {
    maxAge: [1, 'hours'],
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

/** The page to open once logged in (the saved `next` or /me); forgets the saved one. */
export function takeLoginNext(cookie: Cookie): string {
  const next = safeNextPath(cookie.get(LOGIN_NEXT_COOKIE)?.value);
  if (cookie.has(LOGIN_NEXT_COOKIE)) cookie.delete(LOGIN_NEXT_COOKIE, { path: '/' });
  return next || '/me';
}
