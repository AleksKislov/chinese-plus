import { component$, useVisibleTask$, useStore } from '@builder.io/qwik';
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

export type TextContent = {
  origintext: string[];
  translation: string[];
  chinese_arr: string[];
};

export type TextFromDB = TextCardInfo &
  TextContent & {
    pages: (TextContent & { _id: ObjectId })[];
  };

export type TooltipSegment = string | DictWord;
export type TooltipParagraph = TooltipSegment[]; // Tooltip data for one paragraph
export type TooltipText = {
  tooltipTxt: TooltipParagraph[]; // Array of paragraphs, each containing tooltip segments
};

export type SimilarText = {
  _id: ObjectId;
  audioSrc?: 0 | 1;
  title: string;
  picUrl: string;
};

export const getTextFromDB = (id: ObjectId): Promise<TextFromDB> => {
  return ApiService.get(`/api/texts/${id}`, undefined, null);
};

export const getWordsForTooltips = (
  wordsArr: string[],
  isShortRu?: boolean,
): Promise<TooltipSegment> => {
  const shortRu = isShortRu ? '?isShortRu=1' : '';
  return ApiService.post(`/api/dictionary/allwords${shortRu}`, wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, params.id);
});

export const useGetText = routeLoader$(
  async ({ params, query }): Promise<TextFromDB & { curPage: number }> => {
    const curPage = getCurrentPageNum(query.get('pg'));
    const textFromDb = await getTextFromDB(params.id);
    return { ...textFromDb, curPage };
  },
);

export const useGetParagraphTooltipTxt = routeAction$(
  async (params): Promise<TooltipParagraph[]> => {
    const { paragraphWords } = params;
    if (!paragraphWords || paragraphWords.length === 0) {
      return [];
    }
    const dbWords = await getWordsForTooltips(paragraphWords, true);
    // Assuming parseTextWords takes words and dbWords, and returns the structured tooltip data for that paragraph
    return parseTextWords(paragraphWords, dbWords);
  },
  zod$({
    paragraphWords: z.array(z.string()),
  }),
);

// Action to get similar texts (separated)
// export const useGetSimilarTextsAction = routeAction$(
//   async (params): Promise<SimilarText[]> => {
//     const { lvl, tags, isApproved } = params;
//     if (!isApproved) {
//       return []; // Only fetch if approved
//     }
//     return ApiService.get(`/api/texts/similar?lvl=${lvl}&tags=${tags.join(',')}`, undefined, []);
//   },
//   zod$({
//     lvl: z.number().int(),
//     tags: z.array(z.string()),
//     isApproved: z.boolean(),
//   }),
// );

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

// Helper to split the flat chinese_arr into paragraphs based on '\n'
export function splitChineseArrIntoParagraphs(chineseArr: string[]): string[][] {
  const paragraphs: string[][] = [];
  let currentParagraph: string[] = [];
  for (const word of chineseArr) {
    if (word === '\n') {
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph);
      }
      // Also add the newline itself if needed for structure, or handle paragraphs differently
      // paragraphs.push(['\n']); // Option 1: Add newline as its own paragraph (unlikely)
      currentParagraph = []; // Start new paragraph
    } else {
      currentParagraph.push(word);
    }
  }
  // Add the last paragraph if it wasn't empty
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }
  return paragraphs;
}

// --- Component ---
export default component$(() => {
  const textLoader = useGetText();
  const comments = getComments();
  // const loc = useLocation();

  // Action hooks
  const getParagraphTooltips = useGetParagraphTooltipTxt();
  // const getSimilarTexts = useGetSimilarTextsAction();

  // Store for all tooltip data (initialized with the first paragraph)
  // Ensure the structure matches what TextMainContent expects
  const tooltipStore = useStore<{
    paragraphs: TooltipParagraph[]; // Array of paragraphs, each is an array of segments
    isLoading: boolean;
    similarTexts?: SimilarText[];
    similarTextsLoading: boolean;
  }>({
    paragraphs: [], // Start empty, will be populated
    isLoading: true, // Initially loading subsequent paragraphs
    similarTexts: undefined,
    similarTextsLoading: true,
  });

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
    curPage, // Get current page from loader
  } = textLoader.value;

  // UseVisibleTask$ for progressive loading
  useVisibleTask$(
    async ({ cleanup }) => {
      tooltipStore.isLoading = true; // Set loading state
      // tooltipStore.similarTextsLoading = true;

      // 2. Get the full chinese array for the current page
      const chineseArr = getChineseArr(textLoader.value, curPage);
      const paragraphs = splitChineseArrIntoParagraphs(chineseArr);

      // 3. Fetch Similar Texts (only once)
      // getSimilarTexts
      //   .submit({ lvl, tags, isApproved: Boolean(isApproved) })
      //   .then((result) => {
      //     tooltipStore.similarTexts = result;
      //   })
      //   .finally(() => {
      //     tooltipStore.similarTextsLoading = false;
      //   });

      let isCancelled = false;
      cleanup(() => (isCancelled = true)); // Handle component unmount during loading

      // 4. Loop through remaining paragraphs (starting from the second one)
      try {
        for (let i = 0; i < paragraphs.length; i++) {
          if (isCancelled) break; // Stop if component unmounted

          const paragraphWords = paragraphs[i];
          if (paragraphWords.length > 0) {
            const result = await getParagraphTooltips.submit({ paragraphWords });
            if (isCancelled) break;

            if (result && result.value?.length > 0) {
              // IMPORTANT: Qwik reactivity needs direct assignment or methods like push
              // Be careful with how parseTextWords structures the result.
              // Assuming result is TooltipParagraph[] containing data for *one* paragraph.
              tooltipStore.paragraphs.push(...result.value);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching paragraph tooltips:', error);
        // Handle error appropriately
      } finally {
        if (!isCancelled) {
          tooltipStore.isLoading = false; // Loading finished
        }
      }

      // Watch for changes in relevant data (e.g., page number) to re-trigger
      // Qwik handles re-running routeLoader$ on navigation, which re-runs useVisibleTask$
    },
    { strategy: 'document-ready' },
  ); // or 'document-idle'

  return (
    <>
      <ContentPageHead title={title} hits={hits} path="/read/texts" />

      <FlexRow>
        <Sidebar>
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
        {/* Pass the store's data and loading state to the main content */}
        <TextMainContent
          // Use the combined tooltip data from the store
          tooltipTxt={tooltipStore.paragraphs}
          text={textLoader.value} // Pass the base text info
          comments={comments.value}
          // Indicate loading state for subsequent paragraphs
          restLoading={tooltipStore.isLoading}
          // Pass similar texts and their loading state
          similarTexts={tooltipStore.similarTexts}
          // similarTextsLoading={tooltipStore.similarTextsLoading}
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
