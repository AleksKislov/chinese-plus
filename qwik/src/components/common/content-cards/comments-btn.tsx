import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { WHERE, type WhereType } from "../comments/comment-form";
import { commentSvg } from "../media/svg";

type CommentsBtnProps = {
  contentType: WhereType;
  commentIdsLen: number;
  contentId: string;
  isUnapproved?: boolean;
};

export const CommentsBtn = component$(
  ({ contentType, commentIdsLen, contentId, isUnapproved }: CommentsBtnProps) => {
    const getHref = (where: WhereType, isUnapproved?: boolean) => {
      const s = isUnapproved ? "unapproved-" : "";
      switch (where) {
        case WHERE.post:
          return `/feedback/${contentId}`;
        case WHERE.video:
          return `/watch/${s}videos/${contentId}`;
        case WHERE.text:
          return `/read/${s}texts/${contentId}`;
      }
    };

    return (
      <Link href={getHref(contentType, isUnapproved)}>
        <button class='btn btn-info btn-sm btn-outline ml-1'>
          {commentSvg} {commentIdsLen > 0 && <span class={"ml-1"}>{commentIdsLen}</span>}
        </button>
      </Link>
    );
  }
);
