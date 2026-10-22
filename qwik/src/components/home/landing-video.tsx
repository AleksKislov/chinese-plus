import { component$ } from '@builder.io/qwik';
import CONST_URLS from '~/misc/consts/urls';
import { getRutubeEmbedUrl } from '~/misc/helpers/content/rutube';

// Rutube instead of YouTube: YouTube is heavily throttled/unreachable without a VPN for a large
// share of our Russian audience. The iframe loads lazily - the video is below the feature cards,
// so the heavy player doesn't slow down the first screen.
export const LandingVideo = component$(() => {
  return (
    <div class="my-8 mx-auto w-full max-w-2xl">
      <div class="aspect-w-16 aspect-h-9">
        <iframe
          src={getRutubeEmbedUrl(CONST_URLS.landingRutubeId)}
          title="Как устроен Chinese+"
          loading="lazy"
          allow="clipboard-write; autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullscreen
          class="rounded-lg shadow-lg w-full h-full border-0"
        />
      </div>
    </div>
  );
});
