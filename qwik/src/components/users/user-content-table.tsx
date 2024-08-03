import { component$ } from '@builder.io/qwik';
import { WHERE } from '~/components/common/comments/comment-form';
import { commentSvg, eyeSvg, heartSvg } from '~/components/common/media/svg';
import CONSTANTS from '~/misc/consts/consts';
import { type UserPublishedText, type UserPublishedVideo } from '~/routes/users/[id]';
import { UserTableTableRow } from './user-content-table-row';

type MarkedTableProps = {
  content: UserPublishedText[] | UserPublishedVideo[];
  contentType: 'text' | 'video';
};

export const UserContentTable = component$(({ content, contentType }: MarkedTableProps) => {
  const isVideo = contentType === WHERE.video;
  return (
    <table class="table text-base-content">
      <thead>
        <tr>
          <th>Название</th>
          <th>{heartSvg}</th>
          <th>{commentSvg}</th>
          <th>{eyeSvg}</th>
        </tr>
      </thead>
      <tbody>
        {content.map((cnt) => (
          <UserTableTableRow
            contentId={cnt._id}
            title={cnt.title}
            category={
              isVideo
                ? CONSTANTS.videoCategories[(cnt as UserPublishedVideo).category]
                : CONSTANTS.textCategories[(cnt as UserPublishedText).categoryInd]
            }
            commentsTotal={cnt.comments_id?.length || 0}
            likesTotal={cnt.likes?.length || 0}
            hitsTotal={cnt.hits}
            isVideo={isVideo}
          />
        ))}
      </tbody>
    </table>
  );
});
