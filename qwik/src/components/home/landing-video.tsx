import { component$ } from '@builder.io/qwik';
import CONST_URLS from '~/misc/consts/urls';

// Self-hosted (Yandex Object Storage) instead of a YouTube embed: YouTube is heavily
// throttled/unreachable without a VPN for a large share of our Russian audience, which made
// this hero video effectively broken for them.
export const LandingVideo = component$(() => {
  return (
    <div class="grid grid-cols-6 my-6">
      <div></div>

      <div class="lg:col-span-4 col-span-6">
        <div class="aspect-w-16 aspect-h-9">
          <video
            class="rounded-lg shadow-lg w-full h-full"
            controls
            preload="metadata"
            poster={CONST_URLS.landingVideoPoster}
          >
            <source src={CONST_URLS.landingVideoUrl} type="video/mp4" />
          </video>
        </div>
      </div>

      <div></div>
    </div>
  );
});
