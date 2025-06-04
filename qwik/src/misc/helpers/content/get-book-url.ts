import { slugify } from 'transliteration';
import { type BookCardInfo } from '~/routes/read/books';

export const getBookUrl = (book: BookCardInfo) => {
  return '/read/books/' + slugify(book.title.ru) + '-' + book._id;
};
