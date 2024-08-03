import { component$, useContext } from '@builder.io/qwik';
import { userContext } from '~/root';
import { type WhereType } from '../comments/comment-form';
import { editSvg } from '../media/svg';
import { useLocation, useNavigate } from '@builder.io/qwik-city';

type EditBtnProps = {
  contentType: WhereType;
  contentId: ObjectId;
  creatorId: ObjectId;
  isApproved: boolean;
};

export const EditBtn = component$(
  ({ contentType, contentId, creatorId, isApproved }: EditBtnProps) => {
    const userState = useContext(userContext);
    const { isAdmin, isModerator, _id } = userState;
    const ownsContent = _id === creatorId;
    const loc = useLocation();
    const nav = useNavigate();

    const curPage = loc.url.searchParams.get('pg'); // for long texts
    // если не модер, то редактировать только свое до публикации
    return isAdmin || isModerator || (!isApproved && ownsContent) ? (
      <button
        class={`btn btn-sm btn-outline btn-warning mt-2`}
        type="button"
        onClick$={() => nav(`/edit/${contentType}/${contentId}/${curPage ? '?pg=' + curPage : ''}`)}
      >
        {editSvg} edit
      </button>
    ) : null;
  },
);
