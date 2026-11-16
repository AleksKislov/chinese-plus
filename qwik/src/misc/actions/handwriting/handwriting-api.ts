import { server$, z } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';
import {
  FONT_ID_RE,
  HAN_RE,
  type HandwritingData,
  type SavedHandwriting,
} from '~/components/handwriting/types';

// /admin/handwriting/ calls made after user actions. server$: runs on the FE server
// (PUBLIC_BASE_URL is not reachable from the browser in production) and does not re-run the
// page's loaders. Plain fetch, so the BE message reaches the page.

type Failure = { error: string };

async function hwFetch<T>(
  token: string,
  method: 'GET' | 'PUT' | 'DELETE',
  path: string,
  body: object | null,
  failed: string,
): Promise<T | Failure> {
  try {
    const res = await fetch(`${ApiService.baseUrl}/api/handwriting${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) return { error: data?.msg || failed };
    return data as T;
  } catch (err) {
    console.log(`[handwriting] ${method} ${path} failed`, err);
    return { error: failed };
  }
}

const target = z.object({
  font: z.string().regex(FONT_ID_RE),
  char: z.string().regex(HAN_RE),
});

// limits and rounding are checked again on the BE
const point = z.tuple([z.number(), z.number(), z.number(), z.number()]);
const saveSchema = target.extend({
  strokes: z.array(z.array(point).min(1)).min(1).max(80),
  size: z.number(),
  pen: z.boolean(),
});

const charPath = ({ font, char }: z.infer<typeof target>) => `/${font}/${encodeURIComponent(char)}`;

export const saveHandwriting = server$(async function (
  params: { font: string; char: string } & HandwritingData,
): Promise<{ char: string; font: string } | Failure> {
  const parsed = saveSchema.safeParse(params);
  if (!parsed.success) return { error: 'Неверные данные' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: 'Войдите как админ' };
  const { strokes, size, pen } = parsed.data;
  return hwFetch(token, 'PUT', charPath(parsed.data), { strokes, size, pen }, 'Не сохранилось');
});

export const getHandwriting = server$(async function (params: {
  font: string;
  char: string;
}): Promise<SavedHandwriting | Failure> {
  const parsed = target.safeParse(params);
  if (!parsed.success) return { error: 'Неверный иероглиф' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: 'Войдите как админ' };
  return hwFetch(token, 'GET', charPath(parsed.data), null, 'Не загрузилось');
});

export const deleteHandwriting = server$(async function (params: {
  font: string;
  char: string;
}): Promise<{ char: string } | Failure> {
  const parsed = target.safeParse(params);
  if (!parsed.success) return { error: 'Неверный иероглиф' };
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: 'Войдите как админ' };
  return hwFetch(token, 'DELETE', charPath(parsed.data), null, 'Не удалилось');
});
