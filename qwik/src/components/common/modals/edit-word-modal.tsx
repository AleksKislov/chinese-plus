import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { globalAction$, Link, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { alertsContext } from '~/root';

// quick pinyin edit; the translation and examples are edited on /dictionary/edit/[id]
export const useEditWord = globalAction$((body, ev) => {
  const token = ev.cookie.get('token')?.value;
  return ApiService.put(`/api/dictionary/updateWord`, body, token, {});
}, zod$({ id: z.string(), pinyin: z.string() }));

export const EditWordModal = component$(
  ({ word, modalId }: { word: DictWord; modalId: string }) => {
    const editWord = useEditWord();
    const { chinese, pinyin } = word || {};
    const newPinyin = useSignal(pinyin || '');
    const alertsState = useContext(alertsContext);

    useTask$(({ track }) => {
      track(() => pinyin);
      newPinyin.value = pinyin || '';
    });

    const submitEdition = $(async () => {
      const newPy = newPinyin.value.trim();

      if (!newPy) {
        return alertsState.push({ text: 'Пиньинь не может быть пустым', bg: 'alert-error' });
      }
      await editWord.submit({ id: String(word._id), pinyin: newPy });
      location.reload();
    });

    return (
      <div class="text-base-content">
        <input type="checkbox" id={modalId} class="modal-toggle" />
        <label class="modal text-left" for={modalId}>
          <label class="modal-box relative" for="">
            <label for={modalId} class="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </label>

            <div class={'flex flex-row mb-2'}>
              <div class={'text-2xl mr-2'}>Редактировать слово: {chinese}</div>
            </div>

            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Пиньинь</span>
              </label>
              <input
                type="text"
                placeholder="Новый пиньинь"
                class="input input-bordered w-full max-w-xs"
                value={newPinyin.value}
                onKeyUp$={(e) => {
                  newPinyin.value = (e.target as HTMLInputElement).value;
                }}
              />
            </div>

            <Link
              prefetch="js"
              href={'/dictionary/edit/' + String(word._id)}
              class="link link-hover link-secondary text-sm mt-2 inline-block"
            >
              Полное редактирование: перевод и примеры →
            </Link>

            <div class="modal-action">
              <label for={modalId} class="btn btn-info btn-outline btn-sm" onClick$={submitEdition}>
                Отредактировать
              </label>
            </div>
          </label>
        </label>
      </div>
    );
  },
);
