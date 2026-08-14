import { type RequestHandler } from '@builder.io/qwik-city';
import { slugify } from 'transliteration';
import { ApiService } from '~/misc/actions/request';
import CONST_URLS from '~/misc/consts/urls';
import { getBookUrl } from '~/misc/helpers/content/get-book-url';
import { type BookCardInfo } from '~/routes/read/books';

type ContentListItem = {
  _id: string;
  title: string;
  date?: string;
};

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

const STATIC_PATHS = [
  '/',
  '/read/texts',
  '/read/texts/all',
  '/read/books',
  '/read/blog',
  '/dictionary',
  '/watch/videos',
  '/watch/phonetics-lessons',
  '/watch/characters-lessons',
  '/start/how-to-start',
  '/start/pinyin-chart',
  '/start/pinyin-tests',
  '/start/radicals',
  '/start/strokes',
  '/start/textbook',
  '/start/tones-practice',
  '/hsk/2/table',
  '/hsk/2/tests',
  '/hsk/2/search',
  '/hsk/3/table',
  '/hsk/3/tests',
  '/hsk/3/search',
  '/contacts',
  '/donate',
  '/heroes',
  '/feedback',
];

// getAllApprovedTexts formats the date as a ru-RU "dd.mm.yyyy" string; every other list endpoint
// returns the raw ISO date, so this is only needed for the /api/texts/ response.
const ruDateToIso = (date?: string): string | undefined => {
  if (!date) return undefined;
  const [day, month, year] = date.split('.');
  if (!day || !month || !year) return undefined;
  return `${year}-${month}-${day}`;
};

const contentUrl = (path: string, item: ContentListItem, dateFormatter?: (d?: string) => string | undefined): SitemapUrl => ({
  loc: `${CONST_URLS.siteUrl}${path}/${slugify(item.title)}-${item._id}`,
  lastmod: (dateFormatter ? dateFormatter(item.date) : item.date)?.slice(0, 10),
});

// /api/blogs is paginated (limit 10 per page, no "get all" mode), so page through it fully.
const fetchAllApprovedBlogPosts = async (): Promise<ContentListItem[]> => {
  const posts: ContentListItem[] = [];
  let skip = 0;

  for (;;) {
    const page = (await ApiService.get(`/api/blogs?skip=${skip}`, undefined, [])) as ContentListItem[];
    if (!page.length) break;
    posts.push(...page);
    if (page.length < 10) break;
    skip += 10;
  }

  return posts;
};

const toXml = (urls: SitemapUrl[]): string => {
  const entries = urls
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};

export const onGet: RequestHandler = async ({ send, headers, cacheControl }) => {
  cacheControl({ maxAge: 3600, staleWhileRevalidate: 86400 });

  const [textsRes, videos, phoneticsLessons, charactersLessons, books, blogPosts] =
    await Promise.all([
      ApiService.get('/api/texts/', undefined, { texts: [] }) as Promise<{
        texts: ContentListItem[];
      }>,
      ApiService.get('/api/videos/all_approved', undefined, []) as Promise<ContentListItem[]>,
      ApiService.get('/api/videos/all-video-lessons?category=phonetics', undefined, []) as Promise<
        ContentListItem[]
      >,
      ApiService.get(
        '/api/videos/all-video-lessons?category=characters',
        undefined,
        [],
      ) as Promise<ContentListItem[]>,
      ApiService.get('/api/books/all', undefined, []) as Promise<BookCardInfo[]>,
      fetchAllApprovedBlogPosts(),
    ]);

  const urls: SitemapUrl[] = [
    ...STATIC_PATHS.map((path) => ({ loc: `${CONST_URLS.siteUrl}${path}` })),
    ...textsRes.texts.map((t) => contentUrl('/read/texts', t, ruDateToIso)),
    ...videos.map((v) => contentUrl('/watch/videos', v)),
    ...phoneticsLessons.map((v) => contentUrl('/watch/phonetics-lessons', v)),
    ...charactersLessons.map((v) => contentUrl('/watch/characters-lessons', v)),
    ...books.map((b) => ({ loc: CONST_URLS.siteUrl + getBookUrl(b) })),
    ...blogPosts.map((p) => contentUrl('/read/blog', p)),
  ];

  headers.set('Content-Type', 'application/xml; charset=utf-8');
  send(200, toXml(urls));
};
