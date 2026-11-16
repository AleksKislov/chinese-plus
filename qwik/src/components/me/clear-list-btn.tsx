import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { AlertColorEnum, alertsContext } from '~/root';
import { clearUserList, type UserListKind } from '~/misc/actions/clear-user-list';

// the second press must come within this time, else the button resets
const CONFIRM_MS = 4000;

/**
 * "Очистить список" for one of the user's word lists: the first press asks "Точно?", the second
 * deletes all its words and reloads the page (the pages keep their lists in local signals).
 */
export const ClearListBtn = component$(({ kind }: { kind: UserListKind }) => {
  const alertsState = useContext(alertsContext);
  const confirming = useSignal(false);
  const busy = useSignal(false);
  const resetTimer = useSignal(0);

  const onClick = $(async () => {
    if (busy.value) return;
    if (!confirming.value) {
      confirming.value = true;
      resetTimer.value = window.setTimeout(() => (confirming.value = false), CONFIRM_MS);
      return;
    }
    clearTimeout(resetTimer.value);
    busy.value = true;
    const result = await clearUserList(kind);
    if ('error' in result) {
      busy.value = false;
      confirming.value = false;
      alertsState.push({ bg: AlertColorEnum.error, text: result.error });
      return;
    }
    location.reload();
  });

  return (
    <button
      type="button"
      class={`btn btn-sm w-full ${confirming.value ? 'btn-error' : 'btn-info'}`}
      disabled={busy.value}
      onClick$={onClick}
    >
      {busy.value ? 'Очищаем…' : confirming.value ? 'Точно?' : 'Очистить список'}
    </button>
  );
});
