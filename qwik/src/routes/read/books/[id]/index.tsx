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

export type BookContents = {
  book: BookCardInfo;
  contents: Object;
};

export const useGetBookContents = routeLoader$((): Promise<BookContents> => {
  return ApiService.get(`/api/books/all`, undefined, []);
});

export default component$(() => {
  const bookLoader = useGetBookContents();

  const {
    book: { title },
  } = bookLoader.value;

  return (
    <>
      <ContentPageHead title={title.ru} hits={0} path="/read/books" />

      <FlexRow>
        {/* <Sidebar>
          <ContentPageCard
            desc={desc}
            length={length}
            tags={tags}
            userId={userId}
            userName={userName}
            date={date}
            lvl={lvl}
            picUrl={picUrl}
            category={CONSTANTS.textCategories[categoryInd]}
            likes={likes}
            contentType={WHERE.text}
            contentId={textId}
            textSource={source}
            isApproved={Boolean(isApproved)} // Ensure boolean
          />
          <ReadResultCard />
        </Sidebar>
        <TextMainContent
          tooltipTxt={tooltipTxt}
          text={textLoader.value}
          comments={comments.value}
          restLoading={false}
          similarTexts={getSimilarTexts.value as SimilarText[]}
        /> */}
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
