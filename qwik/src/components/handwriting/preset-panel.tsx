import { component$, type QRL, type ReadonlySignal } from '@builder.io/qwik';
import { type SavedSettings } from './settings';

// The settings saved for the model font on /admin/handwriting/ (settings.ts): what changed
// since, save / restore / delete. A component of its own: the list of changes is recomputed on
// every slider step, and only this part is rendered again, not the whole page.
type Props = {
  fontName: ReadonlySignal<string>;
  loaded: ReadonlySignal<boolean>; // the font's settings are on the page
  preset: ReadonlySignal<SavedSettings | null>;
  diff: ReadonlySignal<[string, string, string][]>; // [label, saved, now]
  busy: ReadonlySignal<boolean>;
  msg: ReadonlySignal<string>;
  onSave$: QRL<() => void>;
  onRestore$: QRL<() => void>;
  onDelete$: QRL<() => void>;
};

export const PresetPanel = component$<Props>(
  ({ fontName, loaded, preset, diff, busy, msg, onSave$, onRestore$, onDelete$ }) => {
    return (
      <div class="mt-4 max-w-xl text-sm border border-base-300 rounded p-3">
        <div class="font-semibold mb-1">Настройки шрифта {fontName.value}</div>
        {!loaded.value ? (
          <div class="text-xs opacity-70">Загружаются…</div>
        ) : (
          <>
            {preset.value ? (
              <div class="text-xs">
                Сохранены {new Date(preset.value.updatedAt).toLocaleDateString('ru-RU')}
                {diff.value.length ? (
                  <>
                    . Изменено с тех пор:
                    <ul class="list-disc ml-5 my-1">
                      {diff.value.map(([label, was, now]) => (
                        <li key={label}>
                          {label}: {was} → {now}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <span class="text-success">, текущие совпадают с ними</span>
                )}
              </div>
            ) : (
              <div class="text-xs opacity-70">
                Для этого шрифта настройки не сохранены: сейчас рабочие настройки этого браузера
              </div>
            )}
            <div class="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                class="btn btn-xs btn-primary"
                disabled={busy.value || Boolean(preset.value && !diff.value.length)}
                onClick$={onSave$}
              >
                {preset.value ? 'Сохранить текущие вместо них' : 'Сохранить для шрифта'}
              </button>
              {preset.value && (
                <>
                  <button
                    type="button"
                    class="btn btn-xs"
                    disabled={!diff.value.length}
                    onClick$={onRestore$}
                  >
                    Вернуть сохранённые
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-ghost text-error"
                    disabled={busy.value}
                    onClick$={onDelete$}
                  >
                    Удалить сохранённые
                  </button>
                </>
              )}
            </div>
          </>
        )}
        {msg.value && <div class="mt-2 text-xs">{msg.value}</div>}
      </div>
    );
  },
);
