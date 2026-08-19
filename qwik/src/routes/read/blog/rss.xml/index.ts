import { type RequestHandler } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import CONST_URLS from '~/misc/consts/urls';
import { WHERE } from '~/components/common/comments/comment-form';
import {
  getContentPath,
  getCoverImage,
  getPreviewText,
  type BlogBlock,
} from '~/misc/helpers/content';

type RssBlogPost = {
  _id: string;
  title: string;
  date: string;
  content: BlogBlock[];
  user: { name: string };
};

const MAX_ITEMS = 30;

// /api/blogs is paginated (limit 10 per page), so page through it until we have enough items.
const fetchLatestApprovedBlogPosts = async (): Promise<RssBlogPost[]> => {
  const posts: RssBlogPost[] = [];
  let skip = 0;

  while (posts.length < MAX_ITEMS) {
    const page = (await ApiService.get(`/api/blogs?skip=${skip}`, undefined, [])) as RssBlogPost[];
    if (!page.length) break;
    posts.push(...page);
    if (page.length < 10) break;
    skip += 10;
  }

  return posts.slice(0, MAX_ITEMS);
};

const toItemXml = (post: RssBlogPost): string => {
  const link = CONST_URLS.siteUrl + getContentPath(WHERE.blog, post._id, false, undefined, undefined, post.title);
  const description = getPreviewText(post.content, 300) || post.title;
  const image = getCoverImage(post.content);

  return `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author><![CDATA[${post.user.name}]]></author>
    <description><![CDATA[${image ? `<img src="${image}" /><br/>` : ''}${description}]]></description>
  </item>`;
};

const toRssXml = (posts: RssBlogPost[]): string => {
  const items = posts.map(toItemXml).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Chinese+ Блог</title>
    <link>${CONST_URLS.siteUrl}/read/blog</link>
    <description>Новые посты блога Chinese+</description>
    <language>ru</language>
${items}
  </channel>
</rss>`;
};

export const onGet: RequestHandler = async ({ send, headers, cacheControl }) => {
  cacheControl({ maxAge: 3600, staleWhileRevalidate: 86400 });

  const posts = await fetchLatestApprovedBlogPosts();

  headers.set('Content-Type', 'application/rss+xml; charset=utf-8');
  send(200, toRssXml(posts));
};
