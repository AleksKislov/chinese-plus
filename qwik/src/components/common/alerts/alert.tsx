import { component$, type QRL } from '@builder.io/qwik';
import { type Alert } from '~/root';

export const SingleAlert = component$(({ alert, onClose$ }: { alert: Alert; onClose$: QRL<() => void> }) => {
  const { bg, text } = alert;

  return (
    <div class={`alert ${bg} flex justify-between gap-2`}>
      <span>{text}</span>
      <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Закрыть" onClick$={onClose$}>
        ✕
      </button>
    </div>
  );
});
