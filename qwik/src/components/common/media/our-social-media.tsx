import { component$ } from '@builder.io/qwik';
import { maxSvg, rutubeSvg, telegramSvg, vkSvg, youtubeSvg } from './svg';
import { Link } from '@builder.io/qwik-city';

export const SOCIAL_URLS = {
  telegram: 'https://t.me/chineseplusnew',
  youtube: 'https://www.youtube.com/c/Buyilehuorg',
  vk: 'https://vk.com/buyilehu',
  max: 'https://max.ru/channel_chineseplus',
  rutube: 'https://rutube.ru/channel/4396816',
};

export const OurSocialMedia = component$(() => {
  const socMedia = [
    { href: SOCIAL_URLS.telegram, svg: telegramSvg },
    { href: SOCIAL_URLS.youtube, svg: youtubeSvg },
    { href: SOCIAL_URLS.vk, svg: vkSvg },
    { href: SOCIAL_URLS.max, svg: maxSvg },
    { href: SOCIAL_URLS.rutube, svg: rutubeSvg },
  ];

  return (
    <>
      {socMedia.map(({ href, svg }, ind) => (
        <Link prefetch="js" href={href} target={'_blank'} class={'pl-2 hover:text-info'} key={ind}>
          {svg}
        </Link>
      ))}
    </>
  );
});
