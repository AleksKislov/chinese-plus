import { component$ } from '@builder.io/qwik';
import { SOCIAL_URLS } from './our-social-media';
import { maxSvg, telegramSvg, vkSvg } from './svg';

const channels = [
  { name: 'TG', href: SOCIAL_URLS.telegram, svg: telegramSvg },
  { name: 'VK', href: SOCIAL_URLS.vk, svg: vkSvg },
  { name: 'MAX', href: SOCIAL_URLS.max, svg: maxSvg },
];

// shown at the end of texts, book chapters, blog posts and videos, above the comments
export const SubscribeCta = component$(() => {
  return (
    <div class="card bg-base-200 mt-6 mb-4">
      <div class="card-body py-4 gap-3">
        <p>Понравилось? Подпишитесь, чтобы не пропустить новый контент!</p>
        <div class="flex flex-wrap gap-2">
          {channels.map(({ name, href, svg }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-outline gap-2"
            >
              {svg}
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});
