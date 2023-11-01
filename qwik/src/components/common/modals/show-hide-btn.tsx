import { type Signal, component$ } from "@builder.io/qwik";

export const ShowHideBtn = component$(({ showExamples }: { showExamples: Signal<boolean> }) => {
  return (
    <div class='flex justify-end'>
      <label class='label cursor-pointer right-0'>
        {showExamples.value ? (
          <span class='label-text mr-3'>Без примеров</span>
        ) : (
          <span class='label-text mr-3'>С примерами</span>
        )}
        <input
          type='checkbox'
          class='toggle toggle-accent'
          checked={showExamples.value}
          onClick$={() => {
            showExamples.value = !showExamples.value;
          }}
        />
      </label>
    </div>
  );
});
