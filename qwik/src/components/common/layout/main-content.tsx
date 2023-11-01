import { component$, Slot } from "@builder.io/qwik";

export const MainContent = component$(() => {
  return (
    <div class='w-full md:w-3/4'>
      <Slot />
    </div>
  );
});
