import { component$, type Signal } from "@builder.io/qwik";
import { type WhereType } from "../comments/comment-form";
import { audioSvg } from "../media/svg";
import { BookmarkBtn } from "./bookmark-btn";
import { CommentsBtn } from "./comments-btn";
import { LikeBtn } from "./like-btn";

type CardBtnsProps = {
  contentId: string;
  contentType: WhereType;
  likes: Signal<ContentLike[]>;
  userId: string;
  commentIdsLen: number;
  withAudio: boolean;
  isUnapproved?: boolean;
};

export const CardBtns = component$(
  ({
    contentId,
    contentType,
    likes,
    userId,
    commentIdsLen,
    withAudio,
    isUnapproved,
  }: CardBtnsProps) => {
    return (
      <div class='flex justify-end'>
        {withAudio && (
          <div class='tooltip tooltip-info' data-tip={"С аудио"}>
            <button class={`btn btn-sm btn-info ml-1`} type='button'>
              {audioSvg}
            </button>
          </div>
        )}

        <BookmarkBtn contentType={contentType} contentId={contentId} />
        <LikeBtn likes={likes} contentType={contentType} contentId={contentId} creatorId={userId} />

        <CommentsBtn
          isUnapproved={isUnapproved}
          contentId={contentId}
          contentType={contentType}
          commentIdsLen={commentIdsLen}
        />
      </div>
    );
  }
);
