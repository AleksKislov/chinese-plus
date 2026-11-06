import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

// admin only (checked by the BE); rutubeUrl '' removes the Rutube player
export const useSetLessonRutube = globalAction$(
  async (params, ev): Promise<{ status: 'done'; rutubeSource: string } | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;
    return ApiService.post(
      `/api/videos/video-lessons/${params.lessonId}/rutube`,
      { rutubeUrl: params.rutubeUrl },
      token,
      null,
    );
  },
  zod$({ lessonId: z.string().regex(/^[0-9a-f]{24}$/), rutubeUrl: z.string() }),
);
