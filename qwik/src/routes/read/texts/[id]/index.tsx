import { component$, useSignal, useStore } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { ApiService } from "~/misc/actions/request";

import { FlexRow } from "~/components/common/layout/flex-row";
import { Sidebar } from "~/components/common/layout/sidebar";
import { MainContent } from "~/components/common/layout/main-content";

import CONSTANTS from "~/misc/consts/consts";
import { ContentPageCard, FontSizeBtns } from "~/components/common/content-cards/content-page-card";
import {
  type Addressee,
  type CommentIdToReply,
  WHERE,
  CommentForm,
} from "~/components/common/comments/comment-form";
import { Alerts } from "~/components/common/alerts/alerts";
import { type CommentType } from "~/components/common/comments/comment-card";
import { getContentComments } from "~/misc/actions/get-content-comments";
import { CommentsBlock } from "~/components/common/comments/comments-block";
import { CommentsBlockTitle } from "~/components/common/comments/comments-block-title";
import { type TextCardInfo } from "..";
import { parseTextWords, countZnChars } from "~/misc/helpers/content";
import { Paragraph } from "~/components/read/paragraph";
import { ContentPageHead } from "~/components/common/ui/content-page-head";
import { MoreInfoModal } from "~/components/common/modals/more-info-modal";
import { EditWordModal } from "~/components/common/modals/edit-word-modal";
import { editWordModalId, moreInfoModalId } from "~/components/common/tooltips/word-tooltip";
import { FontSizeBtnGroup } from "~/components/common/content-cards/font-size-btns";
import { LongTxtPagination } from "~/components/read/long-txt-pagination";
import { AudioPlayer } from "~/components/read/audio-player";
import { ReadResultCard } from "~/components/me/read-result-card";

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
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
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
    translation,
    tooltipTxt,
    origintext,
    pages,
    curPage,
    source,
    audioSrc: hasAudio,
  } = text.value;

  const isLongTxt = Boolean(pages && pages.length);
  const currentWord = useSignal<DictWord | undefined>(undefined);
  const showTranslation = useSignal(true);

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

        <MainContent>
          <Alerts />

          <div class={"flex justify-between w-full"}>
            <div class={"pt-1"}>
              <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
            </div>
            <div class={""}>
              <label class='label cursor-pointer'>
                <span class='label-text mr-3 font-bold'>
                  {showTranslation.value ? "Без перевода" : "С переводом"}
                </span>

                <input
                  type='checkbox'
                  class='toggle toggle-accent'
                  checked={!showTranslation.value}
                  onClick$={() => (showTranslation.value = !showTranslation.value)}
                />
              </label>
            </div>
          </div>

          {isLongTxt && <LongTxtPagination numOfPages={pages.length} curPage={curPage} />}

          {!hasAudio ? null : <AudioPlayer textId={textId} />}
          {tooltipTxt.map((parag, i) => (
            <Paragraph
              key={i}
              fontSize={fontSizeSig.value}
              tooltipedParag={parag}
              translation={isLongTxt ? pages[curPage].translation[i] : translation[i]}
              strLen={countZnChars(isLongTxt ? pages[curPage].origintext[i] : origintext[i])}
              ind={i}
              currentWord={currentWord}
              showTranslation={showTranslation.value}
            />
          ))}

          <div class={"mt-2"}>
            <CommentsBlockTitle />
            <CommentForm
              contentId={textId}
              where={WHERE.text}
              path={undefined}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
            <CommentsBlock
              comments={comments.value}
              commentIdToReply={commentIdToReplyStore}
              addressees={addressees}
            />
          </div>

          {!currentWord.value ? null : (
            <div>
              <EditWordModal word={currentWord.value} modalId={editWordModalId} />
              <MoreInfoModal
                word={{
                  _id: currentWord.value._id,
                  cn: currentWord.value.chinese,
                  py: currentWord.value.pinyin,
                  ru: currentWord.value.russian,
                  lvl: "unknown",
                  id: 0,
                }}
                modalId={moreInfoModalId}
              />
            </div>
          )}
        </MainContent>
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
