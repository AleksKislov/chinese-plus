import { component$ } from "@builder.io/qwik";

export const ContentLen = component$(({ len }: { len: number }) => {
  return (
    <div>
      <span class='font-bold'>Длина: </span>
      <div class='badge badge-accent badge-outline'>{len}</div> 字
    </div>
  );
});
