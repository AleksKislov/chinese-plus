import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';

// wordId: hskword2025 _id (current HSK 3.0 list)
export const useRemoveUserHsk3Word = globalAction$(async (params, ev): Promise<object | null> => {
  const token = getTokenFromCookie(ev.cookie);
  if (!token) return null;
  return ApiService.delete(`/api/userhsk3words/${params.wordId}`, token, null);
}, zod$({ wordId: z.string().regex(/^[0-9a-f]{24}$/) }));
