import { $, component$, useContext } from '@builder.io/qwik';
import { userContext } from '~/root';
import { WHERE, type WhereType } from '../comments/comment-form';
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

    // Do not show the button if the user doesn't have permission
    if (!(isAdmin || isModerator || (!isApproved && ownsContent))) {
      return null;
    }

    const onClickHandler$ = $(() => {
      const curPage = loc.url.searchParams.get('pg');
      const isBook = contentType === WHERE.book;

      // 1. Construct the PATHNAME string correctly
      const pathname = isBook
        ? `/edit/book-page/${contentId}`
        : `/edit/${contentType}/${contentId}`;

      // 2. Create a new URL object, resolving the pathname against the current origin.
      // loc.url can be used as the base.
      const destinationUrl = new URL(pathname, loc.url);

      // 3. Append search params correctly
      if (curPage) {
        destinationUrl.searchParams.set('pg', curPage);
      }

      // 4. Navigate using the full, valid URL.
      // The .href property gives the full string, e.g., "http://localhost:5173/edit/..."
      nav(destinationUrl.href);
    });

    return (
      <button
        class={`btn btn-sm btn-outline btn-warning mt-2`}
        type="button"
        onClick$={onClickHandler$}
      >
        {editSvg} edit
      </button>
    );
  },
);
