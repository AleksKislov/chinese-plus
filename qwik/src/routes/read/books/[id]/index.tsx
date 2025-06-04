import { component$ } from '@builder.io/qwik';
import { useGetBookContents } from './layout';
import { MainContent } from '~/components/common/layout/main-content';
import { Sidebar } from '~/components/common/layout/sidebar';
import { FlexRow } from '~/components/common/layout/flex-row';
import { BookInfoCard } from '~/components/books/book-info-card';
import { BookContentsComponent } from '~/components/books/book-contents';

export default component$(() => {
  const bookLoader = useGetBookContents();

  const { book } = bookLoader.value;

  return (
    <FlexRow>
      <Sidebar>
        <BookInfoCard book={book} />
      </Sidebar>
      <MainContent>
        <BookContentsComponent bookContents={bookLoader.value} />
      </MainContent>
    </FlexRow>
  );
});
