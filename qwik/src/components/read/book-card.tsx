import { component$ } from '@builder.io/qwik';
import { WHERE } from '../common/comments/comment-form';
import { TagsLine } from '../common/content-cards/tags-line';
import { TextDesc } from '../common/content-cards/text-desc';
import { CardTitle } from '../common/content-cards/card-title';
import { CardImg } from '../common/content-cards/card-img';
import { ContentLen } from '../common/content-cards/content-len';
import { type BookCardInfo } from '~/routes/read/books';
import { InfoLine } from '../common/content-cards/info-line';
import { TextSource } from '../common/content-cards/text-source';

type BookCardProps = {
  book: BookCardInfo;
};

export const BookCard = component$(({ book }: BookCardProps) => {
  const { _id: bookId, genres, length, year, author, translationSrc, about, picUrl } = book;

  return (
    <div class="card lg:card-side w-full bg-base-300 mb-3 lg:max-h-96">
      <CardImg
        contentId={bookId}
        contentType={WHERE.book}
        picUrl={picUrl}
        book={book}
        isUnapproved={undefined}
      />

      <div class="card-body lg:w-2/3">
        <CardTitle
          contentId={bookId}
          contentType={WHERE.book}
          hits={0}
          book={book}
          title={book.title.ru}
          isUnapproved={undefined}
        />
        <TagsLine tags={genres} />

        <div class="grid lg:grid-cols-2 grid-cols-1 gap-2">
          <ContentLen len={length} />
          <InfoLine name={'Писатель'} value={author.name.ru + ' | ' + author.name.cn} />
          <InfoLine name={'Год'} value={'' + year} />
          <TextSource source={translationSrc} isTranslation={true} />
        </div>

        <div class="flex h-full flex-col justify-between ">
          <TextDesc desc={about} />
        </div>
      </div>
    </div>
  );
});
