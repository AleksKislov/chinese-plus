import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
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

export const getWordsForTooltips = (wordsArr: string[]): Promise<(string | DictWord)[]> => {
  return ApiService.post("/api/dictionary/allWords", wordsArr, undefined, []);
};

export const getComments = routeLoader$(({ params }): Promise<CommentType[]> => {
  return getContentComments(WHERE.text, params.id);
});

export const useGetText = routeLoader$(
  async ({ params, query }): Promise<TextFromDB & TooltipText & { curPage: number }> => {
    let curPage = 0;
    const pg = query.get("pg") || "1";
    if (+pg && +pg > 0) curPage = +pg - 1;

    const textFromDb = await getTextFromDB(params.id);
    let chineseArr = textFromDb.chinese_arr;
    if (textFromDb.pages && textFromDb.pages.length) {
      chineseArr = textFromDb.pages[curPage].chinese_arr;
    }
    const dbWords = await getWordsForTooltips(chineseArr);
    const tooltipTxt = parseTextWords(chineseArr, dbWords);
    return { ...textFromDb, tooltipTxt, curPage };
  }
);

export default component$(() => {
  const text = useGetText();
  const comments = getComments();

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
  } = text.value;

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
        <TextMainContent text={text.value} comments={comments.value} />
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
    ],
  };
};
