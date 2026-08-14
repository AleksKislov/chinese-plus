import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

export type UploadedImage = { url: string };

export const useUploadBlogImage = globalAction$(
  async (params, ev): Promise<UploadedImage | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;

    const formData = new FormData();
    formData.append('image', params.image);

    try {
      const res = await fetch(`${ApiService.baseUrl}/api/blogs/upload-image`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log('[upload image fail]', err);
      return null;
    }
  },
  zod$({
    image: z.instanceof(Blob),
  }),
);
