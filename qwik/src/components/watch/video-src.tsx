import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { YoutubeService } from "~/misc/actions/youtube-service";

export const VideoSrc = component$(({ src }: { src: string }) => {
  const mouseIn = useSignal(0);
  return (
    <div class={"flex"}>
      <span class='font-bold'>Ссылка: </span>
      <Link href={YoutubeService.getSrcLink(src)} target='_blank'>
        <div
          onMouseEnter$={() => (mouseIn.value = 1)}
          onMouseOut$={() => (mouseIn.value = 0)}
          class={`badge badge-outline ml-1 ${mouseIn.value ? "badge-secondary" : "badge-accent"}`}
        >
          youtube
        </div>
      </Link>
    </div>
  );
});
