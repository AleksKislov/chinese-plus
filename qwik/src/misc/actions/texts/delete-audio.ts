import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

export const useDeleteTextAudio = globalAction$(
  async (params, ev): Promise<{ status: 'done' } | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;
    return ApiService.delete(`/api/texts/delete-audio/${params.textId}`, token);
  },
  zod$({ textId: z.string() }),
);
