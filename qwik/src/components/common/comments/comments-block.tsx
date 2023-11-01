import { component$, type Signal } from "@builder.io/qwik";
import { infoAlertSvg } from "../media/svg";
import { CommentCard, type CommentType } from "./comment-card";
import { type Addressee, type CommentIdToReply } from "./comment-form";

type CommentsBlockProps = {
  comments: CommentType[];
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
};

export const CommentsBlock = component$(
  ({ comments, commentIdToReply, addressees }: CommentsBlockProps) => {
    return (
      <div>
        {comments.length ? (
          comments.map((msg, ind) => (
            <CommentCard
              comment={msg}
              key={ind}
              commentIdToReply={commentIdToReply}
              addressees={addressees}
            />
          ))
        ) : (
          <div class='alert alert-info shadow-lg'>
            {infoAlertSvg}
            <span>Еще никто не комментировал</span>
          </div>
        )}
      </div>
    );
  }
);
