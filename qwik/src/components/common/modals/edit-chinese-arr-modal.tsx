import { $, component$, useStore } from "@builder.io/qwik";
import { globalAction$ } from "@builder.io/qwik-city";
import { getTokenFromCookie } from "~/misc/actions/auth";
import { ApiService } from "~/misc/actions/request";

export const useEditChineseArr = globalAction$((body, ev) => {
  const token = getTokenFromCookie(ev.cookie);
  return ApiService.put(`/api/texts/edit-chinese-arr`, body, token, {});
});

type EditChineseArrProps = { chineseArr: string[]; modalId: string; textId: ObjectId };

export const EditChineseArrModal = component$(
  ({ chineseArr, modalId, textId }: EditChineseArrProps) => {
    const editChineseArr = useEditChineseArr();
    const newChineseArr = useStore({ value: chineseArr.join(" ").split("\n") });

    const submitEdition = $(async () => {
      const readyChineseArr = newChineseArr.value.join(" \n ").split(" ").filter(Boolean);
      const originText = newChineseArr.value.map((x) => x.trim());
      // console.log({ originText });
      await editChineseArr.submit({ textId, chineseArr: readyChineseArr, originText });
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
              <div class={"text-2xl mr-2"}>Редактировать chinese_arr</div>
            </div>

            {newChineseArr.value.map((parag, ind) => (
              <div class='form-control w-full' key={ind}>
                <label class='label'>
                  <span class='label-text'>#{ind + 1}</span>
                </label>
                <textarea
                  class='textarea textarea-bordered h-24'
                  placeholder='汉字...'
                  value={parag}
                  onKeyDown$={(e) => {
                    // console.log(e.target.value);
                    // @ts-ignore
                    newChineseArr.value[ind] = e.target.value;
                  }}
                ></textarea>
              </div>
            ))}
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
