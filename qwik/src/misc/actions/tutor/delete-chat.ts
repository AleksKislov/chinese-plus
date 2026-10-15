import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';
import { OBJECT_ID_RE } from '~/components/tutor/types';

export const useDeleteTutorChat = globalAction$(
  async ({ chatId }, ev): Promise<{ status: 'done' } | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    return ApiService.delete(`/api/tutor/chats/${chatId}`, token, null);
  },
  zod$({ chatId: z.string().regex(OBJECT_ID_RE) }),
);
