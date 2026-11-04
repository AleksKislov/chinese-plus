import { type RequestHandler } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import CONST_URLS from '~/misc/consts/urls';
import { toSitemapXml } from '~/misc/helpers/sitemap';

// Dictionary pages for HSK words only (~16k): real entries worth indexing, kept
// apart from sitemap.xml so it stays small and Search Console reports them separately.
// Listed in public/robots.txt; the 50k-URL sitemap limit is far off.
export const onGet: RequestHandler = async ({ send, headers, cacheControl }) => {
  cacheControl({ maxAge: 86400, staleWhileRevalidate: 86400 });

  const words = (await ApiService.get('/api/dictionary/sitemap-words', undefined, [])) as string[];
  const urls = words.map((word) => ({
    loc: `${CONST_URLS.siteUrl}/dictionary/${encodeURIComponent(word)}`,
  }));

  headers.set('Content-Type', 'application/xml; charset=utf-8');
  send(200, toSitemapXml(urls));
};
