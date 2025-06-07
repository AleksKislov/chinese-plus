import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import { ReadResultCard } from '~/components/me/read-result-card';
import { BookCard } from '~/components/read/book-card';
import { ApiService } from '~/misc/actions/request';

export type BookAuthor = {
  _id: ObjectId;
  name: {
    ru: string;
    cn: string;
  };
};

export type BookCardInfo = {
  _id: ObjectId;
  title: {
    ru: string;
    cn: string;
  };
  genres: string[];
  length: number;
  year: number;
  author: BookAuthor;
  isChinese: Boolean;
  about: string;
  picUrl: string;
  translationSrc: string;
};

export const getBooks = routeLoader$((): Promise<BookCardInfo[]> => {
  return ApiService.get(`/api/books/all`, undefined, []);
});

export default component$(() => {
  const books = getBooks();

  return (
    <>
      <PageTitle txt={'Книги на китайском языке'} />
      <FlexRow>
        <Sidebar>
          <div class="card w-full bg-base-200 mb-3">
            <div class="card-body">
              <h2 class="card-title">О разделе</h2>
              <p>
                Книги с переводом всего текста и каждого слова по отдельности по клику.
                <br />
                ВНИМАНИЕ: так как перевод художественный, то кол-во параграфов в переводе может
                отличаться от оригинала.
              </p>
            </div>
          </div>
          <ReadResultCard />
        </Sidebar>

        <MainContent>
          {books.value.map((book, ind) => (
            <BookCard key={ind} book={book} />
          ))}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Chinese+ Книги на китайском с переводом',
  meta: [
    {
      name: 'description',
      content:
        'Китайские книги и книги на китайском языке с переводом всего текста и каждого слова по отдельности по клику.',
    },
  ],
};
