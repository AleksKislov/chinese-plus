import { component$ } from "@builder.io/qwik";

export const Loader = component$(() => {
  return <span class='loading loading-spinner loading-lg'></span>;
});
