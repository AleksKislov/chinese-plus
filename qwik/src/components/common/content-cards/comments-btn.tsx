import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { type WhereType } from '../comments/comment-form';
import { commentSvg } from '../media/svg';
import { getContentPath } from '~/misc/helpers/content';

type CommentsBtnProps = {
  contentType: WhereType;
  commentIdsLen: number;
  contentId: string;
  isUnapproved?: boolean;
};

export const CommentsBtn = component$(
  ({ contentType, commentIdsLen, contentId, isUnapproved }: CommentsBtnProps) => {
    return (
      <Link href={getContentPath(contentType, contentId, isUnapproved)}>
        <button class="btn btn-info btn-sm btn-outline ml-1">
          {commentSvg} {commentIdsLen > 0 && <span class={'ml-1'}>{commentIdsLen}</span>}
        </button>
      </Link>
    );
  },
);
