import { component$, Slot } from "@builder.io/qwik";

export const Sidebar = component$(() => {
  return (
    <div class='w-full md:w-1/4 mb-3 mr-4'>
      <Slot />
    </div>
  );
});
