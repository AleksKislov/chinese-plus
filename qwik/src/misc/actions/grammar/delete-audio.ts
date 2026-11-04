import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

// file: '{hash}.mp3' — the last part of an example's `audio` path
export const useDeleteGrammarAudio = globalAction$(
  async (params, ev): Promise<{ status: 'done'; topics: number } | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;
    return ApiService.delete(`/api/grammar/audio/${params.file}`, token, null);
  },
  zod$({ file: z.string().regex(/^[0-9a-f]{16}\.mp3$/) }),
);
