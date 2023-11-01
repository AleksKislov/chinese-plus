import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { alertsContext } from "~/root";
// import { markUpRuText } from "~/misc/helpers/translation";

export const useEditWord = globalAction$((body, ev) => {
  const token = ev.cookie.get("token")?.value;
  return ApiService.put(`/api/dictionary/updateWord`, body, token, {});
}, zod$({ id: z.string(), pinyin: z.string(), russian: z.string() }));

export const EditWordModal = component$(
  ({ word, modalId }: { word: DictWord; modalId: string }) => {
    const editWord = useEditWord();
    const { chinese, pinyin, russian } = word;
    const newPinyin = useSignal(pinyin || "");
    const alertsState = useContext(alertsContext);

    useTask$(({ track }) => {
      track(() => pinyin);
      newPinyin.value = pinyin || "";
    });

    const submitEdition = $(async () => {
      const newPy = newPinyin.value.trim();

      if (!newPy) {
        return alertsState.push({ text: "Пиньинь не может быть пустым", bg: "alert-error" });
      }
      await editWord.submit({ id: word._id, pinyin: newPy, russian });
      location.reload();
    });

    return (
      <div class='text-base-content'>
        <input type='checkbox' id={modalId} class='modal-toggle' />
        <label class='modal text-left' for={modalId}>
          <label class='modal-box relative' for=''>
            <label for={modalId} class='btn btn-sm btn-circle absolute right-2 top-2'>
              ✕
            </label>

            <div class={"flex flex-row mb-2"}>
              <div class={"text-2xl mr-2"}>Редактировать слово: {chinese}</div>
            </div>

            <small class={"text-error"}>Пока можно редактировать только пиньинь</small>

            <div class='form-control w-full max-w-xs'>
              <label class='label'>
                <span class='label-text'>Пиньинь</span>
              </label>
              <input
                type='text'
                placeholder='Новый пиньинь'
                class='input input-bordered w-full max-w-xs'
                value={newPinyin.value}
                onKeyUp$={(e) => {
                  newPinyin.value = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            <div class='modal-action'>
              <label for={modalId} class='btn btn-info btn-outline btn-sm' onClick$={submitEdition}>
                Отредактировать
              </label>
            </div>
          </label>
        </label>
      </div>
    );
  }
);
