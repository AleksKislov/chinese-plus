import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { parseURL } from "~/misc/helpers/tools/parse-url";
import { validURL } from "~/misc/helpers/tools/valid-url";

export const TextSource = component$(({ source }: { source: string }) => {
  const mouseIn = useSignal(0);

  return !source ? null : (
    <div class={"flex"}>
      <span class='font-bold'>Источник: </span>
      {validURL(source) ? (
        <Link href={parseURL(source)?.href} target='_blank'>
          <div
            onMouseEnter$={() => (mouseIn.value = 1)}
            onMouseOut$={() => (mouseIn.value = 0)}
            class={`badge badge-outline ml-1 ${mouseIn.value ? "badge-secondary" : "badge-accent"}`}
          >
            ссылка
          </div>
        </Link>
      ) : (
        <span class={"pl-1"}>{source}</span>
      )}
    </div>
  );
});
