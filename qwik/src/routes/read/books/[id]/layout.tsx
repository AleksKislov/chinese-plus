import { component$, Slot } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { ApiService } from '~/misc/actions/request';
import { type BookCardInfo } from '..';
import { getBookUrl } from '~/misc/helpers/content/get-book-url';
import { JsonLd } from '~/components/common/seo/json-ld';
import CONST_URLS from '~/misc/consts/urls';
import { type Crumb, truncateCrumb } from '~/components/common/layout/breadcrumbs';

export type ChapterPage = {
  length: number;
  _id: ObjectId;
  belongsTo: ObjectId;
  ind: number;
};

export type BookChapter = {
  _id: ObjectId;
  title: {
    ru: string;
    cn: string;
  };
  length: number;
  pages: ChapterPage[];
};

export type BookContents = {
  book: BookCardInfo;
  contents: BookChapter[];
};

export const useGetBookContents = routeLoader$(({ params }): Promise<BookContents> => {
  const bookId = params.id.split('-').at(-1);
  return ApiService.get(`/api/books/${bookId}`, undefined, []);
});

export default component$(() => {
  const bookLoader = useGetBookContents();

  const loc = useLocation();

  const { book, contents } = bookLoader.value;

  // One trail for the whole book section: the book page itself, or book › chapter
  // when a chapter is open (the chapter route renders inside this layout).
  const chapter = loc.params.chapter_id
    ? contents.find((c) => c._id === loc.params.chapter_id)
    : undefined;
  const bookTitle = truncateCrumb(book.title.ru);
  const crumbs: Crumb[] = [
    { name: 'Книги', href: '/read/books/' },
    chapter ? { name: bookTitle, href: getBookUrl(book) + '/' } : { name: bookTitle },
    ...(chapter ? [{ name: truncateCrumb(chapter.title.ru) }] : []),
  ];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title.ru,
          alternateName: book.title.cn,
          description: book.about,
          image: book.picUrl,
          author: { '@type': 'Person', name: book.author.name.ru },
        }}
      />
      <ContentPageHead
        title={book.title.ru + ' | ' + book.title.cn}
        path="/read/books"
        crumbs={crumbs}
      />
      <Slot />
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const bookInfo = resolveValue(useGetBookContents);
  const title = `Chinese+ ${bookInfo.book.title.ru}`;
  const description = `Книга на китайском языке с переводом: ${bookInfo.book.about}`;

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:type',
        content: 'book',
      },
      {
        property: 'og:url',
        content: CONST_URLS.siteUrl + getBookUrl(bookInfo.book),
      },
      {
        property: 'og:image',
        content: bookInfo.book.picUrl,
      },
      {
        name: 'twitter:card',
        content: 'book_image_' + bookInfo.book._id,
      },
      {
        name: 'twitter:image',
        content: bookInfo.book.picUrl,
      },
    ],
  };
};
