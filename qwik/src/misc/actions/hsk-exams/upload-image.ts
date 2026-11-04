import { globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';

export type HskExamImageDescriptor = {
  slug: string;
  sectionType: 'listening' | 'reading' | 'writing';
  partInd: number;
  target: 'question' | 'bank' | 'option' | 'bank-combined';
  questionInd?: number;
  label?: string;
  // True when this picture belongs to a worked example (part.examples) rather
  // than a real question - examples are numbered in their own namespace, so
  // this disambiguates which array/storage-key convention to use server-side.
  isExample?: boolean;
};

export type UploadedHskExamImage = { url: string };

// Same shape/approach as useUploadBlogImage: raw fetch with FormData, since
// globalAction$ can't post multipart through ApiService's JSON-only helpers.
export const useUploadHskExamImage = globalAction$(
  async (params, ev): Promise<UploadedHskExamImage | null> => {
    const token = ev.cookie.get('token')?.value;
    if (!token) return null;

    const { slug, image, ...descriptor } = params;
    const formData = new FormData();
    formData.append('image', image);
    Object.entries(descriptor).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });

    try {
      const res = await fetch(`${ApiService.baseUrl}/api/hsk-exams/${slug}/image`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.log('[hsk exam image upload fail]', err);
      return null;
    }
  },
  // Submitted as a FormData (see AdminImageSlot) rather than a plain object -
  // a File can't cross Qwik's own action-argument serialization otherwise
  // (verifySerializable rejects it; FormData is the one input shape Qwik
  // forwards as a real multipart request instead of trying to serialize it).
  // FormData values are always strings except the file itself, hence coerce.
  zod$({
    slug: z.string(),
    sectionType: z.enum(['listening', 'reading', 'writing']),
    partInd: z.coerce.number(),
    target: z.enum(['question', 'bank', 'option', 'bank-combined']),
    questionInd: z.coerce.number().optional(),
    label: z.string().optional(),
    // Only ever sent when true (AdminImageSlot omits the field otherwise) -
    // z.coerce.boolean() treats ANY non-empty string as true, including "false".
    isExample: z.coerce.boolean().optional(),
    image: z.instanceof(Blob),
  }),
);
