import { component$, useComputed$ } from '@builder.io/qwik';
import { type DocumentHead, useLocation } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';
import { PropisiPage } from '~/components/propisi/propisi-page';
import { useSheetData } from '~/misc/loaders/propisi-loaders';
import { hskSheetPath, levelSeo, parseHskParams, propisiOgImage } from '~/components/propisi/types';

export { useSheetData, hskSheetOnGet as onGet } from '~/misc/loaders/propisi-loaders';

// /propisi/hsk-3/1/ ... /propisi/hsk-3/789/, /propisi/hsk-2/1/ ... - one page per level,
// ?part= picks the sheet and keeps the level page as canonical
export default component$(() => {
  const loc = useLocation();
  const data = useSheetData();
  const seo = useComputed$(() => {
    // fallback only while navigating away to a page without these params
    const { version, level } = parseHskParams(loc.params) || { version: '3' as const, level: '1' };
    return levelSeo(version, level, data.value.total);
  });

  return <PropisiPage seo={seo.value} faq={seo.value.faq} />;
});

export const head: DocumentHead = ({ params, resolveValue }) => {
  const { version, level } = parseHskParams(params)!;
  const { title, description } = levelSeo(version, level, resolveValue(useSheetData).total);
  const url = `${CONST_URLS.siteUrl}${hskSheetPath(version, level)}`;
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: `${CONST_URLS.siteUrl}${propisiOgImage}` },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
};
