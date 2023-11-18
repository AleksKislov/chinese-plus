import { component$ } from "@builder.io/qwik";
import { CategoryBadge } from "./category-badge";

export const ContentCat = component$(({ txt }: { txt: string }) => {
  return (
    <div>
      <span class={"font-bold"}>Категория: </span>
      <CategoryBadge txt={txt} />
    </div>
  );
});
