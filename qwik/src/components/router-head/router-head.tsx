import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';

const DEFAULT_OG_IMAGE = `${CONST_URLS.siteUrl}/img/og/chineseplus.png`;

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();
  // A page may set its own canonical (e.g. HSK word lists keep ?pg=, book chapters ?page=); otherwise
  // the path without query params is canonical.
  const hasOwnCanonical = head.links.some((l) => l.rel === 'canonical');

  // Link-preview (Open Graph) fallbacks for pages that don't set their own, so a
  // link shared in Telegram/VK always gets a title, description and picture.
  const hasMeta = (attr: 'name' | 'property', value: string) =>
    head.meta.some((m) => m[attr] === value);
  const description = head.meta.find((m) => m.name === 'description')?.content;
  const canonical =
    head.links.find((l) => l.rel === 'canonical')?.href || CONST_URLS.siteUrl + loc.url.pathname;
  const ogDefaults = [
    { property: 'og:site_name', content: 'Chinese+' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: head.title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonical },
    { property: 'og:image', content: DEFAULT_OG_IMAGE },
  ].filter((m) => m.content && !hasMeta('property', m.property));
  const needsTwitterCard = !hasMeta('name', 'twitter:card');

  return (
    <>
      <title>{head.title}</title>

      {!hasOwnCanonical && <link rel="canonical" href={loc.url.origin + loc.url.pathname} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {/* meta/og/links/styles are siblings - keys must be unique across all of them, or
          Qwik's diff crashes on client navigation (elmToMove is undefined) */}
      {head.meta.map((m, ind) => (
        <meta key={`meta-${ind}`} {...m} />
      ))}

      {ogDefaults.map((m) => (
        <meta key={`og-${m.property}`} {...m} />
      ))}
      {needsTwitterCard && <meta name="twitter:card" content="summary_large_image" />}

      {head.links.map((l, ind) => (
        <link key={`link-${ind}`} {...l} />
      ))}

      {head.styles.map((s, ind) => (
        <style key={`style-${ind}`} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}
    </>
  );
});
