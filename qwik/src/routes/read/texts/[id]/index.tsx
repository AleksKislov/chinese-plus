import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, routeAction$, z, zod$ } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { FlexRow } from '~/components/common/layout/flex-row';
import { Sidebar } from '~/components/common/layout/sidebar';
import CONSTANTS from '~/misc/consts/consts';
import { ContentPageCard } from '~/components/common/content-cards/content-page-card';
import { WHERE } from '~/components/common/comments/comment-form';
import { type CommentType } from '~/components/common/comments/comment-card';
import { getContentComments } from '~/misc/actions/get-content-comments';
import { type TextCardInfo } from '..';
import { parseTextWords } from '~/misc/helpers/content';
import { ContentPageHead } from '~/components/common/ui/content-page-head';
import { ReadResultCard } from '~/components/me/read-result-card';
import { TextMainContent } from '~/components/read/text-main-content';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';

export type TextContent = {
  // origintext?: string[];
  translation: string[];
  chinese_arr: string[];
  origParagsLen: number[];
  uniqCharsTotal: number;
};

export type TextFromDB = TextCardInfo &
  TextContent & {
    pages: (TextContent & { _id: ObjectId })[];
  };

export type TooltipParagraph = TooltipSegment[]; // Tooltip data for one paragraph
export type TooltipText = {
  tooltipTxt: TooltipParagraph[]; // Array of paragraphs, each containing tooltip segments
};

export type SimilarText = {
  _id: ObjectId;
  audioSrc?: 0 | 1;
  title: string;
  picUrl: string;
  matchingTags?: string[];
};

export const getTextFromDB = (id: ObjectId, noOrigin: boolean): Promise<TextFromDB> => {
  return ApiService.get(`/api/texts/${id}?no_origin=` + noOrigin, undefined, null);
};

export const getWordsForTooltips = (
  wordsArr: string[],
  isShortRu?: boolean,
): Promise<TooltipSegment[]> => {
  const shortRu = isShortRu ? '?isShortRu=1' : '';
  return ApiService.post(`/api/dictionary/allwords${shortRu}`, wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, params.id);
});

export const useGetText = routeLoader$(
  async ({ params, query }): Promise<TextFromDB & TooltipText & { curPage: number }> => {
    const curPage = getCurrentPageNum(query.get('pg'));
    const textFromDb = await getTextFromDB(params.id, true);
    const chineseArr = getChineseArr(textFromDb, curPage);
    const dbWords = await getWordsForTooltips(chineseArr, true);
    const tooltipTxt = parseTextWords(chineseArr, dbWords);
    return { ...textFromDb, tooltipTxt, curPage };
  },
);

export const useGetSimilarTextsAction = routeAction$(
  async (params): Promise<SimilarText[]> => {
    const { lvl, tags, textId } = params;

    return ApiService.get(
      `/api/texts/similar?lvl=${lvl}&tags=${tags.join(',')}&text_id=${textId}`,
      undefined,
      [],
    );
  },
  zod$({
    lvl: z.number().int(),
    tags: z.array(z.string()),
    textId: z.string(),
  }),
);

export function getCurrentPageNum(pg: string | null = '1'): number {
  if (!pg) return 0;
  if (+pg && +pg > 0) return +pg - 1;
  return 0;
}

export function getChineseArr(textFromDb: TextFromDB, curPage: number): string[] {
  // Ensure pages exist and curPage is within bounds
  if (textFromDb.pages && textFromDb.pages.length > curPage && curPage >= 0) {
    return textFromDb.pages[curPage]?.chinese_arr || [];
  }
  // Fallback to root chinese_arr if pages aren't used or curPage is invalid
  return textFromDb.chinese_arr || [];
}

export default component$(() => {
  const textLoader = useGetText();
  const comments = getComments();
  const getSimilarTexts = useGetSimilarTextsAction();

  const {
    _id: textId,
    title,
    description: desc,
    tags,
    hits,
    user: { _id: userId, name: userName },
    date,
    level: lvl,
    pic_url: picUrl,
    categoryInd,
    likes,
    length,
    source,
    isApproved,
    tooltipTxt,
    uniqCharsTotal,
  } = textLoader.value;

  useVisibleTask$(
    () => {
      if (!isApproved) return; // Only fetch if approved
      getSimilarTexts.submit({ lvl, tags, textId });
    },
    { strategy: 'document-ready' },
  );

  return (
    <>
      <ContentPageHead title={title} hits={hits} path="/read/texts" />

      <FlexRow>
        <Sidebar noAds={true}>
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
            uniqCharsTotal={uniqCharsTotal}
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
        />
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const textInfo = resolveValue(useGetText);

  return {
    title: `Chinese+ Китайский c переводом: ${textInfo.title}`,
    meta: [
      {
        name: 'description',
        content: `Текст на китайском языке с переводом: ${textInfo.description}`,
      },
      {
        name: 'twitter:card',
        content: 'text_image_' + textInfo._id,
      },
      {
        name: 'twitter:image',
        content: textInfo.pic_url,
      },
    ],
  };
};
