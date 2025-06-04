import { component$, Slot } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { ApiService } from '~/misc/actions/request';
import { type BookCardInfo } from '..';

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

  const { book } = bookLoader.value;

  return (
    <>
      <ContentPageHead title={book.title.ru + ' | ' + book.title.cn} path="/read/books" />
      <Slot />
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const bookInfo = resolveValue(useGetBookContents);

  return {
    title: `Chinese+ ${bookInfo.book.title.ru}`,
    meta: [
      {
        name: 'description',
        content: `Книга на китайском языке с переводом: ${bookInfo.book.about}`,
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
