import { component$, useComputed$ } from '@builder.io/qwik';
import { type BlogVideoBlock, getVideoEmbedUrl } from '~/misc/helpers/content';

export const VideoBlockEditor = component$(({ block }: { block: BlogVideoBlock }) => {
  const embedUrl = useComputed$(() => getVideoEmbedUrl(block.url));

  return (
    <div>
      <input
        type="text"
        placeholder="Ссылка на видео (YouTube, Vimeo и т.д.)"
        class="input input-bordered input-sm w-full"
        value={block.url}
        onChange$={(e) => (block.url = (e.target as HTMLInputElement).value)}
      />
      {embedUrl.value && (
        <div class="max-h-64 aspect-video w-fit mx-auto mt-2">
          <iframe
            src={embedUrl.value}
            class="w-full h-full rounded-md"
            allowFullscreen
            title="video"
          ></iframe>
        </div>
      )}
    </div>
  );
});
