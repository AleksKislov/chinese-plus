import { component$ } from '@builder.io/qwik';
import { type RequestEvent, Link, routeLoader$ } from '@builder.io/qwik-city';
import { PageTitle } from '~/components/common/layout/title';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { ApiService } from '~/misc/actions/request';
import { type BookCardInfo } from '~/routes/read/books';

export const onGet = async ({ cookie, redirect }: RequestEvent) => {
  const token = getTokenFromCookie(cookie);
  if (!token) throw redirect(302, '/login');
};

export const useGetBooks = routeLoader$((): Promise<BookCardInfo[]> => {
  return ApiService.get('/api/books/all', undefined, []);
});

export default component$(() => {
  const books = useGetBooks();

  return (
    <>
      <PageTitle txt={'Управление книгами'} />

      <div class="mb-3">
        <Link href="/create/book" class="btn btn-primary">
          + Создать книгу
        </Link>
      </div>

      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Автор</th>
              <th>Год</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.value.map((book) => (
              <tr key={book._id}>
                <td>
                  {book.title.ru} / {book.title.cn}
                </td>
                <td>{book.author?.name?.ru || '—'}</td>
                <td>{book.year || '—'}</td>
                <td>
                  <Link href={`/edit/book/${book._id}`} class="btn btn-sm btn-outline">
                    Управлять
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});
