import { component$ } from "@builder.io/qwik";

export const ContentCat = component$(({ txt }: { txt: string }) => {
  return (
    <div>
      <span class={"font-bold"}>Категория: </span>
      <div class='badge badge-accent badge-outline'>{txt}</div>
    </div>
  );
});
