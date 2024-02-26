import { component$ } from "@builder.io/qwik";

export const ParagNum = component$(({ num }: { num: number }) => (
  <div class='absolute right-1 -top-1'>
    <div class='tooltip tooltip-left text-sm text-info' data-tip={`Параграф ${num}`}>
      {num}
    </div>
  </div>
));
