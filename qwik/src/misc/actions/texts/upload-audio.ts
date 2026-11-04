import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

export type UploadedAudio = { status: 'done' };

export const useUploadTextAudio = globalAction$(
  async (params, ev): Promise<UploadedAudio | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;

    const formData = new FormData();
    formData.append('audio', params.audio);
    formData.append('textId', params.textId);

    try {
      const res = await fetch(`${ApiService.baseUrl}/api/texts/upload-audio`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log('[upload audio fail]', err);
      return null;
    }
  },
  zod$({
    audio: z.instanceof(Blob),
    textId: z.string(),
  }),
);
