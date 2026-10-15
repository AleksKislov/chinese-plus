import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';
import { OBJECT_ID_RE, type SendTutorMessageResult, TUTOR_MAX_LEN } from '~/components/tutor/types';

const FAILED = 'Учитель не смог ответить, попробуйте ещё раз';

// runs on the FE server (PUBLIC_BASE_URL is not reachable from the browser in production).
// Plain fetch instead of ApiService: the BE error message (daily limit etc.) is shown to the user.
export const useSendTutorMessage = globalAction$(
  async ({ chatId, text, level }, ev): Promise<SendTutorMessageResult> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return { error: 'Войдите, чтобы говорить с учителем' };

    try {
      const res = await fetch(`${ApiService.baseUrl}/api/tutor/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ chatId, text, level }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) return { error: data?.msg || FAILED };
      return data;
    } catch (err) {
      console.log('[tutor] send message failed', err);
      return { error: FAILED };
    }
  },
  zod$({
    chatId: z.string().regex(OBJECT_ID_RE).optional(),
    text: z.string().trim().min(1).max(TUTOR_MAX_LEN),
    level: z.number().int().min(1).max(6),
  }),
);
