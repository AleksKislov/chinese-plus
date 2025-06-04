import { type CommentPageInfo } from '~/components/common/comments/comment-card';
import { WHERE, type WhereType } from '~/components/common/comments/comment-form';
import { getBookUrl } from './get-book-url';
import { type BookCardInfo } from '~/routes/read/books';

export const getContentPath = (
  contentType: WhereType,
  contentId: string,
  isUnapproved?: boolean,
  pageInfo?: CommentPageInfo,
  book?: BookCardInfo,
): string => {
  const s = isUnapproved ? 'unapproved-' : '';

  switch (contentType) {
    case WHERE.text:
      return `/read/${s}texts/${contentId}`;
    case WHERE.video:
      return `/watch/${s}videos/${contentId}`;
    case WHERE.phoneticsLesson:
      return `/watch/phonetics-lessons/${contentId}`;
    case WHERE.charactersLesson:
      return `/watch/characters-lessons/${contentId}`;
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
