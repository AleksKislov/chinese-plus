import { type Signal, component$ } from "@builder.io/qwik";
import { CommentsBlockTitle } from "./comments-block-title";
import { type Addressee, CommentForm, type CommentIdToReply, type WhereType } from "./comment-form";
import { CommentsBlock } from "./comments-block";
import { type CommentType } from "./comment-card";

type CommentsFullBlockProps = {
  contentId: ObjectId;
  where: WhereType;
  path?: string;
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
  comments: CommentType[];
};

export const CommentsFullBlock = component$(
  ({ contentId, where, path, commentIdToReply, addressees, comments }: CommentsFullBlockProps) => {
    return (
      <div class={"mt-2"}>
        <CommentsBlockTitle />
        <CommentsBlock
          comments={comments}
          commentIdToReply={commentIdToReply}
          addressees={addressees}
        />
        <CommentForm
          contentId={contentId}
          where={where}
          path={path}
          commentIdToReply={commentIdToReply}
          addressees={addressees}
        />
      </div>
    );
  }
);
