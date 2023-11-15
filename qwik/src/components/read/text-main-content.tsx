import { component$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { MainContent } from "../common/layout/main-content";
import { Alerts } from "../common/alerts/alerts";
import { FontSizeBtnGroup } from "../common/content-cards/font-size-btns";
import { LongTxtPagination } from "./long-txt-pagination";
import { AudioPlayer } from "./audio-player";
import { Paragraph } from "./paragraph";
import { countZnChars } from "~/misc/helpers/content";
import { CommentsBlockTitle } from "../common/comments/comments-block-title";
import {
  type Addressee,
  CommentForm,
  type CommentIdToReply,
  WHERE,
} from "../common/comments/comment-form";
import { CommentsBlock } from "../common/comments/comments-block";
import { EditWordModal } from "../common/modals/edit-word-modal";
import { MoreInfoModal } from "../common/modals/more-info-modal";
import { EditChineseArrModal } from "../common/modals/edit-chinese-arr-modal";
import { userContext } from "~/root";
import { FontSizeBtns } from "../common/content-cards/content-page-card";
import type { TextFromDB, TooltipText } from "~/routes/read/texts/[id]";
import type { CommentType } from "../common/comments/comment-card";
import { editWordModalId, moreInfoModalId } from "../common/tooltips/word-tooltip";

type TextMainContentProps = {
  text: TextFromDB & TooltipText & { curPage: number };
  comments: CommentType[];
};

export const TextMainContent = component$(({ text, comments }: TextMainContentProps) => {
  const { isAdmin } = useContext(userContext);
  const fontSizeSig = useSignal(FontSizeBtns.md);
  const addressees = useSignal<Addressee[]>([]);
  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
  });

  const {
    _id: textId,
    translation,
    chinese_arr: chineseArr,
    tooltipTxt,
    origintext,
    pages,
    curPage,
    audioSrc: hasAudio,
  } = text;

  const isLongTxt = Boolean(pages && pages.length);
  const currentWord = useSignal<DictWord | undefined>(undefined);
  const showTranslation = useSignal(true);

  const editChineseArrModalId = "editChineseArrModalId";

  return (
    <MainContent>
      <Alerts />

      <div class={"flex justify-between w-full"}>
        <div class={"pt-1"}>
          <FontSizeBtnGroup fontSizeSig={fontSizeSig} />
        </div>
        <div>
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

      {isAdmin && (
        <label for={editChineseArrModalId} class={`btn btn-sm btn-outline btn-warning mt-2`}>
          edit chinese
        </label>
      )}

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
          comments={comments}
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

      {isAdmin && (
        <EditChineseArrModal
          chineseArr={chineseArr}
          modalId={editChineseArrModalId}
          textId={textId}
        />
      )}
    </MainContent>
  );
});
