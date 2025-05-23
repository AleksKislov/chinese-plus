import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
// import { ContentPageCard } from '~/components/common/content-cards/content-page-card';
// import { Sidebar } from '~/components/common/layout/sidebar';
// import CONSTANTS from '~/misc/consts/consts';
// import { WHERE } from '~/components/common/comments/comment-form';
// import { ReadResultCard } from '~/components/me/read-result-card';
// import { TextMainContent } from '~/components/read/text-main-content';
import { type BookCardInfo } from '..';
import { ApiService } from '~/misc/actions/request';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';

export type BookContents = {
  book: BookCardInfo;
  contents: Object;
};

// export const useGetText = routeLoader$(
//   async ({ params, query }): Promise<TextFromDB & TooltipText & { curPage: number }> => {
//     const curPage = getCurrentPageNum(query.get('pg'));
//     const textFromDb = await getTextFromDB(params.id);

export const useGetBookContents = routeLoader$(({ params }): Promise<BookContents> => {
  return ApiService.get(`/api/books/${params.id}`, undefined, []);
});

export default component$(() => {
  const bookLoader = useGetBookContents();

  const {
    book: { title },
    contents,
  } = bookLoader.value;

  return (
    <>
      <ContentPageHead title={title.ru} path="/read/books" />

      <FlexRow>
        <Sidebar></Sidebar>
        <MainContent>
          <div>
            <p class="mb-4">{JSON.stringify(contents, null, 2)}</p>
          </div>
        </MainContent>
      </FlexRow>
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
