import { component$ } from "@builder.io/qwik";

export const Brand = component$(({ isMobile }: { isMobile?: boolean }) => {
  return (
    <span>
      Chinese
      <span class={`text-success font-extrabold ${isMobile ? "text-3xl" : "text-2xl"}`}>+</span>
    </span>
  );
});
