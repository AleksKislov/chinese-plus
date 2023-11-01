import { component$, Slot } from "@builder.io/qwik";

export const FlexRow = component$(() => {
  return (
    <div class='flex flex-col md:flex-row mb-3'>
      <Slot />
    </div>
  );
});
