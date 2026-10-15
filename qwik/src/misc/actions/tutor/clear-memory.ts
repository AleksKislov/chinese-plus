import { globalAction$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';

export const useClearTutorMemory = globalAction$(
  async (_params, ev): Promise<{ status: 'done' } | null> => {
    const token = getTokenFromCookie(ev.cookie);
    if (!token) return null;
    return ApiService.delete('/api/tutor/memory', token, null);
  },
);
