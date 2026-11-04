import { component$, useSignal } from '@builder.io/qwik';
import {
  useUploadHskExamImage,
  type HskExamImageDescriptor,
} from '~/misc/actions/hsk-exams/upload-image';
import { useDeleteHskExamImage } from '~/misc/actions/hsk-exams/delete-image';

type Props = HskExamImageDescriptor & {
  hasImage: boolean;
  size?: number;
};

/**
 * Admin-only upload/replace/remove control for one exam picture - a question's
 * own image, one lettered option's image, or one bank entry's image. Renders
 * next to (not instead of) the existing <img>, which already fails silently
 * when hasImage is false or the file hasn't been generated yet.
 *
 * A full page reload after a change is deliberate, not a shortcut: the public
 * read endpoints are cached server-side, but an admin's requests bypass that
 * cache entirely (see optional-admin-auth.js), so a reload always shows the
 * true current state - no client-side cache-busting needed.
 *
 * Descriptor fields are destructured individually (not spread) because Qwik's
 * $ boundaries need a plain serializable object - a rest-spread object is
 * flagged by qwik/valid-lexical-scope even though it looks like one.
 */
export const AdminImageSlot = component$<Props>(
  ({ slug, sectionType, partInd, target, questionInd, label, isExample, hasImage, size = 90 }) => {
    const uploadImage = useUploadHskExamImage();
    const deleteImage = useDeleteHskExamImage();
    const busy = useSignal(false);
    const error = useSignal('');

    return (
      <div class="flex flex-col items-center gap-1 mt-1" style={{ width: `${size}px` }}>
        <label class="btn btn-2xs btn-outline w-full">
          {hasImage ? 'Заменить' : 'Загрузить'}
          <input
            type="file"
            accept="image/*"
            class="hidden"
            disabled={busy.value}
            onChange$={async (_, el) => {
              const file = el.files?.[0];
              el.value = '';
              if (!file) return;
              busy.value = true;
              error.value = '';

              // Must be a FormData, not a plain object with a File property -
              // Qwik tries to serialize a submitted object's values through its
              // own resumability system, which rejects File instances outright.
              // FormData is the one shape Qwik forwards as a real multipart
              // request instead (same pattern as BlogImagePicker).
              const formData = new FormData();
              formData.append('slug', slug);
              formData.append('sectionType', sectionType);
              formData.append('partInd', String(partInd));
              formData.append('target', target);
              if (questionInd !== undefined) formData.append('questionInd', String(questionInd));
              if (label !== undefined) formData.append('label', label);
              // Never append when false - z.coerce.boolean() on the receiving
              // end treats any non-empty string (including "false") as true.
              if (isExample) formData.append('isExample', '1');
              formData.append('image', file);

              const res = await uploadImage.submit(formData);
              busy.value = false;
              if (res.value) window.location.reload();
              else error.value = 'Не удалось загрузить';
            }}
          />
        </label>

        {hasImage && (
          <button
            type="button"
            class="btn btn-2xs btn-outline btn-error w-full"
            disabled={busy.value}
            onClick$={async () => {
              if (!window.confirm('Удалить картинку?')) return;
              busy.value = true;
              error.value = '';
              const res = await deleteImage.submit({
                slug,
                sectionType,
                partInd,
                target,
                questionInd,
                label,
                isExample,
              });
              busy.value = false;
              if (res.value) window.location.reload();
              else error.value = 'Не удалось удалить';
            }}
          >
            Удалить
          </button>
        )}

        {error.value && <span class="text-error text-xs">{error.value}</span>}
      </div>
    );
  },
);
