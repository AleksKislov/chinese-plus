import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { PageTitle } from '~/components/common/layout/title';
import { ReadResultCard } from '~/components/me/read-result-card';
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
          <ReadResultCard />
        </Sidebar>

        <MainContent>
          {books.value.map((book, ind) => (
            // <TextCard key={ind} text={text} />
            <div key={ind}>
              <Link
                href={'/read/books/' + book._id}
                class="link link-hover link-secondary font-bold"
              >
                {book.title.cn} - {book._id}
              </Link>
            </div>
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
