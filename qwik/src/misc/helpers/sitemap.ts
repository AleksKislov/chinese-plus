export type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

// Qwik City 301s every slashless path to its "/" twin, so list the URL a crawler
// lands on. The slash goes on the path, before any ?query.
const withSlash = (loc: string) => {
  const [path, query] = loc.split('?');
  return `${path.endsWith('/') ? path : `${path}/`}${query ? `?${query}` : ''}`;
};

const escapeXml = (str: string) => str.replace(/&/g, '&amp;');

export const toSitemapXml = (urls: SitemapUrl[]): string => {
  const entries = urls
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(withSlash(loc))}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};
