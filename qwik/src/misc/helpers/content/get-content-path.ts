import { slugify } from 'transliteration';
import { type CommentPageInfo } from '~/components/common/comments/comment-card';
import { WHERE, type WhereType } from '~/components/common/comments/comment-form';
import { getBookUrl } from './get-book-url';
import { type BookCardInfo } from '~/routes/read/books';

// SEO-friendly slug prefix; the id itself (last "-" segment) remains the source of truth for lookups.
export const withSlug = (contentId: string, title?: string): string =>
  title ? `${slugify(title)}-${contentId}` : contentId;

export const getContentPath = (
  contentType: WhereType,
  contentId: string,
  isUnapproved?: boolean,
  pageInfo?: CommentPageInfo,
  book?: BookCardInfo,
  title?: string,
): string => {
  const s = isUnapproved ? 'unapproved-' : '';

  switch (contentType) {
    case WHERE.text:
      return `/read/${s}texts/${withSlug(contentId, isUnapproved ? undefined : title)}`;
    case WHERE.blog:
      return `/read/blog/${withSlug(contentId, isUnapproved ? undefined : title)}`;
    case WHERE.video:
      return `/watch/${s}videos/${withSlug(contentId, isUnapproved ? undefined : title)}`;
    case WHERE.phoneticsLesson:
      return `/watch/phonetics-lessons/${withSlug(contentId, title)}`;
    case WHERE.charactersLesson:
      return `/watch/characters-lessons/${withSlug(contentId, title)}`;
    case WHERE.post:
      return `/feedback/${contentId}`;
    case WHERE.book:
      if (pageInfo) {
        return `${getBookUrl(pageInfo?.book as BookCardInfo)}/${pageInfo?.belongsTo}/?page=${
          pageInfo?.ind
        }`;
      }
      if (book) {
        return getBookUrl(book);
      }
  }
  return '/';
};
