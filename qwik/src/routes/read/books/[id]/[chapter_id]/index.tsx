import { component$, useSignal, useStore } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { ApiService } from '~/misc/actions/request';
import { Sidebar } from '~/components/common/layout/sidebar';
import { MainContent } from '~/components/common/layout/main-content';
import { getWordsForTooltips, type TooltipParagraph } from '~/routes/read/texts/[id]';
import { countZnChars, parseTextWords } from '~/misc/helpers/content';
import { Paragraph } from '~/components/read/paragraph';
import { BookInfoCard } from '~/components/books/book-info-card';
import { useGetBookContents } from '../layout';
import { TextHeadBtns } from '~/components/common/read/text-head-btns';
import { FontSizeBtns } from '~/components/common/content-cards/content-page-card';
import { BookContentsComponent } from '~/components/books/book-contents';
import { CommentsFullBlock } from '~/components/common/comments/comments-full-block';
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
} from '~/components/common/comments/comment-form';
import { getBookPageComments } from '~/misc/actions/get-content-comments';
import { type CommentType } from '~/components/common/comments/comment-card';
import { EditWordModal } from '~/components/common/modals/edit-word-modal';
import { MoreInfoModal } from '~/components/common/modals/more-info-modal';
import { editWordModalId, moreInfoModalId } from '~/components/common/tooltips/word-tooltip';

export type BookPageContent = {
  _id: ObjectId;
  length: number;
  translation: string[];
  origintext: string[];
  chinese_arr: string[];
};

export type BookPage = {
  page: BookPageContent;
  tooltipTxt: TooltipParagraph[]; // Array of paragraphs, each containing tooltip segments
};

export const getComments = routeLoader$(({ params, query }): Promise<CommentType[]> => {
  const pageInd = query.get('page');

  return getBookPageComments(WHERE.book, params.chapter_id, pageInd);
});

export const useGetBookPage = routeLoader$(async ({ params, query }): Promise<BookPage> => {
  const bookId = params.id.split('-').at(-1);
  const pageInd = query.get('page');
  const page = await ApiService.get(
    `/api/books/${bookId}/${params.chapter_id}/${pageInd}`,
    undefined,
    {},
  );
  const dbWords = await getWordsForTooltips(page.chinese_arr, true);
  const tooltipTxt = parseTextWords(page.chinese_arr, dbWords);
  return { page, tooltipTxt };
});

export default component$(() => {
  const comments = getComments();
  const loc = useLocation();
  const bookLoader = useGetBookContents();
  const { book } = bookLoader.value;

  const pageLoader = useGetBookPage();
  const currentWord = useSignal<DictWord | null>(null);
  const showTranslation = useSignal(false);
  const fontSizeSig = useSignal(FontSizeBtns.md);

  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: '',
    name: '',
    userId: '',
  });

  const { page, tooltipTxt } = pageLoader.value;

  const getChapterTitle = (chapterId: ObjectId): string => {
    const chapter = bookLoader.value.contents.find((c) => c._id === chapterId);
    return chapter ? `${chapter.title.ru} | ${chapter.title.cn}` : 'Unknown Chapter';
  };

  return (
    <>
      <FlexRow>
        <Sidebar>
          <BookInfoCard book={book} />
        </Sidebar>
        <MainContent>
          <div class="prose mb-2">
            <h3>{getChapterTitle(loc.params.chapter_id)}</h3>
          </div>

          <TextHeadBtns showTranslation={showTranslation} fontSizeSig={fontSizeSig} />

          {Array.from({ length: Math.max(page.translation.length, tooltipTxt.length) }).map(
            (_, i) => (
              // редактировать можно только кол-во параграфов перевода
              <Paragraph
                key={i}
                fontSize={fontSizeSig.value}
                tooltipedParag={tooltipTxt[i] || []}
                translation={page.translation[i] || ''}
                strLen={countZnChars(page.origintext[i] || '')}
                ind={i}
                currentWord={currentWord}
                showTranslation={showTranslation.value}
              />
            ),
          )}

          {!currentWord.value ? null : (
            <div>
              <EditWordModal word={currentWord.value} modalId={editWordModalId} />
              <MoreInfoModal
                word={{
                  _id: currentWord.value._id,
                  cn: currentWord.value.chinese,
                  py: currentWord.value.pinyin,
                  ru: currentWord.value.russian,
                  lvl: 'unknown',
                  id: 0,
                }}
                modalId={moreInfoModalId}
              />
            </div>
          )}

          <CommentsFullBlock
            contentId={page._id}
            where={WHERE.book}
            path={undefined}
            commentIdToReply={commentIdToReplyStore}
            addressees={addressees}
            comments={comments.value}
          />

          <BookContentsComponent bookContents={bookLoader.value} />
        </MainContent>
      </FlexRow>
    </>
  );
});
