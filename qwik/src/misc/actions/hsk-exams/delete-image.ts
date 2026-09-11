import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

// Same descriptor as upload-image.ts, minus the file - identifies which
// question/option/bank picture to remove.
export const useDeleteHskExamImage = globalAction$(
  async (params, ev): Promise<{ status: string } | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;

    const { slug, ...descriptor } = params;
    try {
      const res = await fetch(`${ApiService.baseUrl}/api/hsk-exams/${slug}/image`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(descriptor),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log('[hsk exam image delete fail]', err);
      return null;
    }
  },
  zod$({
    slug: z.string(),
    sectionType: z.enum(['listening', 'reading', 'writing']),
    partInd: z.number(),
    target: z.enum(['question', 'bank', 'option', 'bank-combined']),
    questionInd: z.number().optional(),
    label: z.string().optional(),
    // Submitted as a genuine object here (no File involved), so a real
    // boolean - unlike upload-image.ts's FormData-coerced version.
    isExample: z.boolean().optional(),
  }),
);
