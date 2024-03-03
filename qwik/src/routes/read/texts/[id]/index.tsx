import { component$, useVisibleTask$ } from "@builder.io/qwik";
import {
  type DocumentHead,
  routeLoader$,
  routeAction$,
  useLocation,
  z,
  zod$,
} from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";
import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import CONSTANTS from "~/misc/consts/consts";
import { ContentPageCard } from "~/components/common/content-cards/content-page-card";
import { WHERE } from "~/components/common/comments/comment-form";
import { type CommentType } from "~/components/common/comments/comment-card";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { type TextCardInfo } from "..";
import { parseTextWords } from "~/misc/helpers/content";
import { ContentPageHead } from "~/components/common/ui/content-page-head";
import { ReadResultCard } from "~/components/me/read-result-card";
import { TextMainContent } from "~/components/read/text-main-content";

export type TextContent = {
  origintext: string[];
  translation: string[];
  chinese_arr: string[];
};

export type TextFromDB = TextCardInfo &
  TextContent & {
    pages: (TextContent & { _id: ObjectId })[];
  };

export type TooltipText = {
  tooltipTxt: (string | DictWord)[][];
};

export const getTextFromDB = (id: ObjectId): Promise<TextFromDB> => {
  return ApiService.get(`/api/texts/${id}`, undefined, null);
};

export const getWordsForTooltips = (
  wordsArr: string[],
  isShortRu?: boolean
): Promise<(string | DictWord)[]> => {
  const shortRu = isShortRu ? "?isShortRu=1" : "";
  return ApiService.post(`/api/dictionary/allwords${shortRu}`, wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, params.id);
});

export type SimilarText = {
  _id: ObjectId;
  audioSrc?: 0 | 1;
  title: string;
  picUrl: string;
};

// export const useGetSimilarTexts = globalAction$((params): Promise<SimilarText[]> => {
//   const { lvl, tags } = params;
//   return ApiService.get(`/api/texts/similar?lvl=${lvl}&tags=${tags}`, undefined, []);
// });

export const useGetText = routeLoader$(
  async ({ params, query }): Promise<TextFromDB & TooltipText & { curPage: number }> => {
    const curPage = getCurrentPageNum(query.get("pg"));
    const textFromDb = await getTextFromDB(params.id);
    const chineseArr = getChineseArr(textFromDb, curPage);

    // first load only the 1st parag
    const firstParag = chineseArr.slice(0, chineseArr.indexOf("\n"));
    const dbWords = await getWordsForTooltips(firstParag, true);
    const tooltipTxt = parseTextWords(firstParag, dbWords);
    return { ...textFromDb, tooltipTxt, curPage };
  }
);

export const useGetRestTooltipTxt = routeAction$(
  async (params): Promise<[(string | DictWord)[][], SimilarText[]]> => {
    const { chineseArr, lvl, tags, isApproved } = params;
    const dbWords = await getWordsForTooltips(chineseArr, true);
    return Promise.all([
      parseTextWords(chineseArr, dbWords),
      isApproved
        ? ApiService.get(`/api/texts/similar?lvl=${lvl}&tags=${tags}`, undefined, [])
        : undefined,
    ]);
  },
  zod$({
    chineseArr: z.array(z.string()),
    lvl: z.number().int(),
    tags: z.array(z.string()),
    isApproved: z.boolean(),
  })
);

export function getCurrentPageNum(pg: string | null = "1"): number {
  if (!pg) return 0;
  if (+pg && +pg > 0) return +pg - 1;
  return 0;
}

export function getChineseArr(textFromDb: TextFromDB, curPage: number): string[] {
  let chineseArr = textFromDb.chinese_arr;
  if (textFromDb.pages && textFromDb.pages.length) {
    chineseArr = textFromDb.pages[curPage].chinese_arr;
  }
  return chineseArr;
}

export default component$(() => {
  // const getSimilar = useGetSimilarTexts();
  const getRestParags = useGetRestTooltipTxt();
  const text = useGetText();
  const comments = getComments();
  const loc = useLocation();

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
  } = text.value;

  useVisibleTask$(async () => {
    const pg = loc.url.searchParams.get("pg");
    const currentPage = getCurrentPageNum(pg);
    await getRestParags.submit({
      chineseArr: getChineseArr(text.value, currentPage),
      lvl,
      tags,
      isApproved: Boolean(isApproved),
    });
  });

  return (
    <>
      <ContentPageHead title={title} hits={hits} path='/read/texts' />

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
            isApproved={true}
          />
          <ReadResultCard />
        </Sidebar>
        <TextMainContent
          similarTexts={getRestParags.value?.[1]}
          tooltipTxt={getRestParags.value?.[0] || text.value.tooltipTxt}
          text={text.value}
          comments={comments.value}
          restLoading={getRestParags.isRunning}
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
        name: "description",
        content: `Текст на китайском языке с переводом: ${textInfo.description}`,
      },
      {
        name: "twitter:card",
        content: "text_image_" + textInfo._id,
      },
      {
        name: "twitter:image",
        content: textInfo.pic_url,
      },
    ],
  };
};
