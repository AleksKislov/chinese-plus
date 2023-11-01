import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { globalAction$, z, zod$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { alertsContext, userContext } from "~/root";

export const useEditDailyGoal = globalAction$((params, ev) => {
  const token = ev.cookie.get("token")?.value;
  ApiService.post(`/api/users/daily_reading_goal/${params.num}`, {}, token);
}, zod$({ num: z.number().positive() }));

export const EditReadGoalModal = component$(
  ({ modalId, prevNum }: { modalId: string; prevNum: number }) => {
    const editGoal = useEditDailyGoal();
    const newNum = useSignal("" + prevNum);
    const alertsState = useContext(alertsContext);
    const userState = useContext(userContext);

    const submitEdition = $(async () => {
      const num = parseInt(newNum.value);
      if (!num || num < 0) {
        return alertsState.push({ text: "Нужно положительное число", bg: "alert-error" });
      }
      await editGoal.submit({ num });
      userState.readDailyGoal = num;
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
              <div class={"text-2xl mr-2"}>Поменять цель на день</div>
            </div>

            <div class='form-control w-full max-w-xs'>
              <input
                type='text'
                placeholder='Новая цель'
                class='input input-bordered w-full max-w-xs'
                value={newNum.value}
                onKeyUp$={(e) => {
                  newNum.value = (e.target as HTMLInputElement).value;
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
