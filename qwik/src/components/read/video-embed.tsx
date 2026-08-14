import { component$ } from '@builder.io/qwik';

type VideoEmbedProps = { src: string };

// classic padding-box responsive embed, doesn't depend on aspect-ratio CSS support
export const VideoEmbed = component$(({ src }: VideoEmbedProps) => {
  return (
    <div class="relative w-full rounded-md overflow-hidden not-prose" style="padding-top: 56.25%">
      <iframe
        src={src}
        class="absolute inset-0 w-full h-full border-0"
        allowFullscreen
        title="video"
      ></iframe>
    </div>
  );
});
