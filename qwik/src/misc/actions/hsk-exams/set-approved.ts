import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

export const useSetExamApproved = globalAction$(
  async (params, ev): Promise<{ slug: string; isApproved: boolean } | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;
    return ApiService.put(
      `/api/hsk-exams/${params.slug}/approve`,
      { isApproved: params.isApproved },
      token,
      null,
    );
  },
  zod$({ slug: z.string(), isApproved: z.boolean() }),
);
