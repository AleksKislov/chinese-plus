import type { RequestEventLoader } from '@builder.io/qwik-city';

const VISITOR_COOKIE = 'vid';

// A stable per-browser id, kept for a year. This only identifies "who is
// asking" - the backend decides how long a single visit counts as one
// session before a repeat view increments the hits counter again.
export function getOrSetVisitorId({ cookie }: RequestEventLoader): string {
  const existing = cookie.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;

  const id = crypto.randomUUID();
  cookie.set(VISITOR_COOKIE, id, {
    maxAge: [365, 'days'],
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return id;
}
